import React from "react";
import { Button, Modal, ModalBody, Row } from "shards-react";
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../common/config';
import "../../assets/landingpage.css"

import Camera from '../../images/call-camera.svg'
import Phone from '../../images/call-phone.svg'
import CloseImg from '../../images/one2on-min-close.svg'
import FullScreenImg from '../../images/one2one-min-fullscreen.svg'
import PosterImg from '../../images/logo.png'
import Mic from '../../images/call-mic.svg'
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


/***************************************************/

import { SignalingClient } from 'amazon-kinesis-video-streams-webrtc'
import AWS from 'aws-sdk'

/***************************************************/

const IN_CALL = 1;
const INCOMING_CALL = 2;
const OUTGOING_CALL = 3;

const master = {
	signalingClient: null,
	peerConnectionByClientId: {},
	dataChannelByClientId: {},
	localStream: null,
	remoteStreams: [],
	peerConnectionStatsInterval: null,
}

const viewer = {};

async function startViewer(localView, remoteView, formValues, onStatsReport, onRemoteDataMessage) {
  navigator.mediaDevices.getUserMedia({audio: true});
  var addEventListenerCount = false;

  viewer.localView = localView;
  viewer.remoteView = remoteView;
  
  // Create KVS client
  const kinesisVideoClient = new AWS.KinesisVideo({
      region: formValues.region,
      accessKeyId: formValues.accessKeyId,
      secretAccessKey: formValues.secretAccessKey,
      sessionToken: formValues.sessionToken,
      endpoint: formValues.endpoint,
      correctClockSkew: true,
  });

  // Get signaling channel ARN
  const describeSignalingChannelResponse = await kinesisVideoClient
      .describeSignalingChannel({
          ChannelName: formValues.channelName,
      })
      .promise();
  const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;
  console.log('[VIEWER] Channel ARN: ', channelARN);

  // Get signaling channel endpoints
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
  console.log('[VIEWER] Endpoints: ', endpointsByProtocol);

  const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: formValues.region,
      accessKeyId: formValues.accessKeyId,
      secretAccessKey: formValues.secretAccessKey,
      sessionToken: formValues.sessionToken,
      endpoint: endpointsByProtocol.HTTPS,
      correctClockSkew: true,
  });

  // Get ICE server configuration
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
  console.log('[VIEWER] ICE servers: ', iceServers);

  // Create Signaling Client
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

  // Poll for connection stats
  viewer.peerConnectionStatsInterval = setInterval(() => viewer.peerConnection.getStats().then(onStatsReport), 1000);

  viewer.signalingClient.on('open', async () => {
      console.log('[VIEWER] Connected to signaling service');

      // Get a stream from the webcam, add it to the peer connection, and display it in the local view.
      // If no video/audio needed, no need to request for the sources. 
      // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
      if (formValues.sendVideo || formValues.sendAudio) {
        try {
            viewer.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            viewer.localStream.getTracks().forEach(track => viewer.peerConnection.addTrack(track, viewer.localStream));
            localView.srcObject = viewer.localStream;
        } catch (e) {
            console.error('[VIEWER] Could not find webcam');
        }
      }

      // Create an SDP offer to send to the master
      console.log('[VIEWER] Creating SDP offer');
      await viewer.peerConnection.setLocalDescription(
          await viewer.peerConnection.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
          }),
      );

      // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
      if (formValues.useTrickleICE) {
          console.log('[VIEWER] Sending SDP offer');
          viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
      }
      console.log('[VIEWER] Generating ICE candidates');
  });

  viewer.signalingClient.on('sdpAnswer', async answer => {
      // Add the SDP answer to the peer connection
      console.log('[VIEWER] Received SDP answer');
      await viewer.peerConnection.setRemoteDescription(answer);
  });

  viewer.signalingClient.on('iceCandidate', candidate => {
      // Add the ICE candidate received from the MASTER to the peer connection
      console.log('[VIEWER] Received ICE candidate');
      viewer.peerConnection.addIceCandidate(candidate);
  });

  viewer.signalingClient.on('close', () => {
      console.log('[VIEWER] Disconnected from signaling channel');
  });

  viewer.signalingClient.on('error', error => {
      console.error('[VIEWER] Signaling client error: ', error);
  });

  // Send any ICE candidates to the other peer
  viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
          console.log('[VIEWER] Generated ICE candidate');

          // When trickle ICE is enabled, send the ICE candidates as they are generated.
          if (formValues.useTrickleICE) {
              console.log('[VIEWER] Sending ICE candidate');
              viewer.signalingClient.sendIceCandidate(candidate);
          }
      } else {
          console.log('[VIEWER] All ICE candidates have been generated');

          // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
          if (!formValues.useTrickleICE) {
              console.log('[VIEWER] Sending SDP offer');
              viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
          }
      }
  });

  // As remote tracks are received, add them to the remote view
  viewer.peerConnection.addEventListener('track', event => {
      console.log('[VIEWER] Received remote track');
      // if (remoteView.srcObject) {
      //     return;
      // }
      // viewer.remoteStream = event.streams[0];
      // remoteView.srcObject = viewer.remoteStream;

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

  console.log('[VIEWER] Starting viewer connection');
  viewer.signalingClient.open();
}

function stopViewer() {
  console.log('[VIEWER] Stopping viewer connection');
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

// function sendViewerMessage(message) {
//   if (viewer.dataChannel) {
//       try {
//           viewer.dataChannel.send(message);
//       } catch (e) {
//           console.error('[VIEWER] Send DataChannel: ', e.toString());
//       }
//   }
// }

async function startMaster(localView, remoteView, formValues, onStatsReport, onRemoteDataMessage) {
  navigator.mediaDevices.getUserMedia({audio: true});
  master.localView = localView
  master.remoteView = remoteView

  // Create KVS client
  const kinesisVideoClient = new AWS.KinesisVideo({
      region: formValues.region,
      accessKeyId: formValues.accessKeyId,
      secretAccessKey: formValues.secretAccessKey,
      sessionToken: formValues.sessionToken,
      endpoint: formValues.endpoint,
      correctClockSkew: true,
  })

  // Get signaling channel ARN
  const describeSignalingChannelResponse = await kinesisVideoClient
      .describeSignalingChannel({
          ChannelName: formValues.channelName,
      })
      .promise()
  const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN
  console.log('[MASTER] Channel ARN: ', channelARN)

  // Get signaling channel endpoints
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
  console.log('[MASTER] Endpoints: ', endpointsByProtocol)

  // Create Signaling Client
  // master.signalingClient = new KVSWebRTC.SignalingClient({
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

  // Get ICE server configuration
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
  console.log('[MASTER] ICE servers: ', iceServers)

  const configuration = {
      iceServers,
      iceTransportPolicy: formValues.forceTURN ? 'relay' : 'all',
  }

  const resolution = formValues.widescreen ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } }
  const constraints = {
      video: formValues.sendVideo ? resolution : false,
      audio: formValues.sendAudio,
  }

  // Get a stream from the webcam and display it in the local view. 
  // If no video/audio needed, no need to request for the sources. 
  // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
  if (formValues.sendVideo || formValues.sendAudio) {
    try {
        master.localStream = await navigator.mediaDevices.getUserMedia(constraints)
        localView.srcObject = master.localStream
    } catch (e) {
        console.error('[MASTER] Could not find webcam')
    }
  }

  master.signalingClient.on('open', async () => {
      console.log('[MASTER] Connected to signaling service')
  })

  master.signalingClient.on('sdpOffer', async (offer, remoteClientId) => {
      console.log('[MASTER] Received SDP offer from client: ' + remoteClientId)

      var container = document.getElementById("participants-video-container");
      var participantVideo = document.createElement("video");
      var divContainer = document.createElement("div");
      divContainer.appendChild(participantVideo);
      container.appendChild(divContainer);
      
      participantVideo.id = "participant-video-" + remoteClientId;
      participantVideo.className = "many2many-participant-video";
      participantVideo.autoplay = true;
      participantVideo.poster = PosterImg;
      // participantVideo

      // Create a new peer connection using the offer from the given client
      const peerConnection = new RTCPeerConnection(configuration)
      master.peerConnectionByClientId[remoteClientId] = peerConnection

      if (formValues.openDataChannel) {
          master.dataChannelByClientId[remoteClientId] = peerConnection.createDataChannel('kvsDataChannel')
          peerConnection.ondatachannel = event => {
              event.channel.onmessage = onRemoteDataMessage
          }
      }

      // Poll for connection stats
      if (!master.peerConnectionStatsInterval) {
          master.peerConnectionStatsInterval = setInterval(() => peerConnection.getStats().then(onStatsReport), 1000)
      }

      // Send any ICE candidates to the other peer
      peerConnection.addEventListener('icecandidate', ({ candidate }) => {
          if (candidate) {
              console.log('[MASTER] Generated ICE candidate for client: ' + remoteClientId)

              // When trickle ICE is enabled, send the ICE candidates as they are generated.
              if (formValues.useTrickleICE) {
                  console.log('[MASTER] Sending ICE candidate to client: ' + remoteClientId)
                  master.signalingClient.sendIceCandidate(candidate, remoteClientId)
              }
          } else {
              console.log('[MASTER] All ICE candidates have been generated for client: ' + remoteClientId)
              // When trickle ICE is disabled, send the answer now that all the ICE candidates have ben generated.
              if (!formValues.useTrickleICE) {
                  console.log('[MASTER] Sending SDP answer to client: ' + remoteClientId)
                  master.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId)
              }
          }
      })

      // As remote tracks are received, add them to the remote view
      peerConnection.addEventListener('track', event => {
          console.log('[MASTER] Received remote track from client: ' + remoteClientId)
          
          // if (remoteView.srcObject) {
          //   return
          // }
          // remoteView.srcObject = event.streams[0]

          var participantVideos = document.getElementsByClassName("many2many-participant-video");
          if (participantVideos[participantVideos.length - 1].srcObject) {
            return
          }
          participantVideos[participantVideos.length - 1].srcObject = event.streams[0]
          console.log(participantVideos[participantVideos.length - 1])
      })

      // If there's no video/audio, master.localStream will be null. So, we should skip adding the tracks from it.
      if (master.localStream) {
          master.localStream.getTracks().forEach(track => peerConnection.addTrack(track, master.localStream))
      }
      await peerConnection.setRemoteDescription(offer)

      // Create an SDP answer to send back to the client
      console.log('[MASTER] Creating SDP answer for client: ' + remoteClientId)
      await peerConnection.setLocalDescription(
          await peerConnection.createAnswer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
          }),
      )

      // When trickle ICE is enabled, send the answer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
      if (formValues.useTrickleICE) {
          console.log('[MASTER] Sending SDP answer to client: ' + remoteClientId)
          master.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId)
      }
      console.log('[MASTER] Generating ICE candidates for client: ' + remoteClientId)
  })

  master.signalingClient.on('iceCandidate', async (candidate, remoteClientId) => {
      console.log('[MASTER] Received ICE candidate from client: ' + remoteClientId)

      // Add the ICE candidate received from the client to the peer connection
      const peerConnection = master.peerConnectionByClientId[remoteClientId]
      peerConnection.addIceCandidate(candidate)
  })

  master.signalingClient.on('close', () => {
      console.log('[MASTER] Disconnected from signaling channel')
  })

  master.signalingClient.on('error', () => {
      console.error('[MASTER] Signaling client error')
  })

  console.log('[MASTER] Starting master connection')
  master.signalingClient.open()
}

function stopMaster() {
  console.log('[MASTER] Stopping master connection')
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

// function sendMasterMessage(message) {
//   Object.keys(master.dataChannelByClientId).forEach(clientId => {
//       try {
//           master.dataChannelByClientId[clientId].send(message)
//       } catch (e) {
//           console.error('[MASTER] Send DataChannel: ', e.toString())
//       }
//   })
// }

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
  }

  componentWillMount() {

  }

  toggle() {
    const { toggle } = this.props;
    this.handleStop();
    toggle();
  }

  handleEnd() {
    const { toggle } = this.props;
    this.handleStop();
    
    document.getElementsByTagName("body")[0].classList.remove("scroll-none")
    // toggle();
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
  onStatsReport(report) {
    // TODO: Publish stats
  }
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
      console.log("Channel Name", formValues.channelName)
      startMaster(this.videoInput, this.videoOutput, formValues, this.onStatsReport, event => {
      })

      // var response = {
      //   id: 'incomingCallResponse',
      //   from: that.props.from,
      //   callResponse: 'accept',
      //   sdpOffer: "offerSdp"
      // };
      // that.sendMessage(response);
    } else {
      const formValues = this.getFormValuesViewer();
      startViewer(this.videoInput, this.videoOutput, formValues, this.onStatsReport, event => {
      })
      console.log("Channel Name", formValues.channelName)
      // var message = {
      //   id : 'call',
      //   from : localStorage.getItem("email"),
      //   name: localStorage.getItem('user_name'), 
      //   avatarURL: localStorage.getItem("avatar"),
      //   to : that.props.to,
      //   sdpOffer : "offerSdp",
      //   channel_name: this.props.channel_name, 
      //   description: this.props.description, 
      // };
      // that.sendMessage(message);
    }
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
    stopMaster();
    stopViewer();
    this.props.stop();
  }

  swithFullScreen() {
    this.setState({
      isFullscreen: !this.state.isFullscreen, 
    });

    if (document.getElementById("many2many-call-conatainer").classList.contains("one2one-fullscreen")) {
      document.getElementById("many2many-call-conatainer").classList.remove("one2one-fullscreen");
      document.getElementsByTagName("body")[0].classList.remove("scroll-none")
      document.getElementsByClassName("react-draggable")[0].style.transform = "translate(0px, 0px)";
      // document.getElementById("videoOutput").classList.remove("fullscreen-self-video");

      document.getElementById("room-local-video-container").classList.remove("room-local-video-container-fullscreen");
      document.getElementById("videoInput").classList.remove("room-local-video-fullscreen");
      document.getElementById("participants-video-container").classList.add("participants-video-container");
      document.getElementById("participants-video-container").classList.remove("participants-video-container-fullscreen");
    } else {
      document.getElementsByClassName("react-draggable")[0].style.transform = "translate(69px, -120px)";
      document.getElementById("many2many-call-conatainer").classList.add("one2one-fullscreen");
      document.getElementsByTagName("body")[0].classList.add("scroll-none")
      // document.getElementById("videoOutput").classList.add("fullscreen-self-video");

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
            {/* <div> */}
              {/* <video id="videoOutput" autoPlay width="320px" height="180px" poster={PosterImg}></video> */}
            {/* </div> */}
              {/* <video id="videoOutput1" autoPlay width="320px" height="180px" poster={PosterImg}></video> */}
              {/* <video id="videoOutput2" autoPlay width="320px" height="180px" poster={PosterImg}></video> */}
          </div>
          {this.state.showChat &&
            <div className="room-group-chat">
              <div className="room-chat-header">
                <h2 style={{width: "100%", textAlign: "center", fontSize: "38px", fontWeight: "bold", margin: "0px", marginLeft: "50px"}}>Chat</h2>
                <Button className="btn-rooom-control2 float-center" onClick={() => this.chatClose()}>
                  <img src={WhiteboardCloseImg} alt="Add user"/>
                </Button>
              </div>

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
          {!this.state.isFullscreen && 
            <Row className="center btn-group-call-min">
              {/* <Button className="btn-one2one-min-close" onClick={() => this.toggle()}>
                <img src={CloseImg} alt="close"/>
              </Button>
              <Button className="btn-one2one-min-fullscreen" onClick={() => this.handleFullScreen()}>
                <img src={FullScreenImg} alt="fullscreen"/>
              </Button> */}
            </Row>
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
