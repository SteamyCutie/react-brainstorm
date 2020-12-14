import React from "react";
import { Button, Row } from "shards-react";
import { startMaster, stopMaster } from '../../utils/master';
import { startViewer, stopViewer } from '../../utils/viewer';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../common/config';
import "../../assets/landingpage.css"

import Camera from '../../images/call-camera.svg'
import Phone from '../../images/call-phone.svg'
import FullScreenImg from '../../images/one2one-min-fullscreen.svg'
import PosterImg from '../../images/videobackground.png'
import Mic from '../../images/call-mic.svg'

import MiniEndCall from '../../images/many2many-mini-end.svg'
import MiniFullScreen from '../../images/maximize.png'
import MiniMuteMic from '../../images/many2many-mini-mute-mic.svg'
import MiniMuteVideo from '../../images/many2many-mini-mute-video.svg'

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
import MiniMutedVideo from '../../images/many2many-mini-muted-video.svg'
import ChatBell from '../../images/chat-bell.png'

import { Chat, Channel, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput, MessageLivestream  } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css';
import { ACCESS_API_KEY, ACCESS_TOKEN_SECRET } from '../../common/config';

// const NOT_REGISTERED = 0;
// const REGISTERING = 1;
// const REGISTERED = 2;

// const NO_CALL = 0;
const IN_CALL = 1;
const INCOMING_CALL = 2;
const OUTGOING_CALL = 3;

var chatClient;
var channel;
const jwt = require('jsonwebtoken');

export default class One2OneMin extends React.Component {
  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.state = {
      callState: 0,
      isCallingNow: 0,
      isConnected: 0,
      isDisplay: true,
      isFullscreen: false, 
      isMuted: false,
      isVideoMuted: false,
      newChat: false,
      showChat: false, 
      showWhiteBoard: false, 
      brushColor: '#f44336',
      mode: 'select', 
    };
    this.onIceCandidate = this.onIceCandidate.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleOnBrushColorChange = this.handleOnBrushColorChange.bind(this);
  }

  componentWillMount() {

  }

  componentDidMount() {
    let avatar = localStorage.getItem("avatar");
    let user_name = localStorage.getItem("user_name").replace(" ", "-");

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
  }

  toggle() {
    const { toggle } = this.props;
    // timeout.clearTimeout();
    this.handleStop();
    toggle();
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
      channelName: localStorage.getItem('channel_name'),
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
      channelName: this.props.channel_name,
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

    if (this.props.callState === INCOMING_CALL) {
      this.setState({
        callState: IN_CALL
      })
      const formValues = this.getFormValuesMaster();
      startMaster(this.videoInput, this.videoOutput, formValues, this.onStatsReport, event => {
      });

      var response = {
        id: 'incomingCallResponse',
        from: that.props.from,
        callResponse: 'accept',
        sdpOffer: "offerSdp"
      };
      that.sendMessage(response);
    } else if (this.props.callState === OUTGOING_CALL) {
      const formValues = this.getFormValuesViewer();
      startViewer(this.videoInput, this.videoOutput, formValues, this.onStatsReport, event => {
      });

      var message = {
        id : 'call',
        from : localStorage.getItem("email"),
        name: localStorage.getItem('user_name'), 
        avatarURL: localStorage.getItem("avatar"),
        to : that.props.to,
        sdpOffer : "offerSdp",
        channel_name: this.props.channel_name, 
        description: this.props.description, 
      };
      that.sendMessage(message);
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

  handleFullScreen() {
    this.setState({
      isFullscreen: !this.state.isFullscreen, 
    });

    if (document.getElementById("one2one-call-conatainer").classList.contains("one2one-fullscreen")) {
      document.getElementById("one2one-call-conatainer").classList.remove("one2one-fullscreen");
      document.getElementsByTagName("body")[0].classList.remove("scroll-none")
      document.getElementsByClassName("react-draggable")[0].style.transform = "translate(0px, 0px)";
      document.getElementById("videoInput").classList.remove("fullscreen-other-video");
      // document.getElementById("videoOutput").classList.remove("fullscreen-self-video");
    } else {
      document.getElementsByClassName("react-draggable")[0].style.transform = "translate(69px, -120px)";
      document.getElementById("one2one-call-conatainer").classList.add("one2one-fullscreen");
      document.getElementsByTagName("body")[0].classList.add("scroll-none")
      document.getElementById("videoInput").classList.add("fullscreen-other-video");
      // document.getElementById("videoOutput").classList.add("fullscreen-self-video");
    }
  }

  chat() {
    if (this.state.showWhiteBoard) {
      // master_switchToScreenshare();
    }

    this.setState({
      showChat: !this.state.showChat,
      newChat: false,
    })
  }

  screenShare() {
    // master_switchToScreenshare();
  }

  whiteboard() {
    this.setState({
      showWhiteBoard: !this.state.showWhiteBoard,
      newChat: false,
    });
    console.log("+++++++++++++++++++++++++++++++++");
  }

  handleOnBrushColorChange(color) {
    this.setState({
      brushColor: color.hex,
    });
  }

  render() {
    const { accepted, callState, toName, fromName } = this.props;
    const { mode, isFullscreen, isMuted, isVideoMuted, newChat, showChat, showWhiteBoard, brushColor } = this.state;
    return (
      <div id="one2one-call-conatainer" className={ (callState === INCOMING_CALL) ? "video-call-mini-enable" :(callState === OUTGOING_CALL && accepted) ? "video-call-mini-enable" : "video-call-mini-disable"}>
        <div className="video-call-element-min" id="video-call-element-min">
          {!this.state.isFullscreen && 
            <div className="room-control-container-mini">
              <Button className="btn-rooom-control-mini margin-right-auto" onClick={() => this.handleFullScreen()}>
                <img src={MiniFullScreen} alt="Full Screen"/>
              </Button>
              
              <div>
                <Button className="btn-rooom-control-mini float-center">
                  <img src={MiniMuteMic} alt="Mute mic"/>
                </Button>
                <Button className="btn-rooom-control-mini float-center">
                  <img src={MiniMuteVideo} alt="Mute video"/>
                </Button>
              </div>
              
              <Button className="btn-room-call-decline-mini margin-left-auto" style={{marginRight: "10px", padding: "0px"}} onClick={() => this.toggle()}>
                <img src={MiniEndCall} alt="End"/>
              </Button>
            </div>
          }
          <div id="local-video-container">
            <span style={{color: "#04B5FA", fontWeight: "bold", position: "absolute", background: "#00000099", padding: "0px 6px", borderRadius: "3px", marginTop: "9px", marginLeft: "3px"}}>{localStorage.getItem("user_name")} (You)</span>
            <video id="videoInput" autoPlay width="320px" height="180px" style={{borderRadius: "6px", marginTop: "5px"}} poster={PosterImg} muted></video>
          </div>
          <div>
          {!this.state.isFullscreen && <span style={{color: "#04B5FA", fontWeight: "bold", position: "absolute", background: "#00000099", padding: "0px 6px", borderRadius: "3px", marginTop: "5px", marginLeft: "3px"}}>{this.props.callState === INCOMING_CALL ? fromName: toName}</span>}
          {this.state.isFullscreen && <span style={{color: "#04B5FA", fontWeight: "bold", position: "absolute", background: "#00000099", padding: "0px 6px", borderRadius: "3px", right: "260px", top: "60px"}}>{this.props.callState === INCOMING_CALL ? fromName: toName}</span>}
            <video 
              id="videoOutput" 
              autoPlay
              width="320px" 
              height="180px" 
              className={isFullscreen ? ((showChat || showWhiteBoard) ? "fullscreen-self-video-chat-whiteboard" : "fullscreen-self-video") : null }
              style={{borderRadius: "6px"}} 
              poster={PosterImg}>

            </video>
          </div>
          {/* {this.state.isFullscreen && 
            <Row className="center btn-group-one2one-full">
              <Button className="btn-video-call-mic-camera">
                <img src={Mic} alt="Mic" />
              </Button>
              <Button className="btn-video-call-end" onClick={() => this.toggle()}>
                <img src={Phone} alt="phone"/>
              </Button>
              <Button className="btn-video-call-mic-camera">
                <img src={Camera} alt="Camera" />
              </Button>
              <Button className="btn-rooom-control" onClick={() => this.handleFullScreen()}>
                <img src={FullScreenImg} alt="Full Screen"/>
              </Button>
            </Row>
          } */}
          {isFullscreen && 
            <div className="room-control-container">
              <Button className="btn-rooom-control margin-right-auto" onClick={() => this.handleFullScreen()}>
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
              </div>

              <Button className="btn-room-call-decline margin-left-auto" style={{ marginRight: "10px" }} onClick={() => this.toggle()}>
                <img src={DeclineImg} style={{ height: "60px", width: "60px" }} alt="Decline" />
              </Button>
            </div>
          }
        </div>
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
