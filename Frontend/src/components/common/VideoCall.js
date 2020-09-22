import React from "react";
import { Button, Modal, ModalBody, Row } from "shards-react";
import "../../assets/landingpage.css"
import kurentoUtils from 'kurento-utils';

// import Camera from '../../images/call-camera.svg'
import Phone from '../../images/call-phone.svg'
// import Mic from '../../images/call-mic.svg'

// const NOT_REGISTERED = 0;
// const REGISTERING = 1;
// const REGISTERED = 2;

// const NO_CALL = 0;
const IN_CALL = 1;
const INCOMING_CALL = 2;
const OUTGOING_CALL = 3;

// let timeout = null;

export default class VideoCall extends React.Component {
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

    if (this.props.callState === INCOMING_CALL) {
      this.setState({
        callState: IN_CALL
      })
      this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
        function (error) {
          if (error) {
            console.error(error);
            // this.setState({
            //   callState: NO_CALL
            // })
            that.props.sendErrorMsg("You have no webcam or microphone");
          }
  
          this.generateOffer(function (error, offerSdp) {
            if (error) {
              console.error(error);
              // that.setState({
              //   callState: NO_CALL
              // })
            }
            var response = {
              id: 'incomingCallResponse',
              from: that.props.from,
              callResponse: 'accept',
              sdpOffer: offerSdp
            };
            that.sendMessage(response);
          });
        });
      this.props.setWebRtcPeer(this.webRtcPeer);
    } else if (this.props.callState === OUTGOING_CALL) {
      this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
        if (error) {
          // console.error(error, "11111111111111111111");
          // that.setState({
          //   callState: NO_CALL
          // })
          that.props.sendErrorMsg("You have no webcam or microphone");
        }

        this.generateOffer(function(error, offerSdp) {
          if (error) {
            console.error(error);
            // that.setState({
            //   callState: NO_CALL
            // })
          }
          var message = {
            id : 'call',
            from : localStorage.getItem("email"),
            name: that.props.toName, 
            avatarURL: localStorage.getItem("avatar"),
            to : that.props.to,
            sdpOffer : offerSdp
          };
          that.sendMessage(message);
        });
      });
      this.props.setWebRtcPeer(this.webRtcPeer);

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

  render() {
    const { open, accepted, callState } = this.props;
    return (
      <div className={
        (callState === INCOMING_CALL) ? "video-call-modal-enable"
        : (callState === OUTGOING_CALL && accepted) ? "video-call-modal-enable" : "video-call-modal-disable"}>
        <Modal open={open} toggle={() => this.toggle()} className="modal-video-call-container center" backdrop={true} backdropClassName="backdrop-class">
          <ModalBody className="modal-video-call">
            <div className="video-call-element">
              <Row className="center video-tags">
                <video id="videoOutput" autoPlay width="1000px" height="600px" className="video-call-student">
                  Your browser does not support the video tag.
                </video>
                <video id="videoInput" autoPlay width="200px" height="150px" className="video-call-mentor">
                  Your browser does not support the video tag.
                </video>
              </Row>
              
              <Row className="center btn-group-call">
                {/* <Button className="btn-video-call-mic-camera">
                  <img src={Mic} placeholder="Mic" />
                </Button> */}
                <Button className="btn-video-call-end" onClick={() => this.toggle()}>
                  <img src={Phone} placeholder="Phone" alt="phone"/>
                </Button>
                {/* <Button className="btn-video-call-mic-camera">
                  <img src={Camera} placeholder="Camera" />
                </Button> */}
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}