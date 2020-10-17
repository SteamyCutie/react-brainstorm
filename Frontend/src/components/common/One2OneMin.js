import React from "react";
import { Button, Row } from "shards-react";
import { startMaster, stopMaster } from '../../utils/master';
import { startViewer, stopViewer } from '../../utils/viewer';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../common/config';
import "../../assets/landingpage.css"

import Camera from '../../images/call-camera.svg'
import Phone from '../../images/call-phone.svg'
import FullScreenImg from '../../images/one2one-min-fullscreen.svg'
import PosterImg from '../../images/logo.png'
import Mic from '../../images/call-mic.svg'

import MiniEndCall from '../../images/many2many-mini-end.svg'
import MiniFullScreen from '../../images/maximize.png'
import MiniMuteMic from '../../images/many2many-mini-mute-mic.svg'
import MiniMuteVideo from '../../images/many2many-mini-mute-video.svg'

// const NOT_REGISTERED = 0;
// const REGISTERING = 1;
// const REGISTERED = 2;

// const NO_CALL = 0;
const IN_CALL = 1;
const INCOMING_CALL = 2;
const OUTGOING_CALL = 3;

// let timeout = null;

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
    };
    this.onIceCandidate = this.onIceCandidate.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }

  componentWillMount() {

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
      document.getElementById("videoOutput").classList.remove("fullscreen-self-video");
    } else {
      document.getElementsByClassName("react-draggable")[0].style.transform = "translate(69px, -120px)";
      document.getElementById("one2one-call-conatainer").classList.add("one2one-fullscreen");
      document.getElementsByTagName("body")[0].classList.add("scroll-none")
      document.getElementById("videoInput").classList.add("fullscreen-other-video");
      document.getElementById("videoOutput").classList.add("fullscreen-self-video");
    }
  }

  render() {
    const { accepted, callState, toName, fromName } = this.props;
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
            <span style={{color: "#04B5FA", fontWeight: "bold", position: "absolute", background: "#00000099", padding: "0px 6px", borderRadius: "3px", marginTop: "5px", marginLeft: "3px"}}>{this.props.callState === INCOMING_CALL ? fromName: toName}</span>
            <video id="videoOutput" autoPlay width="320px" height="180px" style={{borderRadius: "6px"}} poster={PosterImg}></video>
          </div>
          {this.state.isFullscreen && 
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
          }
        </div>
      </div>
    );
  }
}
