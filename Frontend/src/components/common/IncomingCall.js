import React from "react";
import { Button, Modal, ModalBody, Card, CardBody, Row, Col } from "shards-react";
import "../../assets/landingpage.css"
import { Link } from "react-router-dom";
import { signin } from '../../api/api';
import kurentoUtils from 'kurento-utils';

import Facebook from '../../images/Facebook.svg'
import Google from '../../images/Google.svg'
import Close from '../../images/Close.svg'
import Camera from '../../images/call-camera.svg'
import Phone from '../../images/call-phone.svg'
import Mic from '../../images/call-mic.svg'

import DeclineImg from '../../images/call-decline.svg'
import AcceptImg from '../../images/call-accept.svg'

const NOT_REGISTERED = 0;
const REGISTERING = 1;
const REGISTERED = 2;

const NO_CALL = 0;
const IN_CALL = 1;
const INCOMING_CALL = 2;
const OUTGOING_CALL = 3;

export default class IncomingCall extends React.Component {
  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.state = {
      callState: 0,
      isCallingNow: 0,
      isConnected: 0
    };
    this.onIceCandidate = this.onIceCandidate.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.onAccept = this.props.onAccept
    this.onDecline = this.props.onDecline
  }

  componentDidMount() {
    // document.getElementById("email-input").focus();
  }

  clearValidationErrors() {
    // this.setState({
      
    // })
  }

  setCallingStatus(state) {
    this.setState({
      isCallingNow: state
    })
  }

  setConnectStatus(state) {
    this.setState({
      isConnected: state,
    })
  }

  toggle(accepted) {
    const { toggle } = this.props;
    if(accepted){
      this.onDecline()
    } else {
      this.onAccept()
    }
    toggle();
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();
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

    if (this.props.callState == INCOMING_CALL) {
      this.setState({
        callState: IN_CALL
      })
      this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
        function (error) {
          if (error) {
            console.error(error);
            this.setState({
              callState: NO_CALL
            })
          }
  
          this.generateOffer(function (error, offerSdp) {
            if (error) {
              console.error(error);
              that.setState({
                callState: NO_CALL
              })
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
    }
    else if (this.props.callState == OUTGOING_CALL) {
      var options = {
        localVideo : this.videoInput,
        remoteVideo : this.videoOutput,
        onicecandidate : this.onIceCandidate
      }

      this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
        if (error) {
          console.error(error);
          that.setState({
            callState: NO_CALL
          })
        }

        this.generateOffer(function(error, offerSdp) {
          if (error) {
            console.error(error);
            that.setState({
              callState: NO_CALL
            })
          }
          var message = {
            id : 'call',
            from : localStorage.getItem('email'),
            to : that.props.to,
            sdpOffer : offerSdp
          };
          that.sendMessage(message);
        });
      });
      this.props.setWebRtcPeer(this.webRtcPeer);
    }
  }

  sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    // console.log('Sending message: ' + jsonMessage);
    this.ws.send(jsonMessage);
  }

  onIceCandidate(candidate) {
    // console.log("Local candidate" + JSON.stringify(candidate));

    var message = {
      id: 'onIceCandidate',
      candidate: candidate
    };
    this.sendMessage(message);
  }

  handleStop = () => {
    // console.log("*************************STOP")
    // this.props.stop();
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-incoming-call center" backdrop={true} backdropClassName="backdrop-class">
          <ModalBody className="modal-video-call">
            <div className="video-call-element">
              <Row className="center video-tags">
                <label style={{fontSize: "25px", fontWeight: "bolder", color: "#333333"}}>{this.props.name} is calling to you</label>
              </Row>
              <Row className="center">
                <img src={this.props.avatarURL} style={{width: "206px", height: "206px", marginTop: "10px", marginBottom: "50px"}} alter="User avatar" />
              </Row>
              <Row className="center btn-group-call">
                <Button className="btn-video-call-decline" onClick={() => this.toggle(true)}>
                  <img src={DeclineImg} placeholder="Phone" style={{paddingRight: "10px"}}/>
                  Decline
                </Button>
                <Button className="btn-video-call-accept" onClick={() => this.toggle(false)}>
                  <img src={AcceptImg} placeholder="Phone" style={{paddingRight: "10px"}}/>
                  Accept
                </Button>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}