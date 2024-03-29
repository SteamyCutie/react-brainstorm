import React from "react";
import { Button } from "shards-react";
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../common/config';
import {inviteParticipantToRoom} from '../../api/api'
import "../../assets/landingpage.css"
import { SignalingClient } from 'amazon-kinesis-video-streams-webrtc'
import AWS from 'aws-sdk'

import InviteParticipant from './InviteParticipant'
import FullScreenImg from '../../images/one2one-min-fullscreen.svg'
import PosterImg from '../../images/Brainshare_logo.svg'
import WhiteboardCloseImg from '../../images/whiteboard-close.svg'
import WhiteBoard from 'fabric-whiteboard'
import MuteMicImg from '../../images/mute-microphone.svg'
import MutedMicImg from '../../images/muted-microphone.svg'
import MuteVideoImg from '../../images/mute-video.svg'
import MutedVideoImg from '../../images/muted-video.svg'
import ChatImg from '../../images/room-chat.svg'
import ScreenshareImg from '../../images/room-screenshare.svg'
import WhiteboardImg from '../../images/room_whiteboard.svg'
import AddUserImg from '../../images/room-adduser.svg'
import DeclineImg from '../../images/call-decline.svg'
import MiniEndCall from '../../images/many2many-mini-end.svg'
import MiniFullScreen from '../../images/maximize.png'
import MiniMuteMic from '../../images/many2many-mini-mute-mic.svg'
import MiniMutedMic from '../../images/many2many-mini-muted-mic.svg'
import MiniMuteVideo from '../../images/many2many-mini-mute-video.svg'
import MiniMutedVideo from '../../images/many2many-mini-muted-video.svg'
import ChatBell from '../../images/chat-bell.png'

import { Chat, Channel, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput, MessageLivestream  } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css';
import { ACCESS_API_KEY, ACCESS_TOKEN_SECRET } from '../../common/config';

var channel;
var chatClient;
const jwt = require('jsonwebtoken');

const master = {
  signalingClient: null,
  peerConnectionByClientId: {},
  dataChannelByClientId: {},
  localStream: [],
  remoteStreams: [],
  peerConnectionStatsInterval: null,
  isCamera: true,
}

var viewerNamesByClientId = [];
var senders = [];
var viewer = [];
var fullscreenMode = false;
var screenStreamSetted = false;
var cameraStream = null;
var screenStream = null;
var switchStream = false; // true: Screensharing false : cameara

async function startViewerMany(index, localView, remoteView, formValues, onStatsReport, onRemoteDataMessage) {
  viewer[index].localView = localView;
  viewer[index].remoteView = remoteView;
  viewer[index].channelName = formValues.channelName;
  viewer[index].remoteClientId = formValues.clientId;

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

  // Create Signaling Client
  viewer[index].signalingClient = new SignalingClient({
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

  const configuration = {
    iceServers,
    iceTransportPolicy: formValues.forceTURN ? 'relay' : 'all',
  };
  viewer[index].peerConnection = new RTCPeerConnection(configuration);
  if (formValues.openDataChannel) {
    viewer[index].dataChannel = viewer[index].peerConnection.createDataChannel('kvsDataChannel');
    viewer[index].peerConnection.ondatachannel = event => {
      event.channel.onmessage = onRemoteDataMessage;
    };
  }

  // Poll for connection stats
  viewer[index].peerConnectionStatsInterval = setInterval(() => viewer[index].peerConnection.getStats().then(onStatsReport), 1000);

  viewer[index].signalingClient.on('open', async () => {
    console.log('[VIEWER] Connected to signaling service');

    // Get a stream from the webcam, add it to the peer connection, and display it in the local view.
    // If no video/audio needed, no need to request for the sources. 
    // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
    if (formValues.sendVideo || formValues.sendAudio) {
      try {
        const resolution = formValues.widescreen ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } };
        const constraints = {
          video: formValues.sendVideo ? resolution : false,
          audio: formValues.sendAudio,
        };
        if (switchStream) {
          viewer[index].localStream = screenStream;
        } else {
          cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
          viewer[index].localStream = cameraStream;
        }

        viewer[index].localStream.getTracks().forEach(track => senders.push(viewer[index].peerConnection.addTrack(track, viewer[index].localStream)));
        localView.srcObject = viewer[index].localStream;
      } catch (e) {
        // console.error('[VIEWER] Could not find webcam');
        try {
          const constraints = {
            audio: formValues.sendAudio,
          };

          cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
          viewer[index].localStream = cameraStream;
          viewer[index].localStream.getTracks().forEach(track => senders.push(viewer[index].peerConnection.addTrack(track, viewer[index].localStream)));
          localView.srcObject = viewer[index].localStream;
        } catch (e) {
          // console.error('[VIEWER] Could not find audio device');
        }
      }
    }

    // Create an SDP offer to send to the master
    console.log('[VIEWER] Creating SDP offer');
    await viewer[index].peerConnection.setLocalDescription(
      await viewer[index].peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      }),
    );

    if (formValues.useTrickleICE) {
      console.log('[VIEWER] Sending SDP offer');
      viewer[index].signalingClient.sendSdpOffer(viewer[index].peerConnection.localDescription);
    }
  });

  viewer[index].signalingClient.on('sdpAnswer', async answer => {
    // Add the SDP answer to the peer connection
    console.log('[VIEWER] Received SDP answer');
    await viewer[index].peerConnection.setRemoteDescription(answer);
  });

  viewer[index].signalingClient.on('iceCandidate', candidate => {
    // Add the ICE candidate received from the MASTER to the peer connection
    console.log('[VIEWER] Received ICE candidate');
    viewer[index].peerConnection.addIceCandidate(candidate);
  });

  viewer[index].signalingClient.on('close', () => {
    console.log('[VIEWER] Disconnected from signaling channel');
  });

  viewer[index].signalingClient.on('error', error => {
    console.error('[VIEWER] Signaling client error: ', error);
  });

  // Send any ICE candidates to the other peer
  viewer[index].peerConnection.addEventListener('icecandidate', ({ candidate }) => {
    if (candidate) {
      console.log('[VIEWER] Generated ICE candidate');

      // When trickle ICE is enabled, send the ICE candidates as they are generated.
      if (formValues.useTrickleICE) {
        console.log('[VIEWER] Sending ICE candidate');
        viewer[index].signalingClient.sendIceCandidate(candidate);
      }
    } else {
      console.log('[VIEWER] All ICE candidates have been generated');

      // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
      if (!formValues.useTrickleICE) {
        console.log('[VIEWER] Sending SDP offer');
        viewer[index].signalingClient.sendSdpOffer(viewer[index].peerConnection.localDescription);
      }
    }
  });

  // As remote tracks are received, add them to the remote view
  viewer[index].peerConnection.addEventListener('track', event => {
    console.log('[VIEWER] Received remote track');
  });

  console.log('[VIEWER] Starting viewer connection');
  viewer[index].signalingClient.open();
}

function stopViewerMany(index) {
  console.log('[VIEWER] Stopping viewer connection');
  if (viewer[index].signalingClient) {
    viewer[index].signalingClient.close();
    viewer[index].signalingClient = null;
  }

  if (viewer[index].peerConnection) {
    viewer[index].peerConnection.close();
    viewer[index].peerConnection = null;
  }

  if (viewer[index].localStream) {
    viewer[index].localStream.getTracks().forEach(track => track.stop());
    viewer[index].localStream = null;
  }

  if (viewer[index].remoteStream) {
    viewer[index].remoteStream.getTracks().forEach(track => track.stop());
    viewer[index].remoteStream = null;
  }

  if (viewer[index].peerConnectionStatsInterval) {
    clearInterval(viewer[index].peerConnectionStatsInterval);
    viewer[index].peerConnectionStatsInterval = null;
  }

  if (viewer[index].localView) {
    viewer[index].localView.srcObject = null;
  }

  if (viewer[index].remoteView) {
    viewer[index].remoteView.srcObject = null;
  }

  if (viewer[index].dataChannel) {
    viewer[index].dataChannel = null;
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

  if (formValues.sendVideo || formValues.sendAudio) {
    try {
      const resolution = formValues.widescreen ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } }
      const constraints = {
        video: formValues.sendVideo ? resolution : false,
        audio: formValues.sendAudio,
      }
      cameraStream = await navigator.mediaDevices.getUserMedia(constraints)
      master.localStream = cameraStream
      localView.srcObject = master.localStream
    } catch (e) {
      master.localStream = null;
      console.error('[MASTER] Could not find webcam');
      try {
        const constraints = {
          audio: formValues.sendAudio,
        }
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints)
        master.localStream = cameraStream
        localView.srcObject = master.localStream
      } catch (e) {
        console.error('[MASTER] Could not find audio device');
      }
    }
  }

  master.signalingClient.on('open', async () => { })

  master.signalingClient.on('sdpOffer', async (offer, remoteClientId) => {
    var container = document.getElementById("participants-video-container");
    var participantVideo = document.createElement("video");
    var divContainer = document.createElement("div");
    var namespan = document.createElement("span");
    divContainer.appendChild(participantVideo);
    divContainer.appendChild(namespan);
    container.appendChild(divContainer);

    divContainer.id = "master-participant-container-" + remoteClientId
    divContainer.style = "position: relative";
    divContainer.onclick = selectParticipantVideo;

    participantVideo.id = "participant-video-" + remoteClientId;
    participantVideo.className = "many2many-participant-video";
    participantVideo.autoplay = true;
    participantVideo.poster = PosterImg;

    var index = 0
    while (viewerNamesByClientId[index].clientId !== remoteClientId && index < viewerNamesByClientId.length) {
      index++;
    }

    namespan.textContent = viewerNamesByClientId[index].name;
    namespan.id = "participant-name-" + viewerNamesByClientId[index].clientId;
    namespan.style = "position: absolute; left: 0px; color: #04B5FA; font-weight: bold; padding: 0px 6px; background: #00000099; border-radius: 3px; margin-top: 3px; margin-left: 3px"

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

  master.signalingClient.on('close', () => { })

  master.signalingClient.on('error', () => { })

  master.signalingClient.open()
}

async function master_switchToScreenshare() {
  if (!screenStreamSetted) {
    const constraints = {
      video: true,
      audio: false,
    }

    screenStream = await navigator.mediaDevices.getDisplayMedia(constraints)
    screenStreamSetted = true;

    if (senders.length === 0) {
      switchStream = true;
      return;
    }

    senders.find(sender => sender.track.kind === 'video').replaceTrack(screenStream.getTracks()[0]);
    switchStream = true;
  } else {
    if (senders.length === 0) {
      switchStream = !switchStream;
      return;
    }

    if (switchStream) {
      senders.find(sender => sender.track.kind === 'video').replaceTrack(cameraStream.getTracks()[1]);
    } else {
      senders.find(sender => sender.track.kind === 'video').replaceTrack(screenStream.getTracks()[0]);
    }
    switchStream = !switchStream;
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

  if (cameraStream) {
    cameraStream = null;
  }

  if (screenStream) {
    screenStream.getTracks().forEach((track) => {
      track.stop();
    });

    screenStream = null;
    screenStreamSetted = false;
  }

  if (switchStream) {
    switchStream = false;
  }

  if (senders) {
    senders = [];
  }
}


function selectParticipantVideo(e) {
  if (!fullscreenMode)
    return;

  var temp = e.target.id.split("-");
  var participantId = temp[temp.length - 1];
  var selectParticipantVideo = document.getElementById("participant-video-" + participantId);
  var selectedVideoViewer = document.getElementById("selected-video-output");

  selectedVideoViewer.srcObject = selectParticipantVideo.srcObject;
}

export default class Many2Many extends React.Component {
  constructor(props) {
    super(props);

    this.inviteParticipantRef = React.createRef();
    this.state = {
      callState: 0,
      isCallingNow: 0,
      isConnected: 0,
      isDisplay: true,
      isFullscreen: false,
      mode: 'select',
      width: '1800px',
      height: '600px',
      brushColor: '#f44336',
      isMuted: false,
      isVideoMuted: false,
      inviteModal: false,
      roomMembers: [],
      whiteBoardFullScreen: false,
      newChat: false,
      sessionStarted: false,
      sessionTimeLabel: "00:00:00",
    };

    this.sessionTimerCount = 0;
    this.sessionTimer = null;
    this.handleStop = this.handleStop.bind(this);
    this.handleEnd = this.handleEnd.bind(this);

    this.calcBoundsSize = this.calcBoundsSize.bind(this);
    this.handleBoundsSizeChange = this.handleBoundsSizeChange.bind(this);

    this.handleOnModeClick = this.handleOnModeClick.bind(this);
    this.handleOnBrushColorChange = this.handleOnBrushColorChange.bind(this);

    this.existingParticipants = this.existingParticipants.bind(this);
    this.newParticipant = this.newParticipant.bind(this);
    this.leftRoom = this.leftRoom.bind(this);
    this.invitedToRoom = this.invitedToRoom.bind(this);
  }

  sessionTimeCount() {
    var currentTime = this.sessionTimerCount;
    currentTime++;
    this.sessionTimerCount = currentTime;

    var second = currentTime % 60;
    if (second < 10)
      second = "0" + second;
    var minute = Math.floor((currentTime / 60)) % 60;
    if (minute < 10)
      minute = "0" + minute;
    var hour = Math.floor(Math.floor((currentTime / 60)) / 60);
    if (hour < 10)
      hour = "0" + hour

    this.setState({
      sessionTimeLabel: hour + ":" + minute + ":" + second,
    });
  }

  handleEnd() {
    clearInterval(this.sessionTimer);
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
      channelName: localStorage.getItem("channel_name"),
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
  onStatsReport(report) { }

  componentDidMount() {
    this.ws = this.props.ws;
    this.videoInput = document.getElementById('videoInput');
    this.videoOutput = document.getElementById('videoOutput');

    const formValues = this.getFormValuesMaster();
    startMasterMany(this.videoInput, this.videoOutput, formValues, this.onStatsReport, event => {
    });

    let avatar = localStorage.getItem("avatar");
    var user_name = localStorage.getItem("user_name").replace(" ", "-");

    const userToken = jwt.sign({ user_id: user_name }, ACCESS_TOKEN_SECRET);
    chatClient = new StreamChat(ACCESS_API_KEY, { timeout: 6000 });
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

    channel.on(event => {
      if (event.type === 'message.new' && !this.state.showChat) {
       console.log("New message arrived.");
        this.setState({
          newChat: true,
        })
      }

      if (event.type === 'message.read' && !event.total_unread_count) {
        
      }
    });

    this.calcBoundsSize()
    window.addEventListener('resize', this.handleBoundsSizeChange);

    this.startSessionTimer();
  }

  sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    this.ws.send(jsonMessage);
  }

  handleStop = () => {
    stopMasterMany();
    viewer.forEach((participant, index) => {
      stopViewerMany(index);
    });

    var elements = document.getElementsByClassName("master-participant-container");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }

    viewer = [];
    fullscreenMode = false;
    this.props.stopMany2Many(parseFloat(this.sessionTimerCount / 60).toFixed(2));
  }

  swithFullScreen() {
    if (this.state.showWhiteBoard) {
      // master_switchToScreenshare();
    }

    this.setState({
      isFullscreen: !this.state.isFullscreen,
    });

    fullscreenMode = !fullscreenMode;

    document.getElementById("room-local-video-container").classList.remove("room-local-video-container-fullscreen-chat");
    document.getElementById("participants-video-container").classList.remove("participants-video-container-full-chat");
    document.getElementById("room-local-video-container").classList.remove("room-local-video-container-fullscreen-screenshare");
    document.getElementById("participants-video-container").classList.remove("participants-video-container-full-screenshare");

    if (this.state.showChat && !this.state.isFullscreen) {
      document.getElementById("room-local-video-container").classList.add("room-local-video-container-fullscreen-chat");
      document.getElementById("participants-video-container").classList.add("participants-video-container-full-chat");
    }

    if (this.state.showWhiteBoard && !this.state.isFullscreen) {
      document.getElementById("room-local-video-container").classList.add("room-local-video-container-fullscreen-screenshare");
      document.getElementById("participants-video-container").classList.add("participants-video-container-full-screenshare");
    }

    if (document.getElementById("many2many-call-conatainer").classList.contains("one2one-fullscreen")) {
      document.getElementById("many2many-call-conatainer").classList.remove("one2one-fullscreen");
      document.getElementsByTagName("body")[0].classList.remove("scroll-none")
      document.getElementsByClassName("react-draggable")[0].style.transform = "translate(0px, 0px)";

      document.getElementById("room-local-video-container").classList.remove("room-local-video-container-fullscreen");
      document.getElementById("videoInput").classList.remove("room-local-video-fullscreen");
      document.getElementById("participants-video-container").classList.add("participants-video-container");
      document.getElementById("participants-video-container").classList.remove("participants-video-container-fullscreen");
      document.getElementById("local-video-name").classList.add("local-video-name");
      document.getElementById("local-video-name").classList.remove("local-video-name-fullscreen");
    } else {
      document.getElementsByClassName("react-draggable")[0].style.transform = "translate(69px, -120px)";
      document.getElementById("many2many-call-conatainer").classList.add("one2one-fullscreen");
      document.getElementsByTagName("body")[0].classList.add("scroll-none")

      document.getElementById("room-local-video-container").classList.add("room-local-video-container-fullscreen");
      document.getElementById("videoInput").classList.add("room-local-video-fullscreen");
      document.getElementById("participants-video-container").classList.remove("participants-video-container");
      document.getElementById("participants-video-container").classList.add("participants-video-container-fullscreen");
      document.getElementById("local-video-name").classList.remove("local-video-name");
      document.getElementById("local-video-name").classList.add("local-video-name-fullscreen");
    }
  }

  muteAudio() {
    this.setState({
      isMuted: !this.state.isMuted,
    });

    master.localStream.getTracks().forEach(track => {
      if (track.kind === "audio") {
        track.enabled = !track.enabled;
      }
    });

    viewer.forEach(participant => {
      participant.localStream.getTracks().forEach(track => {
        if (track.kind === "audio") {
          track.enabled = !track.enabled;
        }
      })
    });
  }

  muteVideo() {
    this.setState({
      isVideoMuted: !this.state.isVideoMuted,
    })
    
    senders.forEach((sender) => {
      if (sender.track.kind === 'video') {
        sender.track.enabled = !sender.track.enabled;
      }
    })
  }

  chat() {
    if (this.state.showWhiteBoard) {
      master_switchToScreenshare();
    }

    this.setState({
      showChat: !this.state.showChat,
      newChat: false,
    })
  }

  screenShare() {
    master_switchToScreenshare();
  }

  whiteboard() {
    this.setState({
      showWhiteBoard: !this.state.showWhiteBoard,
      newChat: false,
    })
  }

  addUser() {

  }

  chatClose() {
    this.setState({
      showChat: !this.state.showChat,
      newChat: false,
    })

    if (this.state.showChat) {
      document.getElementById("room-local-video-container").classList.remove("room-local-video-container-fullscreen-chat")
      document.getElementById("room-local-video-container").classList.add("room-local-video-container-fullscreen")

      document.getElementById("participants-video-container").classList.remove("participants-video-container-full-chat");
      document.getElementById("participants-video-container").classList.add("participants-video-container-full");
    } else {
      document.getElementById("room-local-video-container").classList.remove("room-local-video-container-fullscreen")
      document.getElementById("room-local-video-container").classList.add("room-local-video-container-fullscreen-chat")

      document.getElementById("participants-video-container").classList.remove("participants-video-container-full");
      document.getElementById("participants-video-container").classList.add("participants-video-container-full-chat");
    }
  }

  whiteboardFullscreen() {
    const { whiteBoardFullScreen } = this.state;
    if (whiteBoardFullScreen) {
      document.getElementById("room-whiteboard").classList.remove("room-whiteboard-fullscreen")
      document.getElementById("room-whiteboard").classList.add("room-whiteboard");

      document.getElementsByClassName("canvas-container")[0].style.width = "600px";
      document.getElementsByClassName("upper-canvas")[0].style.width = "600px";
      document.getElementsByClassName("upper-canvas")[0].width = 600;
    } else {
      document.getElementById("room-whiteboard").classList.remove("room-whiteboard");
      document.getElementById("room-whiteboard").classList.add("room-whiteboard-fullscreen")

      document.getElementsByClassName("canvas-container")[0].style.width = document.getElementById("room-whiteboard").offsetWidth - 5 + "px";
      document.getElementsByClassName("upper-canvas")[0].style.width = document.getElementById("room-whiteboard").offsetWidth - 5 + "px";
      document.getElementsByClassName("upper-canvas")[0].width = document.getElementById("room-whiteboard").offsetWidth - 5;
    }

    this.setState({
      whiteBoardFullScreen: !whiteBoardFullScreen,
      width: document.getElementById("room-whiteboard").offsetWidth - 5,
    });
  }

  whiteboardClose() {
    this.setState({
      showWhiteBoard: !this.state.showWhiteBoard,
    })

    master_switchToScreenshare();

    if (this.state.showWhiteBoard) {
      document.getElementById("room-local-video-container").classList.remove("room-local-video-container-fullscreen-screenshare")
      document.getElementById("room-local-video-container").classList.add("room-local-video-container-fullscreen")

      document.getElementById("participants-video-container").classList.remove("participants-video-container-full-screenshare");
      document.getElementById("participants-video-container").classList.add("participants-video-container-full");
    } else {
      document.getElementById("room-local-video-container").classList.remove("room-local-video-container-fullscreen")
      document.getElementById("room-local-video-container").classList.add("room-local-video-container-fullscreen-screenshare")

      document.getElementById("participants-video-container").classList.remove("participants-video-container-full");
      document.getElementById("participants-video-container").classList.add("participants-video-container-full-screenshare");
    }
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
    // const domApp = document.getElementById('App')
    // const domToolbar = document.getElementById('toolbar')

    // const domAppStyle = window.getComputedStyle(domApp)
    // const domToolbarStyle = window.getComputedStyle(domToolbar)

    // this.setState({
    //   width: domAppStyle.width,
    //   height: `${parseInt(domAppStyle.height, 10) -
    //     parseInt(domToolbarStyle.height, 10) -
    //     20
    //     }px`,
    // })
  }

  handleBoundsSizeChange() {
    this.calcBoundsSize()
  }

  existingParticipants(participants) {
    var room_members = [];
    participants.forEach((participant, index) => {
      viewer.push({});
      viewerNamesByClientId.push({ name: participant.userName, clientId: participant.channelName });
      room_members.push(participant.userId);

      var container = document.getElementById("participants-video-container");
      var participantVideo = document.createElement("video");
      var masterVideo = document.createElement("video");
      var divContainer = document.createElement("div");
      divContainer.appendChild(participantVideo);
      divContainer.appendChild(masterVideo);
      container.appendChild(divContainer);

      divContainer.id = "participant-container-" + participant.channelName
      participantVideo.id = participant.channelName;
      participantVideo.style = "display: none";
      participantVideo.autoplay = true;
      participantVideo.muted = true;
      participantVideo.poster = PosterImg;

      masterVideo.id = participant.channelName + "-master";
      masterVideo.style = "display: none";
      masterVideo.autoplay = true;
      masterVideo.muted = true;
      masterVideo.poster = PosterImg;

      // Start Viewer
      const formValues = {
        region: AWS_REGION,
        channelName: participant.channelName,
        clientId: localStorage.getItem("channel_name"),
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

      startViewerMany(index, masterVideo, participantVideo, formValues, this.onStatsReport, event => {
      });
    })

    this.setState({
      roomMembers: room_members,
    })
  }

  newParticipant(channelName, userName, userId) {
    viewer.push({});
    viewerNamesByClientId.push({ name: userName, clientId: channelName });

    const { roomMembers } = this.state;
    var temp = roomMembers;
    temp.push(userId);

    var index = viewer.length - 1;
    var container = document.getElementById("participants-video-container");
    var participantVideo = document.createElement("video");
    var masterVideo = document.createElement("video");
    var divContainer = document.createElement("div");
    divContainer.appendChild(participantVideo);
    divContainer.appendChild(masterVideo);
    container.appendChild(divContainer);

    participantVideo.id = channelName;
    participantVideo.style = "display: none";
    participantVideo.autoplay = true;
    participantVideo.muted = true;
    participantVideo.poster = PosterImg;

    masterVideo.id = channelName + "-master";
    masterVideo.style = "display: none";
    masterVideo.autoplay = true;
    masterVideo.muted = true;
    masterVideo.poster = PosterImg;

    // Start Viewer
    const formValues = {
      region: AWS_REGION,
      channelName: channelName,
      clientId: localStorage.getItem("channel_name"),
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

    startViewerMany(index, masterVideo, participantVideo, formValues, this.onStatsReport, event => {
    });

    this.setState({
      roomMembers: temp,
    })

    // this.inviteParticipantRef.current.updateRoomMember(userId);
  }

  leftRoom(channelName) {
    var index = 0;

    // Stop Viewer
    for (index = 0; index < viewer.length; index++) {
      if (viewer[index].channelName === channelName) {
        stopViewerMany(index);
        document.getElementById("master-participant-container-" + channelName).remove();
        // document.getElementById("participant-name-" + channelName).remove();
        viewer.splice(index, 1);
        senders.splice(2 * index, 2);
        // senders.slice(2 * index, 1);
        break;
      }
    }
  }

  invitedToRoom(roomName) {
    console.log("You have invitation in Room" + roomName);
  }

  localVideoClick() {
    if (!this.state.isFullscreen)
      return

    document.getElementById("selected-video-output").srcObject = document.getElementById("videoInput").srcObject;
  }

  inviteParticipantToRoom() {

    this.setState({
      inviteModal: true,
    })
  }

  handleInvite(email) {
    var message = {
      id: 'inviteParticipant',
      roomName: localStorage.getItem("room_id"),
      participantId: email,
    };

    this.sendMessage(message);

    this.inviteToRoom(localStorage.getItem("room_id"), email);
  }

  inviteToRoom = async(roomId, email) => {
    const param = {
      roomName: roomId,
      participantId: email, 
    }

    try {
      const result = await inviteParticipantToRoom(param);
      console.log(result);
    } catch(error) {
      console.log(error);
    }
  }

  handleInviteClose() {
    this.setState({
      inviteModal: false,
    })
  }

  startSessionTimer() {
    if (!this.state.sessionStarted) {
      this.sessionTimerCount = 0;
      this.setState({
        sessionStarted: true,
      })

      this.sessionTimer = setInterval(() => {
        this.sessionTimeCount();
      }, 1000)
    } else {
      this.showFail("Sorry. The session is already started.")
    }
  }

  render() {
    const { mode, brushColor, isMuted, isVideoMuted, isFullscreen, showWhiteBoard, newChat, showChat, inviteModal, roomMembers, sessionTimeLabel } = this.state;

    return (
      <div id="many2many-call-conatainer" className="video-call-mini-enable">
        <div className={isFullscreen ? "session-timer-controls" : "session-timer-controls-mini"}>
          <label>{sessionTimeLabel}</label>
        </div>
        <div className={(showChat || showWhiteBoard) ? "video-call-element-min-chat-whiteboard" : "video-call-element-min"} id="video-call-element-min">
          {!isFullscreen &&
            <div className="room-control-container-mini">
              <Button className="btn-rooom-control-mini margin-right-auto" onClick={() => this.swithFullScreen()}>
                <img src={MiniFullScreen} alt="Full Screen" />
              </Button>

              <div className="">
                <Button className="btn-rooom-control-mini float-center" onClick={() => this.muteAudio()}>
                  <img src={isMuted ? MiniMutedMic : MiniMuteMic} alt="Mute mic" />
                </Button>
                <Button className="btn-rooom-control-mini float-center" onClick={() => this.muteVideo()}>
                  <img src={isVideoMuted ? MiniMutedVideo : MiniMuteVideo} alt="Mute video" />
                </Button>
              </div>

              <Button className="btn-room-call-decline-mini margin-left-auto" style={{ marginRight: "10px", padding: "0px" }} onClick={() => this.handleEnd()}>
                <img src={MiniEndCall} alt="End" />
              </Button>
            </div>
          }
          {isFullscreen &&
            <video id="selected-video-output" className={(showChat || showWhiteBoard) ? "selected-video-output-chat-whiteboard" : "selected-video-output"} autoPlay poster={PosterImg} muted>

            </video>
          }
          <div id="room-local-video-container">
            <div style={{ position: "relative" }}>
              <video id="videoInput" autoPlay width="320px" height="180px" style={{ borderRadius: "6px", marginTop: "5px" }} poster={PosterImg} muted onClick={() => this.localVideoClick()}></video>
              <span id="local-video-name" className="local-video-name">{localStorage.getItem("user_name")} (You)</span>
            </div>
          </div>
          <div id="participants-video-container" className={this.state.isFullscreen ? "participants-video-container-full" : "participants-video-container-mini"}>
            <video id="videoOutput" style={{ display: "none" }}></video>
          </div>
          {isFullscreen &&
            <div className="room-control-container">
              <Button className="btn-rooom-control margin-right-auto" onClick={() => this.swithFullScreen()}>
                <img src={FullScreenImg} alt="Full Screen" />
              </Button>

              <div className="">
                <Button className="btn-rooom-control float-center" onClick={() => this.muteAudio()}>
                  <img src={isMuted ? MutedMicImg : MuteMicImg} alt="Mute mic" />
                </Button>
                <Button className="btn-rooom-control float-center" onClick={() => this.muteVideo()}>
                  <img src={isVideoMuted ? MutedVideoImg : MuteVideoImg} alt="Mute video" />
                </Button>
                <Button className="btn-rooom-control float-center" onClick={() => this.chat()}>
                  <img src={ChatImg} alt="Chat" />
                  {newChat && <img src={ChatBell} className="img-room-caht-bell" alt="newChat" />}
                </Button>
                <Button className="btn-rooom-control float-center" onClick={() => this.screenShare()}>
                  <img src={ScreenshareImg} alt="Screenshare" />
                </Button>
                <Button className="btn-rooom-control float-center" onClick={() => this.whiteboard()}>
                  <img src={WhiteboardImg} alt="Whiteboard" />
                </Button>
                <Button className="btn-rooom-control float-center" onClick={() => this.inviteParticipantToRoom()}>
                  <img src={AddUserImg} alt="Add user" />
                </Button>
              </div>

              <Button className="btn-room-call-decline margin-left-auto" style={{ marginRight: "10px" }} onClick={() => this.handleEnd()}>
                <img src={DeclineImg} style={{ height: "60px", width: "60px" }} alt="Decline" />
              </Button>
            </div>
          }
        </div>
        <InviteParticipant
          open={inviteModal}
          ref={this.inviteParticipantRef}
          roomMembers={roomMembers}
          onInvite={(email) => this.handleInvite(email)}
          onInviteClose={() => this.handleInviteClose()}
        />
        {isFullscreen ?
          <div className="chat-whiteboard-container">
            <div className={showChat ? (showWhiteBoard ? "room-group-chat" : "room-group-chat-full-width") : "room-group-chat-hidden"}>
              <div className="room-chat-header">
                <h2 style={{ width: "100%", textAlign: "center", fontSize: "38px", fontWeight: "bold", margin: "0px", marginLeft: "50px" }}>Chat</h2>
                <Button className="btn-rooom-control2 float-center" onClick={() => this.chatClose()}>
                  <img src={WhiteboardCloseImg} alt="Add user" />
                </Button>
              </div>
              <Chat client={chatClient} theme={'livestream light'}>
                <Channel channel={channel} Message={MessageLivestream}>
                  <Window hideOnThread> 
                      <MessageList />
                    <MessageInput focus/>
                  </Window>
                  <Thread fullWidth />
                </Channel>
              </Chat>
            </div>
            <div className={showWhiteBoard ? (showChat ? "room-whiteboard" : "room-whiteboard-full-width") : "room-whiteboard-hidden"}>
              <div className="room-whitboard-header">
                <h2 style={{ fontSize: "38px", fontWeight: "bold", margin: "0px", width: "100%", textAlign: "center" }}>Whiteboard</h2>
                <Button className="btn-rooom-control2 float-center" style={{ marginLeft: "auto", padding: "0px" }} onClick={() => this.whiteboardClose()}>
                  <img src={WhiteboardCloseImg} alt="Add user" />
                </Button>
              </div>
              <WhiteBoard
                className="room-whiteboard-body"
                // width={width}
                // height={height}
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
          </div>
          : null
        }
      </div>
    );
  }
}
