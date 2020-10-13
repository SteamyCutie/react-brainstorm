import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import routes from "./Routes";
import withTracker from "./withTracker";
// import {webRtcPeer} from 'kurento-utils';
import Draggable from 'react-draggable';
import { stopMaster } from './utils/master';
import { stopViewer } from './utils/viewer';
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "../src/assets/mentorWallet.css";
import "../src/assets/student.css";
import "../src/assets/mentor.css";
import "../src/assets/common.css";

import VideoCall from "../src/components/common/VideoCall";
import VideoCallMin from "./components/common/One2OneMin";
import Many2Many from "./components/common/Many2Many"
import IncomingCall from "../src/components/common/IncomingCall"
import OutcomingCall from "../src/components/common/OutcomingCall"
// import { message } from "antd";
import incomingSound from '../src/audio/incoming.mp3'

// const NOT_REGISTERED = 0;
// const REGISTERING = 1;
// const REGISTERED = 2;

const NO_CALL = 0;
// const IN_CALL = 1;
const INCOMING_CALL = 2;
const OUTGOING_CALL = 3;

export default class App extends React.Component{

  constructor(props) {
    super(props);    
    this.state = {
      call: false,
      registerState: 0,
      callState: 0,
      videoCallModal: 0,
      from: '',
      to: '',
      incomingCallStatus: false,
      outcomingCallStatus: false,
      errorModalStatus: 0,
      videoCallStatus: false,
      message: '',
      isAccepted: false,
      errorMsg: '',
      toAvatar: '',
      fromName: '', 
      toName: '', 
      dragegableOnStart: true, 
      callDescription: '', 
      toDescription: '',
      roomCall: true, 
    }

    this.ws = null;
    this.webRtcPeer = null;
    this.setWebRtcPeer = this.setWebRtcPeer.bind(this);
    this.stop = this.stop.bind(this);
    this.call = this.call.bind(this);
    this.setUser = this.setUser.bind(this);
    this.sendErrorMsg = this.sendErrorMsg.bind(this);
    this.fullScreen = this.fullScreen.bind(this)
  }

  componentWillMount() {
    var wsUri = 'wss://media.brainsshare.com/one2one';
    // var wsUri = 'wss://192.168.105.13:8443/one2one';
    this.setWebsocket(wsUri);
  }

  setWebsocket(wsUri) {
    this.ws = new WebSocket(wsUri);
    const that = this;

    this.ws.onopen = function () {
      that.register(localStorage.getItem('email'));
    }
    
    this.ws.onmessage = function(message) {
      var parsedMessage = JSON.parse(message.data);
      console.info('Received message: ' + message.data);
    
      switch (parsedMessage.id) {
        case 'registerResponse':
          that.resgisterResponse(parsedMessage);
          break;
        case 'callResponse':
          that.callResponse(parsedMessage);
          break;
        case 'callRejected':
          that.callRejected(parsedMessage);
          break;
        case 'incomingCall':
          that.incomingCall(parsedMessage);
          break;
        case 'startCommunication':
          that.startCommunication(parsedMessage);
          break;
        case 'stopCommunication':
          console.info("Communication ended by remote peer");
          that.stop(true);
          break;
        case 'iceCandidate':
          that.setIceCandidate(parsedMessage.candidate);
          break;
        default:
          console.error('Unrecognized message', parsedMessage);
      }
    }

    this.ws.onclose = function (e) {
      console.log('Socket is closed. Reconnect will be attempted in 5 second.');
      setTimeout(() => {
        that.setWebsocket(wsUri);
      }, 5000);
    }

    this.ws.onerror = function(err) {
      console.error('Socket encountered error: ', err, 'Closing socket');
      that.ws.close();
    };

    localStorage.setItem('ws', JSON.stringify(this.ws));
    // If bussy just reject without disturbing user
  }

  register(user) {
    // if(this.state.registerState === NOT_REGISTERED) {
      var message = {
        id: 'register',
        name: user
      };
      this.sendMessage(message);
    // }
  }

  resgisterResponse(message) {
    if (message.response === 'accepted') {
      // this.setState({
      //   registerState: REGISTERED
      // })
    } else {
      // if(message.response === 'rejected ') {
      //   this.setState({
      //     registerState: REGISTERED
      //   })
      // } else {
      //   this.setState({
      //     registerState: NOT_REGISTERED
      //   })
      //   var errorMessage = message.message ? message.message
      //       : 'Unknown reason for register rejection.';
      //   console.log(errorMessage);
      // }
    }
  }

  callResponse(message) {
    if (message.response !== 'accepted') {
      this.setState({
        isAccepted: false,
        callState: NO_CALL,
      })

      // console.log("REJECT******************************");
      if(message.response === 'rejected') {
        this.setState({
          errorMsg: "Call Rejected",
        })
      } else {
        if(message.message.indexOf("is not reigstered")) {
          this.setState({
            errorMsg: "The user " + this.state.toName + " is offline."
          })
          
        } else {
          this.setState({
            errorMsg: message.message,
          })
        }
      }

      this.stop(true);
    } else {
      if(this.state.callState) {
        // this.webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
        //   if (error)
        //     return console.error(error);
        // });
        // this.setState({
        //   callState: IN_CALL,
        //   call: true,
        //   sdpAnswer: message.sdpAnswer
        // })
        this.setState({
          isAccepted: true,
        })
        // 
        this.toggle_outcomingCall_modal();
      }
    }

    const ring = document.getElementById("outgoing-ring");
    ring.pause();
    ring.currentTime = 0;
  }
  
  callRejected(message) {
    this.setState({
      errorMsg: message,
      incomingCallStatus: false,
    })

    const ring = document.getElementById("incoming-ring");
    ring.loop = true;
    ring.pause();
    ring.currentTime = 0;
  }

  startCommunication(message) {
    this.webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
      if (error)
        return console.error(error);
    });
  }

  incomingCall(message) {
    if (this.state.callState !== NO_CALL) {
      var response = {
        id : 'incomingCallResponse',
        from : message.from,
        callResponse : 'reject',
        message : 'bussy'

      };
      return this.sendMessage(response);
    }

    const ring = document.getElementById("incoming-ring");
    ring.loop = true;
    ring.play();

    this.setState({
      from: message.from,
      fromName: message.name, 
      avatarURL: message.avatarURL,
      toDescription: message.description, 
    })
      
    this.toggle_incomingCall_modal(message)

  }

  call(to, withDescription) {
    this.setState({
      callState: OUTGOING_CALL,
      call: true,
      to: to,
      callResponseSate: 0,
    })

    const ring = document.getElementById("outgoing-ring");
    ring.loop = true;
    ring.play();

    if(withDescription) {

    } else {
      this.toggle_outcomingCall_modal();
    }
  }

  stop(message) {
    if(this.state.callState !== NO_CALL) {
      var response = {
        id : 'stop'
      }
      this.sendMessage(response);
      stopMaster();
      stopViewer();
    }

    this.setState({
      callState: NO_CALL,
      incomingCallStatus: false,
      message: message,
      videoCallStatus: false,
      call: false,
      isAccepted: false,
    });
    stopMaster();
    stopViewer();
    // if (this.webRtcPeer) {
      // this.webRtcPeer.dispose();
      // this.webRtcPeer = null;

    //   if (!message) {
        // var response = {
        //   id : 'stop'
        // }
        // this.sendMessage(response);
        // console.log("++++++++++++++++");
    //   }
    // }
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

  setWebRtcPeer(webRtcPeer) {
    this.webRtcPeer = webRtcPeer;
  }

  setIceCandidate(candidate) {
    if (this.webRtcPeer) {
      this.webRtcPeer.addIceCandidate(candidate);
    }
  }

  onError() {
    this.setState({
      callState: NO_CALL
    });
  }

  toggle_videocall() {
    this.setState({
      call: !this.state.call
    });

    if(!this.state.call) {
      this.setState({
        incomingCallStatus: false,
        outcomingCallStatus: false,
      })
    }
  }

  toggle_incomingCall_modal(message) {
    this.setState({
      message: message,
      errorMsg: '',
      incomingCallStatus: !this.state.incomingCallStatus,
    })
  }

  toggle_outcomingCall_modal(message) {
    this.setState({
      message: message,
      errorMsg: '',
      outcomingCallStatus: !this.state.outcomingCallStatus,
      
    })
    if(!this.state.videoCallStatus) {
      this.setState({
        videoCallStatus: !this.state.videoCallStatus,
      })
    }
  }

  toggle_error_modal() {
    this.setState({
      // message: message,
      errorModalStatus: !this.state.errorModalStatus,
    })

    if(this.state.outcomingCallStatus) {
      // this.toggle_outcomingCall_modal()
    } else {
      // this.toggle_incomingCall_modal()
    }
  }

  incomingCallDecline() {
    var response = {
      id: 'incomingCallResponse',
      from: this.state.from,
      callResponse: 'reject',
      message: 'user declined'
    };

    this.setState({
      incomingCallStatus: false,
    })

    const ring = document.getElementById("incoming-ring");
    ring.loop = true;
    ring.pause();
    ring.currentTime = 0;

    this.sendMessage(response);
    this.toggle_incomingCall_modal();
    this.stop(true);
  }

  outcomingCallDecline() {
    if (this.state.callState !== NO_CALL) {
      var message = {
        id : 'callReject',
        from : localStorage.getItem('email'),
        to : this.state.to,
      };
      this.sendMessage(message);

      this.setState({
        outcomingCallStatus: false,
        isAccepted: false,
        errorMsg: ''
      })

      const ring = document.getElementById("outgoing-ring");
      ring.pause();
      ring.currentTime = 0;

      // this.sendMessage(response);
      // this.toggle_outcomingCall_modal();
      this.stop(true);
    }
  }

  handleAccept() {
    this.setState({
      callState: INCOMING_CALL,
      call: true,
      from: this.state.message.from
    })

    const ring = document.getElementById("incoming-ring");
    ring.loop = true;
    ring.pause();
    ring.currentTime = 0;

    this.toggle_incomingCall_modal();
    this.toggle_videocall()
  }

  setUser(user, avatar, name, channel_name, callDescription) {
    this.setState({
      channel_name: channel_name,
      to: user,
      outcomingCallStatus: false,
      incomingCallStatus: false,
      call: false,
      toAvatar: avatar,
      toName: name, 
      callDescription: callDescription, 
    })

    const withDescription = callDescription.length ? true : false;

    if(withDescription) {
      this.toggle_outcomingCall_modal();
    }

    this.call(user, withDescription);
  }

  sendErrorMsg(message) {
    this.setState({
      errorMsg: message,
    })
    console.log(this.state.errorMsg)
  }

  fullScreen() {
    this.setState({
      dragegableOnStart: !this.state.dragegableOnStart
    })
  }

  dragegableOnStart() {
    return this.state.dragegableOnStart;
  }

  render() {
    const { incomingCallStatus, outcomingCallStatus, errorModalStatus} = this.state;
    return (
      <Router basename={process.env.REACT_APP_BASENAME || ""}>
        <div>
          {routes.map((route, index) => {
            if (route.path === '/trending' || route.path === '/studentdashboard')
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={withTracker(props => {
                    return (
                      <route.layout {...props}>
                        <route.component {...props} from={this.state.from} callState={this.state.callState} ws={this.ws} 
                          setWebRtcPeer={this.setWebRtcPeer} setUser={this.setUser} stop={this.stop}/>
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
                        <route.component {...props} />
                      </route.layout>
                    );
                  })}
                />
              );
          })}
          {this.state.call && 
            // <VideoCall
            //   accepted={this.state.isAccepted}
            //   open={true} 
            //   toggle={() => this.toggle_videocall()}
            //   onDecline={() => this.outcomingCallDecline()}
            //   sendErrorMsg={this.sendErrorMsg}
            //   from={this.state.from} fromName={this.state.fromName} to={this.state.to} toName={this.state.toName} 
            //   callState={this.state.callState} ws={this.ws} setWebRtcPeer={this.setWebRtcPeer} stop={this.stop}
            // />
            <div className="draggable-video-item">
              <Draggable
                bounds="parent"
                onStart={() => this.dragegableOnStart()}
              >
                <div className="box" style={{position: 'absolute', top: '120px', right: '50px'}}>
                  <VideoCallMin 
                    accepted={this.state.isAccepted}
                    open={true} 
                    toggle={() => this.toggle_videocall()}
                    onDecline={() => this.outcomingCallDecline()}
                    sendErrorMsg={this.sendErrorMsg}
                    fullScreen={this.fullScreen}
                    from={this.state.from} fromName={this.state.fromName} channel_name={this.state.channel_name} to={this.state.to} toName={this.state.toName} 
                    description={this.state.callDescription}
                    callState={this.state.callState} ws={this.ws} setWebRtcPeer={this.setWebRtcPeer} stop={this.stop}
                  />
                </div>
              </Draggable>
            </div>
          }
          {this.state.roomCall && 
            <div className="draggable-room-item">
              <Draggable
                bounds="parent"
                onStart={() => this.dragegableOnStart()}
              >
                <Many2Many 

                />
              </Draggable>
            </div>
          }
              
          <IncomingCall open={incomingCallStatus} toggle={() => this.toggle_incomingCall_modal()} errMsg={this.state.errorMsg} 
            onAccept={() => this.handleAccept()} onDecline={() => this.incomingCallDecline()} name={this.state.fromName} avatar={this.state.avatarURL} description={this.state.toDescription}/>
          <OutcomingCall ref={this.outcomingRef} open={outcomingCallStatus} toggle={() => this.toggle_outcomingCall_modal()} 
            onDecline={() => this.outcomingCallDecline()} name={this.state.toName} avatar={this.state.toAvatar}  errMsg={this.state.errorMsg} />
          
          {/* <ErrorModal toggle={() => this.toggle_error_modal()} handleClick={() => this.toggle_error_modal()} message={this.state.message}/> */}
          <audio id="incoming-ring">
            <source src={incomingSound} type="audio/mpeg" />
            {/* <source src="horse.mp3" type="audio/mpeg" /> */}
            Your browser does not support the audio element.
          </audio>
          <audio id="outgoing-ring">
            <source src={incomingSound} type="audio/mpeg" />
            {/* <source src="horse.mp3" type="audio/mpeg" /> */}
            Your browser does not support the audio element.
          </audio>
        </div>
      </Router>
    );
  }
};
