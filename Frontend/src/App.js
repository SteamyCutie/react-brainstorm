import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import routes from "./Routes";
import withTracker from "./withTracker";
// import {webRtcPeer} from 'kurento-utils';

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "../src/assets/mentorWallet.css";
import "../src/assets/student.css";
import "../src/assets/mentor.css";
import "../src/assets/common.css";
// import VideoCall from "./components/common/VideoCall"

import Video from "./video/video.mp4"

// const NOT_REGISTERED = 0;
// const REGISTERING = 1;
// const REGISTERED = 2;

// const NO_CALL = 0;
// const IN_CALL = 1;
// const INCOMING_CALL = 2;
// const OUTGOING_CALL = 3;

export default class App extends React.Component{

  constructor(props) {
    super(props);    
    // this.state = {
    //   call: false,
    //   registerState: 0,
    //   callState: 0,
    //   videoCallModal: 0,
    //   from: '',
    // }
    // this.ws = null;
    // this.webRtcPeer = null;
    // this.setWebRtcPeer = this.setWebRtcPeer.bind(this);
  }

  // componentWillMount() {
  //   var wsUri = 'wss://44.225.65.218:8443/one2one';
  //   this.setWebsocket(wsUri);
  // }

  // setWebsocket(wsUri) {
  //   this.ws = new WebSocket(wsUri);
  //   const that = this;

  //   this.ws.onopen = function () {
  //     that.register(localStorage.getItem('email'));
  //   }
    
  //   this.ws.onmessage = function(message) {
  //     var parsedMessage = JSON.parse(message.data);
  //     console.info('Received message: ' + message.data);
    
  //     switch (parsedMessage.id) {
  //       case 'registerResponse':
  //         that.resgisterResponse(parsedMessage);
  //         break;
  //       case 'callResponse':
  //         that.callResponse(parsedMessage);
  //         break;
  //       case 'incomingCall':
  //         that.incomingCall(parsedMessage);
  //         break;
  //       case 'startCommunication':
  //         that.startCommunication(parsedMessage);
  //         break;
  //       case 'stopCommunication':
  //         console.info("Communication ended by remote peer");
  //         that.stop(true);
  //         break;
  //       case 'iceCandidate':
  //         that.webRtcPeer.addIceCandidate(parsedMessage.candidate);
  //         break;
  //       default:
  //         console.error('Unrecognized message', parsedMessage);
  //     }
  //   }

  //   this.ws.onclose = function (e) {
  //     console.log('Socket is closed. Reconnect will be attempted in 5 second.');
  //     setTimeout(() => {
  //       that.setWebsocket(wsUri);
  //     }, 5000);
  //   }

  //   this.ws.onerror = function(err) {
  //     console.error('Socket encountered error: ', err, 'Closing socket');
  //     that.ws.close();
  //   };

  //   localStorage.setItem('ws', JSON.stringify(this.ws));
  // }

  // register(user) {
  //     var message = {
  //       id: 'register',
  //       name: user
  //     };

  //   this.sendMessage(message);
  // }

  // resgisterResponse(message) {
  //   if (message.response == 'accepted') {
  //     this.setState({
  //       registerState: REGISTERED
  //     })
  //   } else {
  //     this.setState({
  //       registerState: NOT_REGISTERED
  //     })
  //     var errorMessage = message.message ? message.message
  //         : 'Unknown reason for register rejection.';
  //     console.log(errorMessage);
  //   }
  // }

  // callResponse(message) {
  //   if (message.response != 'accepted') {
  //     console.info('Call not accepted by peer. Closing call');
  //     var errorMessage = message.message ? message.message : 'Unknown reason for call rejection.';
  //     console.log(errorMessage);
  //     this.stop(true);
  //   } else {
  //     this.webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
  //       if (error)
  //         return console.error(error);
  //     });
  //     // this.setState({
  //     //   callState: IN_CALL,
  //     //   call: true,
  //     //   sdpAnswer: message.sdpAnswer
  //     // })
  //   }
  // }

  // startCommunication(message) {
  //   this.webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
  //     if (error)
  //       return console.error(error);
  //   });
  //   // this.setState({
  //   //   callState: IN_CALL,
  //   //   call: true,
  //   //   sdpAnswer: message.sdpAnswer
  //   // })
  // }

  // incomingCall(message) {
  //   // If bussy just reject without disturbing user
  //   if (this.state.callState != NO_CALL) {
  //     var response = {
  //       id : 'incomingCallResponse',
  //       from : message.from,
  //       callResponse : 'reject',
  //       message : 'bussy'

  //     };
  //     return this.sendMessage(response);
  //   }

  //   // that.ring = INCOMING_RING;
  //   // this.setState({
  //   //   callState: INCOMING_CALL
  //   // });
  //   if (window.confirm('User ' + message.from
  //     + ' is calling you. Do you accept the call?')) {
  //       this.setState({
  //         callState: INCOMING_CALL,
  //         call: true,
  //         from: message.from
  //       })

  //     // var options = {
  //     //   localVideo: videoInput,
  //     //   remoteVideo: videoOutput,
  //     //   onicecandidate: onIceCandidate
  //     // }

  //     // webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
  //     //   function (error) {
  //     //     if (error) {
  //     //       console.error(error);
  //     //       setCallState(NO_CALL);
  //     //     }

  //     //     this.generateOffer(function (error, offerSdp) {
  //     //       if (error) {
  //     //         console.error(error);
  //     //         setCallState(NO_CALL);
  //     //       }
  //     //       var response = {
  //     //         id: 'incomingCallResponse',
  //     //         from: message.from,
  //     //         callResponse: 'accept',
  //     //         sdpOffer: offerSdp
  //     //       };
  //     //       sendMessage(response);
  //     //     });
  //     //   });

  //   } else {
  //     var response = {
  //       id: 'incomingCallResponse',
  //       from: message.from,
  //       callResponse: 'reject',
  //       message: 'user declined'
  //     };
  //     this.sendMessage(response);
  //     this.stop(true);
  //   }
  // }

  // call() {
  //   this.setState({
  //     callState: OUTGOING_CALL
  //   })
  //   // if (document.getElementById('peer').value == '') {
  //   //   window.alert("You must specify the peer name");
  //   //   return;
  //   // }

  //   // setCallState(PROCESSING_CALL);

  //   // showSpinner(videoInput, videoOutput);


  // }

  // stop(message) {
  //   this.setState({
  //     callState: NO_CALL
  //   });
  //   if (this.webRtcPeer) {
  //     this.webRtcPeer.dispose();
  //     this.webRtcPeer = null;

  //     if (!message) {
  //       var message = {
  //         id : 'stop'
  //       }
  //       this.sendMessage(message);
  //     }
  //   }
  // }

  // sendMessage(message) {
  //   var jsonMessage = JSON.stringify(message);
  //   console.log('Sending message: ' + jsonMessage);
  //   this.ws.send(jsonMessage);
  // }

  // onIceCandidate(candidate) {
  //   console.log("Local candidate" + JSON.stringify(candidate));

  //   var message = {
  //     id: 'onIceCandidate',
  //     candidate: candidate
  //   };
  //   this.sendMessage(message);
  // }

  // setWebRtcPeer(webRtcPeer) {
  //   this.webRtcPeer = webRtcPeer;
  // }

  // onError() {
  //   this.setState({
  //     callState: NO_CALL
  //   });
  // }

  render() {
    // const {videoCallModal} = this.state;
    return (
      <Router basename={process.env.REACT_APP_BASENAME || ""}>
        <div>
          {/* <div style={{zIndex: 99999, bottom: "0px", right: "0px", position: "fixed"}}>
            <video controls loop>
              <source src={Video} type="video/mp4" />
            </video>
          </div> */}
          {routes.map((route, index) => {
            if (route.path != '/call')
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={withTracker(props => {
                    return (
                      <route.layout {...props}>
                        <route.component {...props} />
                      </route.layout>
                    );
                  })}
                />
              );
            else 
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={withTracker(props => {
                    return (
                      <route.layout {...props}>
                        <route.component {...props} from={this.state.from} callState={this.state.callState} ws={this.ws} setWebRtcPeer={this.setWebRtcPeer}/>
                      </route.layout>
                    );
                  })}
                />
              );
          })}
          {/* {this.state.call && 
            // <Redirect to={{pathname: '/call'}} />
            <VideoCall ref={this.signInElement} open={videoCallModal} toggle={() => this.toggle_videocall()} toggle_modal={() => this.toggle_modal()} />
            // <VideoCall />
          } */}
        </div>
      </Router>
    );
  }
};
