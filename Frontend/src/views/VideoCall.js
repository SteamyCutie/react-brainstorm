import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormSelect, FormInput, CardFooter, Button } from "shards-react";

import kurentoUtils from 'kurento-utils';
// import { forgetPassword } from '../api/api';

const NO_CALL = 0;
const IN_CALL = 1;
const INCOMING_CALL = 2;
const OUTGOING_CALL = 3;

export default class VideoCall extends React.Component {
  constructor(props) {
    super(props);
    this.videoInput = document.getElementById('videoInput');
    this.videoOutput = document.getElementById('videoOutput');
    this.webRtcPeer = null;
    this.ws = null;
    
    this.state = {
    }

    this.onIceCandidate = this.onIceCandidate.bind(this);
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
            to : 'ddd',
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
    console.log('stop');
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin center">
        <Card style={{width: "100%"}}>
          <CardBody>
              <Row className="center">
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
          </CardBody>
        </Card>    
      </Container>
    )
  }
}
