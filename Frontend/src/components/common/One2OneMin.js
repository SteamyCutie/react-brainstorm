import React from "react";
import { Button, Modal, ModalBody, Row } from "shards-react";
import { startMaster } from '../../utils/master';
import { startViewer } from '../../utils/viewer';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../common/config';
import "../../assets/landingpage.css"
import kurentoUtils from 'kurento-utils';

// import Camera from '../../images/call-camera.svg'
import Phone from '../../images/call-phone.svg'
import CloseImg from '../../images/one2on-min-close.svg'
import FullScreenImg from '../../images/one2one-min-fullscreen.svg'
import PosterImg from '../../images/logo.png'
// import Mic from '../../images/call-mic.svg'

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
  onStatsReport(report) {
    // TODO: Publish stats
  }
  componentDidMount() {
    const that = this;
    this.ws = this.props.ws;
    this.videoInput = document.getElementById('videoInput');
    this.videoOutput = document.getElementById('videoOutput');
    console.log(this.videoInput, this.videoOutput);
    var options = {
      localVideo: this.videoInput,
      remoteVideo: this.videoOutput,
      onicecandidate: this.onIceCandidate
    }

    if (this.props.callState === INCOMING_CALL) {
      this.setState({
        callState: IN_CALL
      })
      const formValues = this.getFormValuesMaster();
      startMaster(this.videoInput, this.videoOutput, formValues, this.onStatsReport, event => {
      })

      // this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
      //   function (error) {
      //     if (error) {
      //       console.error(error);
      //       that.props.sendErrorMsg("You have no webcam or microphone");
      //     }
  
      //     this.generateOffer(function (error, offerSdp) {
      //       if (error) {
      //         console.error(error);
      //       }
      //       var response = {
      //         id: 'incomingCallResponse',
      //         from: that.props.from,
      //         callResponse: 'accept',
      //         sdpOffer: offerSdp
      //       };
      //       that.sendMessage(response);
      //     });
      //   });
      // this.props.setWebRtcPeer(this.webRtcPeer);

      var response = {
        id: 'incomingCallResponse',
        from: that.props.from,
        callResponse: 'accept',
        sdpOffer: "offerSdp"
      };
      that.sendMessage(response);
    } else if (this.props.callState === OUTGOING_CALL) {
      const formValues = this.getFormValuesViewer();
      console.log(formValues.channelName)
      startViewer(this.videoInput, this.videoOutput, formValues, this.onStatsReport, event => {
      })
      // this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
      //   if (error) {
      //     that.props.sendErrorMsg("You have no webcam or microphone");
      //   }

      //   this.generateOffer(function(error, offerSdp) {
      //     if (error) {
      //       console.error(error);
      //       // that.setState({
      //       //   callState: NO_CALL
      //       // })
      //     }
      //     var message = {
      //       id : 'call',
      //       from : localStorage.getItem("email"),
      //       name: localStorage.getItem('user_name'), 
      //       avatarURL: localStorage.getItem("avatar"),
      //       to : that.props.to,
      //       sdpOffer : offerSdp
      //     };
      //     that.sendMessage(message);
      //   });
      // });
      // this.props.setWebRtcPeer(this.webRtcPeer);

      var message = {
        id : 'call',
        from : localStorage.getItem("email"),
        name: localStorage.getItem('user_name'), 
        avatarURL: localStorage.getItem("avatar"),
        to : that.props.to,
        sdpOffer : "offerSdp",
        channel_name: this.props.channel_name
      };
      that.sendMessage(message);

      // timeout = setTimeout(function() {
      //   that.props.onDecline();
      //   clearTimeout(timeout);
      //   console.log("time out *********************")
      // }, 30000)
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
    this.props.stop();
  }

  handleFullScreen() {
    // this.props.fullScreen();
  }

  render() {
    const { open, accepted, callState } = this.props;
    return (
      <div id="one2one-call-conatainer" className={ (callState === INCOMING_CALL) ? "video-call-mini-enable" :(callState === OUTGOING_CALL && accepted) ? "video-call-mini-enable" : "video-call-mini-disable"}>
        <div className="video-call-element-min" id="video-call-element-min">
          <div>
            <video id="videoInput" autoPlay width="300px" height="225px" poster={PosterImg}>
              
            </video>
          </div>
          <div>
            <video id="videoOutput" autoPlay width="300px" height="225px" poster={PosterImg}>
              
            </video>
          </div>
          <Row className="center btn-group-call">
            {/* <Button className="btn-video-call-mic-camera">
              <img src={Mic} placeholder="Mic" />
            </Button> */}
            {/* <Button className="btn-video-call-end" onClick={() => this.toggle()}>
              <img src={Phone} placeholder="Phone" alt="phone"/>
            </Button> */}
            {/* <Button className="btn-video-call-mic-camera">
              <img src={Camera} placeholder="Camera" />
            </Button> */}
            <Button className="btn-one2one-min-close" onClick={() => this.toggle()}>
              <img src={CloseImg} alt="close"/>
            </Button>
            <Button className="btn-one2one-min-fullscreen" onClick={() => this.handleFullScreen()}>
              <img src={FullScreenImg} alt="fullscreen"/>
            </Button>
          </Row>
        </div>
      </div>
    );
  }
}
