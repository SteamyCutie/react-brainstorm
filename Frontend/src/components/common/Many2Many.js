import React from "react";
import { Button, Modal, ModalBody, Row } from "shards-react";
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../common/config';
import "../../assets/landingpage.css"
import { SignalingClient } from 'amazon-kinesis-video-streams-webrtc'
import AWS from 'aws-sdk'
import FullScreenImg from '../../images/one2one-min-fullscreen.svg'
import PosterImg from '../../images/logo.png'
import WhiteboardFullscreenImg from '../../images/whiteboard-fullscreen.svg'
import WhiteboardCloseImg from '../../images/whiteboard-close.svg'
import WhiteBoard, {
  getWhiteBoardData,
  loadWhiteBoardData,
} from 'fabric-whiteboard'
import MuteMicImg from '../../images/mute-microphone.svg'
import MuteVideoImg from '../../images/mute-video.svg'
import ChatImg from '../../images/room-chat.svg'
import ScreenshareImg from '../../images/room-screenshare.svg'
import AddUserImg from '../../images/room-adduser.svg'
import DeclineImg from '../../images/call-decline.svg'

import MiniEndCall from '../../images/many2many-mini-end.svg'
import MiniFullScreen from '../../images/many2many-mini-fullscreen.svg'
import MiniMuteMic from '../../images/many2many-mini-mute-mic.svg'
import MiniMuteVideo from '../../images/many2many-mini-mute-video.svg'

import { Chat, Channel, ChannelHeader, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css';
import { ACCESS_API_KEY, ACCESS_TOKEN_SECRET } from '../../common/config';

var channel;
var chatClient;
const jwt = require('jsonwebtoken');

const IN_CALL = 1;

const master = {
	signalingClient: null,
	peerConnectionByClientId: {},
	dataChannelByClientId: {},
	localStream: [],
	remoteStreams: [],
  peerConnectionStatsInterval: null,
  isCamera: true, 
}

const viewer = {};

async function startViewerMany(localView, remoteView, formValues, onStatsReport, onRemoteDataMessage) {
  var addEventListenerCount = false;

  viewer.localView = localView;
  viewer.remoteView = remoteView;
  
  const kinesisVideoClient = new AWS.KinesisVideo({
      region: formValues.region,
      accessKeyId: formValues.accessKeyId,
      secretAccessKey: formValues.secretAccessKey,
      sessionToken: formValues.sessionToken,
      endpoint: formValues.endpoint,
      correctClockSkew: true,
  });

  const describeSignalingChannelResponse = await kinesisVideoClient
    .describeSignalingChannel({
        ChannelName: formValues.channelName,
    })
    .promise();
  const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;

  const getSignalingChannelEndpointResponse = await kinesisVideoClient
      .getSignalingChannelEndpoint({
          ChannelARN: channelARN,
          SingleMasterChannelEndpointConfiguration: {
              Protocols: ['WSS', 'HTTPS'],
              Role: 'VIEWER',
          },
      })
      .promise();
  const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
      endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
      return endpoints;
  }, {});

  const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: formValues.region,
      accessKeyId: formValues.accessKeyId,
      secretAccessKey: formValues.secretAccessKey,
      sessionToken: formValues.sessionToken,
      endpoint: endpointsByProtocol.HTTPS,
      correctClockSkew: true,
  });

  const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
      .getIceServerConfig({
          ChannelARN: channelARN,
      })
      .promise();
  const iceServers = [];
  if (!formValues.natTraversalDisabled && !formValues.forceTURN) {
      iceServers.push({ urls: `stun:stun.kinesisvideo.${formValues.region}.amazonaws.com:443` });
  }
  if (!formValues.natTraversalDisabled) {
      getIceServerConfigResponse.IceServerList.forEach(iceServer =>
          iceServers.push({
              urls: iceServer.Uris,
              username: iceServer.Username,
              credential: iceServer.Password,
          }),
      );
  }

  viewer.signalingClient = new SignalingClient({
      channelARN,
      channelEndpoint: endpointsByProtocol.WSS,
      clientId: formValues.clientId,
      role: 'VIEWER',
      region: formValues.region,
      credentials: {
          accessKeyId: formValues.accessKeyId,
          secretAccessKey: formValues.secretAccessKey,
          sessionToken: formValues.sessionToken,
      },
      systemClockOffset: kinesisVideoClient.config.systemClockOffset,
  });

  const resolution = formValues.widescreen ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } };
  const constraints = {
    video: formValues.sendVideo ? resolution : false,
    audio: formValues.sendAudio,
  };
  const configuration = {
    iceServers,
    iceTransportPolicy: formValues.forceTURN ? 'relay' : 'all',
  };
  viewer.peerConnection = new RTCPeerConnection(configuration);
  if (formValues.openDataChannel) {
    viewer.dataChannel = viewer.peerConnection.createDataChannel('kvsDataChannel');
    viewer.peerConnection.ondatachannel = event => {
      event.channel.onmessage = onRemoteDataMessage;
    };
  }

  viewer.peerConnectionStatsInterval = setInterval(() => viewer.peerConnection.getStats().then(onStatsReport), 1000);

  viewer.signalingClient.on('open', async () => {
    if (formValues.sendVideo || formValues.sendAudio) {
      try {
          viewer.localStream = await navigator.mediaDevices.getUserMedia(constraints);
          viewer.localStream.getTracks().forEach(track => viewer.peerConnection.addTrack(track, viewer.localStream));
          localView.srcObject = viewer.localStream;
      } catch (e) {
        alert("Could not find camera, Please retry with camera");
        stopViewerMany();
        return;
      }
    }

    await viewer.peerConnection.setLocalDescription(
      await viewer.peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
      }),
    );

    if (formValues.useTrickleICE) {
      viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
    }
  });

  viewer.signalingClient.on('sdpAnswer', async answer => {
    await viewer.peerConnection.setRemoteDescription(answer);
  });

  viewer.signalingClient.on('iceCandidate', candidate => {
    viewer.peerConnection.addIceCandidate(candidate);
  });

  viewer.signalingClient.on('close', () => {});

  viewer.signalingClient.on('error', error => {});

  viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
    if (candidate) {
      if (formValues.useTrickleICE) {
        viewer.signalingClient.sendIceCandidate(candidate);
      }
    } else {
      if (!formValues.useTrickleICE) {
        viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
      }
    }
  });

  viewer.peerConnection.addEventListener('track', event => {
    if (!addEventListenerCount) {
      var container = document.getElementById("participants-video-container");
      var participantVideo = document.createElement("video");
      var divContainer = document.createElement("div");
      divContainer.appendChild(participantVideo);
      container.appendChild(divContainer);
      
      participantVideo.className = "many2many-participant-video";
      participantVideo.autoplay = true;
      participantVideo.poster = PosterImg;

      var participantVideos = document.getElementsByClassName("many2many-participant-video");
      if (participantVideos[participantVideos.length - 1].srcObject) {
        return
      }
      participantVideos[participantVideos.length - 1].srcObject = event.streams[0]

      addEventListenerCount = true;
    } else {
      addEventListenerCount = false;
    }
  });

  viewer.signalingClient.open();
}

function stopViewerMany() {
  if (viewer.signalingClient) {
    viewer.signalingClient.close();
    viewer.signalingClient = null;
  }

  if (viewer.peerConnection) {
    viewer.peerConnection.close();
    viewer.peerConnection = null;
  }

  if (viewer.localStream) {
    viewer.localStream.getTracks().forEach(track => track.stop());
    viewer.localStream = null;
  }

  if (viewer.remoteStream) {
    viewer.remoteStream.getTracks().forEach(track => track.stop());
    viewer.remoteStream = null;
  }

  if (viewer.peerConnectionStatsInterval) {
    clearInterval(viewer.peerConnectionStatsInterval);
    viewer.peerConnectionStatsInterval = null;
  }

  if (viewer.localView) {
    viewer.localView.srcObject = null;
  }

  if (viewer.remoteView) {
    viewer.remoteView.srcObject = null;
  }

  if (viewer.dataChannel) {
    viewer.dataChannel = null;
  }
}

async function startMasterMany(localView, remoteView, formValues, onStatsReport, onRemoteDataMessage) {
  master.localView = localView
  master.remoteView = remoteView

  const kinesisVideoClient = new AWS.KinesisVideo({
    region: formValues.region,
    accessKeyId: formValues.accessKeyId,
    secretAccessKey: formValues.secretAccessKey,
    sessionToken: formValues.sessionToken,
    endpoint: formValues.endpoint,
    correctClockSkew: true,
  })

  const describeSignalingChannelResponse = await kinesisVideoClient
      .describeSignalingChannel({
          ChannelName: formValues.channelName,
      })
      .promise()
  const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN

  const getSignalingChannelEndpointResponse = await kinesisVideoClient
      .getSignalingChannelEndpoint({
          ChannelARN: channelARN,
          SingleMasterChannelEndpointConfiguration: {
              Protocols: ['WSS', 'HTTPS'],
              Role: 'MASTER',
          },
      })
      .promise()
  const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
      endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint
      return endpoints
  }, {})

  master.signalingClient = new SignalingClient({
      channelARN,
      channelEndpoint: endpointsByProtocol.WSS,
      role: 'MASTER',
      region: formValues.region,
      credentials: {
          accessKeyId: formValues.accessKeyId,
          secretAccessKey: formValues.secretAccessKey,
          sessionToken: formValues.sessionToken,
      },
      systemClockOffset: kinesisVideoClient.config.systemClockOffset,
  })

  const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: formValues.region,
      accessKeyId: formValues.accessKeyId,
      secretAccessKey: formValues.secretAccessKey,
      sessionToken: formValues.sessionToken,
      endpoint: endpointsByProtocol.HTTPS,
      correctClockSkew: true,
  })
  const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
      .getIceServerConfig({
          ChannelARN: channelARN,
      })
      .promise()
  const iceServers = []
  if (!formValues.natTraversalDisabled && !formValues.forceTURN) {
      iceServers.push({ urls: `stun:stun.kinesisvideo.${formValues.region}.amazonaws.com:443` })
  }
  if (!formValues.natTraversalDisabled) {
      getIceServerConfigResponse.IceServerList.forEach(iceServer =>
          iceServers.push({
              urls: iceServer.Uris,
              username: iceServer.Username,
              credential: iceServer.Password,
          }),
      )
  }

  const configuration = {
      iceServers,
      iceTransportPolicy: formValues.forceTURN ? 'relay' : 'all',
  }

  const resolution = formValues.widescreen ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } }
  const constraints = {
      video: formValues.sendVideo ? resolution : false,
      audio: formValues.sendAudio,
  }

  if (formValues.sendVideo || formValues.sendAudio) {
    try {
        master.localStream = await navigator.mediaDevices.getUserMedia(constraints)
        localView.srcObject = master.localStream
    } catch (e) {
      alert("Could not find camera, Please retry with camera");
      stopMasterMany();
      return;
    }
  }

  master.signalingClient.on('open', async () => {})

  master.signalingClient.on('sdpOffer', async (offer, remoteClientId) => {
      var container = document.getElementById("participants-video-container");
      var participantVideo = document.createElement("video");
      var divContainer = document.createElement("div");
      divContainer.appendChild(participantVideo);
      container.appendChild(divContainer);
      
      participantVideo.id = "participant-video-" + remoteClientId;
      participantVideo.className = "many2many-participant-video";
      participantVideo.autoplay = true;
      participantVideo.poster = PosterImg;

      const peerConnection = new RTCPeerConnection(configuration)
      master.peerConnectionByClientId[remoteClientId] = peerConnection

      if (formValues.openDataChannel) {
          master.dataChannelByClientId[remoteClientId] = peerConnection.createDataChannel('kvsDataChannel')
          peerConnection.ondatachannel = event => {
              event.channel.onmessage = onRemoteDataMessage
          }
      }

      if (!master.peerConnectionStatsInterval) {
          master.peerConnectionStatsInterval = setInterval(() => peerConnection.getStats().then(onStatsReport), 1000)
      }

      peerConnection.addEventListener('icecandidate', ({ candidate }) => {
          if (candidate) {
              if (formValues.useTrickleICE) {
                  master.signalingClient.sendIceCandidate(candidate, remoteClientId)
              }
          } else {
              if (!formValues.useTrickleICE) {
                  master.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId)
              }
          }
      })

      peerConnection.addEventListener('track', event => {
        var participantVideos = document.getElementsByClassName("many2many-participant-video");
        if (participantVideos[participantVideos.length - 1].srcObject) {
          return
        }
        participantVideos[participantVideos.length - 1].srcObject = event.streams[0]
      })

      if (master.localStream) {
        master.localStream.getTracks().forEach(track => peerConnection.addTrack(track, master.localStream))
      }
      await peerConnection.setRemoteDescription(offer)

      await peerConnection.setLocalDescription(
          await peerConnection.createAnswer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
          }),
      )

      if (formValues.useTrickleICE) {
          master.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId)
      }
  })

  master.signalingClient.on('iceCandidate', async (candidate, remoteClientId) => {
      const peerConnection = master.peerConnectionByClientId[remoteClientId]
      peerConnection.addIceCandidate(candidate)
  })

  master.signalingClient.on('close', () => {})

  master.signalingClient.on('error', () => {})

  master.signalingClient.open()
}

async function master_switchToScreenshare() {
  if (!master.isCamera) {
    document.getElementById("videoInput").srcObject = master.localStream;
    master.isCamera = !master.isCamera;
  } else {
    document.getElementById("videoInput").srcObject = master.localStream;
    master.isCamera = !master.isCamera;
  }
}

function stopMasterMany() {
  if (master.signalingClient) {
      master.signalingClient.close()
      master.signalingClient = null
  }

  Object.keys(master.peerConnectionByClientId).forEach(clientId => {
      master.peerConnectionByClientId[clientId].close()
  })
  master.peerConnectionByClientId = []

  if (master.localStream) {
      master.localStream.getTracks().forEach(track => track.stop())
      master.localStream = null
  }

  master.remoteStreams.forEach(remoteStream => remoteStream.getTracks().forEach(track => track.stop()))
  master.remoteStreams = []

  if (master.peerConnectionStatsInterval) {
      clearInterval(master.peerConnectionStatsInterval)
      master.peerConnectionStatsInterval = null
  }

  if (master.localView) {
      master.localView.srcObject = null
  }

  if (master.remoteView) {
      master.remoteView.srcObject = null
  }

  if (master.dataChannelByClientId) {
      master.dataChannelByClientId = {}
  }
}

export default class Many2Many extends React.Component {
  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.state = {
      callState: 0,
      isCallingNow: 0,
      isConnected: 0,
      isDisplay: true,
      isFullscreen: false, 
      mode: 'select',
      width: '600px',
      height: '600px',
      brushColor: '#f44336',
    };
    this.onIceCandidate = this.onIceCandidate.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleEnd = this.handleEnd.bind(this);

    this.calcBoundsSize = this.calcBoundsSize.bind(this);
    this.handleBoundsSizeChange = this.handleBoundsSizeChange.bind(this);

    this.handleOnModeClick = this.handleOnModeClick.bind(this);
    this.handleOnBrushColorChange = this.handleOnBrushColorChange.bind(this);
  }

  componentWillMount() {}

  toggle() {
    const { toggle } = this.props;
    this.handleStop();
    toggle();
  }

  handleEnd() {
    this.handleStop();
    
    document.getElementsByTagName("body")[0].classList.remove("scroll-none");
  }

  getRandomClientId() {
    return Math.random()
      .toString(36)
      .substring(2)
      .toUpperCase()
  }
  getFormValuesMaster() {
    return {
      region: AWS_REGION,
      channelName: this.props.sessionChannelName,
      clientId: this.getRandomClientId(),
      sendVideo: true,
      sendAudio: true,
      openDataChannel: false,
      widescreen: true,
      fullscreen: false,
      useTrickleICE: true,
      natTraversalDisabled: false,
      forceTURN: false,
      accessKeyId: AWS_ACCESS_KEY_ID,
      endpoint: null,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      sessionToken: null
    }
  }
  getFormValuesViewer() {
    return {
      region: AWS_REGION,
      channelName: this.props.sessionChannelName,
      clientId: this.getRandomClientId(),
      sendVideo: true,
      sendAudio: true,
      openDataChannel: false,
      widescreen: true,
      fullscreen: false,
      useTrickleICE: true,
      natTraversalDisabled: false,
      forceTURN: false,
      accessKeyId: AWS_ACCESS_KEY_ID,
      endpoint: null,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      sessionToken: null
    }
  }
  onStatsReport(report) {}

  componentDidMount() {
    const that = this;
    this.ws = this.props.ws;
    this.videoInput = document.getElementById('videoInput');
    this.videoOutput = document.getElementById('videoOutput');
    var options = {
      localVideo: this.videoInput,
      remoteVideo: this.videoOutput,
      onicecandidate: this.onIceCandidate
    }

    if (this.props.isMaster) {
      this.setState({
        callState: IN_CALL
      })
      const formValues = this.getFormValuesMaster();
      startMasterMany(this.videoInput, this.videoOutput, formValues, this.onStatsReport, event => {
      });

    } else {
      const formValues = this.getFormValuesViewer();
      startViewerMany(this.videoInput, this.videoOutput, formValues, this.onStatsReport, event => {
      });
    }

    let avatar = localStorage.getItem("avatar");
    var user_name = localStorage.getItem("user_name").replace(" ", "-");
    const first_name = user_name.split('-')[0];
    const last_name = user_name.split('-')[1];

    const userToken = jwt.sign({ user_id: user_name }, ACCESS_TOKEN_SECRET);
    chatClient = new StreamChat(ACCESS_API_KEY);
    if (avatar === 'null') {
      avatar = 'https://getstream.io/random_png/?id=' + user_name + '&name=' + user_name.replace("-", "+");
    }
    chatClient.setUser(
      {
        id: user_name,
        name: localStorage.getItem("user_name"),
        image: avatar
      },
      userToken,
    );
    channel = chatClient.channel('messaging', localStorage.getItem('room_id') + '', {
      image: avatar,
      name: 'Talk about the Session',
    });

    this.calcBoundsSize()
    window.addEventListener('resize', this.handleBoundsSizeChange);
  }

  sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    this.ws.send(jsonMessage);
  }

  onIceCandidate(candidate) {
    var message = {
      id: 'onIceCandidate',
      candidate: candidate
    };
    this.sendMessage(message);
  }

  handleStop = () => {
    stopMasterMany();
    stopViewerMany();
    this.props.stop(false);
  }

  swithFullScreen() {
    this.setState({
      isFullscreen: !this.state.isFullscreen, 
    });

    if (document.getElementById("many2many-call-conatainer").classList.contains("one2one-fullscreen")) {
      document.getElementById("many2many-call-conatainer").classList.remove("one2one-fullscreen");
      document.getElementsByTagName("body")[0].classList.remove("scroll-none")
      document.getElementsByClassName("react-draggable")[0].style.transform = "translate(0px, 0px)";

      document.getElementById("room-local-video-container").classList.remove("room-local-video-container-fullscreen");
      document.getElementById("videoInput").classList.remove("room-local-video-fullscreen");
      document.getElementById("participants-video-container").classList.add("participants-video-container");
      document.getElementById("participants-video-container").classList.remove("participants-video-container-fullscreen");
    } else {
      document.getElementsByClassName("react-draggable")[0].style.transform = "translate(69px, -120px)";
      document.getElementById("many2many-call-conatainer").classList.add("one2one-fullscreen");
      document.getElementsByTagName("body")[0].classList.add("scroll-none")

      document.getElementById("room-local-video-container").classList.add("room-local-video-container-fullscreen");
      document.getElementById("videoInput").classList.add("room-local-video-fullscreen");
      document.getElementById("participants-video-container").classList.remove("participants-video-container");
      document.getElementById("participants-video-container").classList.add("participants-video-container-fullscreen");
    }
  }

  chat() {
    this.setState({
      showChat: !this.state.showChat, 
      showWhiteBoard: false, 
    })
  }
  
  screenShare() {
    this.setState({
      showWhiteBoard: !this.state.showWhiteBoard, 
      showChat: false, 
    })
    master_switchToScreenshare();
  }
  
  addUser() {

  }

  chatClose() {
    this.setState({
      showChat: !this.state.showChat, 
    })
  }
  
  whiteboardFullscreen() {

  }

  whiteboardClose() {
    this.setState({
      showWhiteBoard: !this.state.showWhiteBoard, 
    })
  }

  handleOnModeClick(mode) {
    this.setState({
      mode: mode,
    });
  }

  handleOnBrushColorChange(color) {
    this.setState({
      brushColor: color.hex,
    });
  }

  calcBoundsSize() {
    return
    const domApp = document.getElementById('App')
    const domToolbar = document.getElementById('toolbar')

    const domAppStyle = window.getComputedStyle(domApp)
    const domToolbarStyle = window.getComputedStyle(domToolbar)

    this.setState({
      width: domAppStyle.width,
      height: `${parseInt(domAppStyle.height, 10) -
        parseInt(domToolbarStyle.height, 10) -
        20
        }px`,
    })
  }

  handleBoundsSizeChange() {
    this.calcBoundsSize()
  }

  render() {
    const { mode, width, height, brushColor } = this.state;

    return (
      <div id="many2many-call-conatainer" className="video-call-mini-enable">
        <div className="video-call-element-min" id="video-call-element-min">
          {!this.state.isFullscreen && 
            <div className="room-control-container-mini">
              <Button className="btn-rooom-control-mini margin-right-auto" onClick={() => this.swithFullScreen()}>
                <img src={MiniFullScreen} alt="Full Screen"/>
              </Button>
              
              <div className="">
                <Button className="btn-rooom-control-mini float-center">
                  <img src={MiniMuteMic} alt="Mute mic"/>
                </Button>
                <Button className="btn-rooom-control-mini float-center">
                  <img src={MiniMuteVideo} alt="Mute video"/>
                </Button>
              </div>
              
              <Button className="btn-room-call-decline-mini margin-left-auto" style={{marginRight: "10px", padding: "0px"}} onClick={() => this.handleEnd()}>
                <img src={MiniEndCall} alt="End"/>
              </Button>
            </div>
          }
          <div id="room-local-video-container">
            <video id="videoInput" autoPlay width="320px" height="180px" style={{borderRadius: "6px", marginTop: "5px"}} poster={PosterImg} muted></video>
          </div>
          <div id="participants-video-container" className="participants-video-container">
          </div>
          {this.state.showChat &&
            <div className="room-group-chat">
              <div className="room-chat-header">
                <h2 style={{width: "100%", textAlign: "center", fontSize: "38px", fontWeight: "bold", margin: "0px", marginLeft: "50px"}}>Chat</h2>
                <Button className="btn-rooom-control2 float-center" onClick={() => this.chatClose()}>
                  <img src={WhiteboardCloseImg} alt="Add user"/>
                </Button>
              </div>
              <Chat client={chatClient} theme={'messaging light'}>
                <Channel channel={channel}>
                  <Window>
                    <MessageList />
                    <MessageInput />
                  </Window>
                  <Thread />
                </Channel>
              </Chat>
            </div>
          }
          {this.state.showWhiteBoard &&
            <div className="room-whitboard">
              <div className="room-whitboard-header">
                <Button className="btn-rooom-control2 float-center" style={{marginRight: "auto", padding: "0px"}} onClick={() => this.whiteboardFullscreen()}>
                  <img src={WhiteboardFullscreenImg} alt="Add user"/>
                </Button>
                
                <h2 style={{fontSize: "38px", fontWeight: "bold", margin: "0px"}}>Whiteboard</h2>
                <Button className="btn-rooom-control2 float-center" style={{marginLeft: "auto", padding: "0px"}} onClick={() => this.whiteboardClose()}>
                  <img src={WhiteboardCloseImg} alt="Add user"/>
                </Button>
              </div>
              <WhiteBoard
                width={width}
                height={height}
                showToolbar={true}
                showBoard={true}
                mode={mode}
                onModeClick={this.handleOnModeClick}
                brushColor={brushColor}
                brushColors={[
                  '#f44336',
                  '#e91e63',
                  '#9c27b0',
                  '#673ab7',
                  '#3f51b5',
                  '#2196f3',
                ]}
                onBrushColorChange={this.handleOnBrushColorChange}
              />
            </div>
          }
          {this.state.isFullscreen && 
            <div className="room-control-container">
              <Button className="btn-rooom-control margin-right-auto" onClick={() => this.swithFullScreen()}>
                <img src={FullScreenImg} alt="Full Screen"/>
              </Button>
              
              <div className="">
                <Button className="btn-rooom-control float-center">
                  <img src={MuteMicImg} alt="Mute mic"/>
                </Button>
                <Button className="btn-rooom-control float-center">
                  <img src={MuteVideoImg} alt="Mute video"/>
                </Button>
                <Button className="btn-rooom-control float-center" onClick={() => this.chat()}>
                  <img src={ChatImg} alt="Chat"/>
                </Button>
                <Button className="btn-rooom-control float-center" onClick={() => this.screenShare()}>
                  <img src={ScreenshareImg} alt="Screenshare"/>
                </Button>
                <Button className="btn-rooom-control float-center" onClick={() => this.addUser()}>
                  <img src={AddUserImg} alt="Add user"/>
                </Button>
              </div>
              
              <Button className="btn-room-call-decline margin-left-auto" style={{marginRight: "10px"}} onClick={() => this.handleEnd()}>
                <img src={DeclineImg} alt="Phone" style={{height: "60px", width: "60px", color: "#"}} alt="Decline"/>
              </Button>
            </div>
          }
          
        </div>
      </div>
    );
  }
}
