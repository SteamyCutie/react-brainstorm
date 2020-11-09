import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import routes from "./Routes";
import withTracker from "./withTracker";
import Draggable from 'react-draggable';
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "../src/assets/mentorWallet.css";
import "../src/assets/student.css";
import "../src/assets/mentor.css";
import "../src/assets/common.css";

import VideoCallMin from "./components/common/One2OneMin";
import Many2Many from "./components/common/Many2Many"
import IncomingCall from "../src/components/common/IncomingCall"
import OutcomingCall from "../src/components/common/OutcomingCall"
import HaveInvitation from "../src/components/common/HaveInvitation"
import MentorReview from "../src/components/common/MentorReview";
import incomingSound from '../src/audio/incoming.mp3'

const NO_CALL = 0;
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
      invitationStatus: false, 
      invitedRoomName: '', 
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
      roomCall: false, 
      sessionChannelName: '', 
      reviewModal: false, 
    }

    this.many2manyRef = React.createRef();

    this.ws = null;
    this.webRtcPeer = null;
    this.setWebRtcPeer = this.setWebRtcPeer.bind(this);
    this.stop = this.stop.bind(this);
    this.call = this.call.bind(this);
    this.setUser = this.setUser.bind(this);
    this.sendErrorMsg = this.sendErrorMsg.bind(this);
    this.fullScreen = this.fullScreen.bind(this);

    this.startSession = this.startSession.bind(this);
    this.joinSession = this.joinSession.bind(this);
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

        // Room call with KVS
        case 'joinRoomResponse':
          that.joinRoomResponse(parsedMessage);
          break;

        case 'leaveRoomResponse': 
          that.leaveRoomResponse(parsedMessage);
          break;

        case 'existingParticipants':
          that.existingParticipants(parsedMessage);
          break;

        case 'newParticipant': 
          that.newParticipant(parsedMessage);
          break;

        case 'leftRoom': 
          that.leftRoom(parsedMessage);
          break;

        case 'invitedToRoom':
          that.invitedToRoom(parsedMessage);
          break;

        case 'inviteParticipantResponse': 
          that.inviteParticipantResponse(parsedMessage);
          break;

        default:
          console.error('Unrecognized message', parsedMessage);
      }
    }

    this.ws.onclose = function (e) {
      setTimeout(() => {
        that.setWebsocket(wsUri);
      }, 5000);
    }

    this.ws.onerror = function(err) {
      console.error('Socket encountered error: ', err, 'Closing socket');
      that.ws.close();
    };

    localStorage.setItem('ws', JSON.stringify(this.ws));
  }

  register(user) {
    var message = {
      id: 'register',
      name: user
    };
    this.sendMessage(message);
  }

  resgisterResponse(message) {}

  callResponse(message) {
    if (message.response !== 'accepted') {
      this.setState({
        isAccepted: false,
        callState: NO_CALL,
      })

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
        this.setState({
          isAccepted: true,
        })
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

    if(!withDescription) {
      this.toggle_outcomingCall_modal();
    }
  }

  stop(status) {
    if(this.state.callState !== NO_CALL) {
      var response = {
        id : 'stop'
      }
      this.sendMessage(response);
    }

    if (this.state.roomCall) {
      var message = {
        id: "leaveRoom", 
        userId: localStorage.getItem("user_id"), 
        roomName: localStorage.getItem("room_id"),
      }

      this.sendMessage(message);

      this.setState({
        callState: NO_CALL,
        incomingCallStatus: false,
        videoCallStatus: false,
        message: message,
        call: false,
        isAccepted: false,
        roomCall: false, 
        reviewModal: true && !this.state.isMaster,
      });
    } else {
      this.setState({
        callState: NO_CALL,
        incomingCallStatus: false,
        videoCallStatus: false,
        message: message,
        call: false,
        isAccepted: false,
        roomCall: false, 
      });
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

  toggle_invitation_modal(message) {
    // this.setState({
    //   message: message,
    //   errorMsg: '',
    //   invitationStatus: !this.state.invitationStatus,
    // })
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
      errorModalStatus: !this.state.errorModalStatus,
    })
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
  }

  fullScreen() {
    this.setState({
      dragegableOnStart: !this.state.dragegableOnStart
    })
  }

  dragegableOnStart() {
    return this.state.dragegableOnStart;
  }

  startSession(room_id) {
    this.setState({
      roomCall: true, 
      isMaster: true, 
    });

    var message = {
      id: "joinRoom", 
      userId: localStorage.getItem("user_id"), 
      userName: localStorage.getItem("user_name"), 
      channelName: localStorage.getItem("channel_name"), 
      roomName: room_id,
    }

    this.sendMessage(message);
  }

  joinSession(session) {
    this.setState({
      roomCall: true, 
      isMaster: false, 
    })

    var message = {
      id: "joinRoom", 
      userId: localStorage.getItem("user_id"), 
      userName: localStorage.getItem("user_name"), 
      channelName: localStorage.getItem("channel_name"), 
      roomName: session.room_id,
    }

    this.sendMessage(message);
  }

  joinRoomResponse(message) {}
  leaveRoomResponse(message) {}

  existingParticipants(message) {
    this.many2manyRef.current.existingParticipants(message.data)
  }

  newParticipant(message) {
    this.many2manyRef.current.newParticipant(message.channelName, message.userName, message.userId);
  }

  leftRoom(message) {
    this.many2manyRef.current.leftRoom(message.channelName);
  }

  invitedToRoom(message) {
    this.setState({
      invitationStatus: true, 
      invitedRoomName: message.roomName, 
    })

    localStorage.setItem("room_id", message.roomName);
  }

  inviteParticipantResponse(message) {}

  handleInviteAccept() {
    this.setState({
      roomCall: true, 
      isMaster: false, 
      invitationStatus: false, 
    })

    var message = {
      id: "joinRoom", 
      userId: localStorage.getItem("user_id"), 
      userName: localStorage.getItem("user_name"), 
      channelName: localStorage.getItem("channel_name"), 
      roomName: this.state.invitedRoomName,
    }

    this.sendMessage(message);
  }

  handleInviteDecline() {
    this.setState({
      invitationStatus: false, 
    })
  }

  toggle_review_modal() {
    this.setState({
      reviewModal: !this.state.reviewModal, 
    })
  }

  render() {
    const { incomingCallStatus, outcomingCallStatus, mentorData, reviewModal, invitationStatus, callState, from, call, isAccepted, channel_name } = this.state;
    return (
      <Router basename={process.env.REACT_APP_BASENAME || ""}>
        <div>
          {routes.map((route, index) => {
            if (route.path === '/trending' || route.path === '/studentdashboard' || route.path === '/mentordashboard') {
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={withTracker(props => {
                    return (
                      <route.layout {...props}>
                        <route.component {...props} ws={this.ws} setUser={this.setUser} stop={this.stop} />
                      </route.layout>
                    );
                  })}
                />
              );
            }
            else {
              if (route.path === '/studentSession' || route.path === '/scheduleLiveForum' || route.path === '/mentorSession') {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={withTracker(props => {
                      return (
                        <route.layout {...props}>
                          <route.component {...props} startSession={this.startSession} joinSession={this.joinSession} stop={this.stop} />
                        </route.layout>
                      );
                    })}
                  />
                );
              }
              else {
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
              }
            }
          })}
          {call && 
            <div className="draggable-video-item">
              <Draggable bounds="parent" onStart={() => this.dragegableOnStart()}>
                <div className="box" style={{position: 'absolute', top: '120px', right: '69px'}}>
                  <VideoCallMin 
                    accepted={isAccepted}
                    open={true} 
                    toggle={() => this.toggle_videocall()}
                    onDecline={() => this.outcomingCallDecline()}
                    sendErrorMsg={this.sendErrorMsg}
                    fullScreen={this.fullScreen}
                    from={from} fromName={this.state.fromName} channel_name={channel_name} to={this.state.to} toName={this.state.toName} 
                    description={this.state.callDescription}
                    callState={callState} ws={this.ws} setWebRtcPeer={this.setWebRtcPeer} stop={this.stop}
                  />
                </div>
              </Draggable>
            </div>
          }
          {this.state.roomCall && 
            <div className="draggable-room-item">
              <Draggable bounds="parent" onStart={() => this.dragegableOnStart()}>
                <div className="box draggable-room-background" style={{position: 'absolute', top: '120px', right: '69px'}}>
                  <Many2Many 
                    ref = {this.many2manyRef}
                    stop={this.stop}
                    ws={this.ws}
                  />
                </div>
              </Draggable>
            </div>
          }
              
          <IncomingCall open={incomingCallStatus} toggle={() => this.toggle_incomingCall_modal()} errMsg={this.state.errorMsg} 
            onAccept={() => this.handleAccept()} onDecline={() => this.incomingCallDecline()} name={this.state.fromName} avatar={this.state.avatarURL} description={this.state.toDescription}/>
          <OutcomingCall ref={this.outcomingRef} open={outcomingCallStatus} toggle={() => this.toggle_outcomingCall_modal()} 
            onDecline={() => this.outcomingCallDecline()} name={this.state.toName} avatar={this.state.toAvatar}  errMsg={this.state.errorMsg} />
          {/* <MentorReview mentorData={mentorData} open={reviewModal} toggle={() => this.toggle_review_modal()} /> */}
          <MentorReview mentorid={"id"} mentorname={"name"} open={reviewModal} toggle={() => this.toggle_review_modal()}></MentorReview>
          <HaveInvitation open={invitationStatus} onAccept={() => this.handleInviteAccept()} onDecline={() => this.handleInviteDecline()} />
          
          <audio id="incoming-ring">
            <source src={incomingSound} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <audio id="outgoing-ring">
            <source src={incomingSound} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </Router>
    );
  }
};
