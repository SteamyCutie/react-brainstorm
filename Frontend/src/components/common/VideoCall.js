import React from "react";
import { Button, Modal, ModalBody, Card, CardBody, Row, Col } from "shards-react";
import "../../assets/landingpage.css"
import { Link } from "react-router-dom";
import { signin } from '../../api/api';
import kurentoUtils from 'kurento-utils';

import Facebook from '../../images/Facebook.svg'
import Google from '../../images/Google.svg'
import Close from '../../images/Close.svg'

const NOT_REGISTERED = 0;
const REGISTERING = 1;
const REGISTERED = 2;

const NO_CALL = 0;
const IN_CALL = 1;
const INCOMING_CALL = 2;
const OUTGOING_CALL = 3;

export default class VideoCall extends React.Component {
  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.state = {
      callState: 0,
    };
    this.onIceCandidate = this.onIceCandidate.bind(this);
  }

  componentDidMount() {
    // document.getElementById("email-input").focus();
  }

  clearValidationErrors() {
    // this.setState({
      
    // })
  }

  toggle() {
    const { toggle } = this.props;
    this.handleStop();
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
    console.log('Sending message: ' + jsonMessage);
    this.ws.send(jsonMessage);
  }

  onIceCandidate(candidate) {
    console.log("Local candidate" + JSON.stringify(candidate));

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
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-video-call-container center" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} placeholder="Close Image" /></Button>
          <ModalBody className="modal-video-call">
            <div className="video-call-element">
              <Row className="center video-tags">
                <Col xl="6">
                  <video id="videoInput" autoplay="" width="320px" height="240px">
                    Your browser does not support the video tag.
                  </video>
                </Col>
                <Col xl="6">
                  <video id="videoOutput" autoplay="" width="320px" height="240px">
                    Your browser does not support the video tag.
                  </video>
                </Col>
              </Row>
              
              <Row className="center btn-group-call">
                <Button className="btn-video-call-mic-camera">
                  Mic
                </Button>
                <Button className="btn-video-call-end" onclick={() => this.handleStop()}>
                  End
                </Button>
                <Button className="btn-video-call-mic-camera">
                  Camera
                </Button>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}