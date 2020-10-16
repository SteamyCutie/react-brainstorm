import React from "react";
import { Button, Modal, ModalBody, Row } from "shards-react";
import { startMaster, stopMaster } from '../../utils/master';
import { startViewer, stopViewer } from '../../utils/viewer';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../common/config';
import "../../assets/landingpage.css"
import kurentoUtils from 'kurento-utils';

import Camera from '../../images/call-camera.svg'
import Phone from '../../images/call-phone.svg'
import CloseImg from '../../images/one2on-min-close.svg'
import FullScreenImg from '../../images/one2one-min-fullscreen.svg'
import PosterImg from '../../images/logo.png'
import Mic from '../../images/call-mic.svg'

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
    const { open, accepted, callState } = this.props;
    return (
      <div id="one2one-call-conatainer" className={ (callState === INCOMING_CALL) ? "video-call-mini-enable" :(callState === OUTGOING_CALL && accepted) ? "video-call-mini-enable" : "video-call-mini-disable"}>
        <div className="video-call-element-min" id="video-call-element-min">
          <div>
            <video id="videoInput" autoPlay width="320px" height="180px" poster={PosterImg} muted></video>
          </div>
          <div>
            <video id="videoOutput" autoPlay width="320px" height="180px" poster={PosterImg}></video>
          </div>
          {!this.state.isFullscreen && 
            <Row className="center btn-group-call-min">
              <Button className="btn-one2one-min-close" onClick={() => this.toggle()}>
                <img src={CloseImg} alt="close"/>
              </Button>
              <Button className="btn-one2one-min-fullscreen" onClick={() => this.handleFullScreen()}>
                <img src={FullScreenImg} alt="fullscreen"/>
              </Button>
            </Row>
          }
          {this.state.isFullscreen && 
            <Row className="center btn-group-one2one-full">
              <Button className="btn-video-call-mic-camera">
                <img src={Mic} placeholder="Mic" />
              </Button>
              <Button className="btn-video-call-end" onClick={() => this.toggle()}>
                <img src={Phone} placeholder="Phone" alt="phone"/>
              </Button>
              <Button className="btn-video-call-mic-camera">
                <img src={Camera} placeholder="Camera" />
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
