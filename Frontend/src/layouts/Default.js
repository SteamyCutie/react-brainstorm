import React from "react";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import SubMainNavbar from "../components/layout/MainNavbar/SubMainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
import VideoCall from "../components/common/VideoCall";


import { Store } from "../flux";
import { Dispatcher, Constants } from "../flux";

const NOT_REGISTERED = 0;
const REGISTERING = 1;
const REGISTERED = 2;

const NO_CALL = 0;
const IN_CALL = 1;
const INCOMING_CALL = 2;
const OUTGOING_CALL = 3;
    
export default class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);

    this.videoCallModal = React.createRef();
    
    this.state = {
      noNavbar: false,
      filterType: Store.getUserType(),
      mentorUrl: Store.getMentorHistory(),
      studentUrl: Store.getStudentHistory(),
      noFooter: true,

      call: false,
      registerState: 0,
      callState: 0,
      videoCallModal: 0,
      from: '',
      to: ''
    }

    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.ws = null;
    this.webRtcPeer = null;
    this.setWebRtcPeer = this.setWebRtcPeer.bind(this);
    this.stop = this.stop.bind(this);
    this.call = this.call.bind(this);
  }

  componentWillMount() {
    if(!localStorage.getItem('token')) {
      window.location.href = '/';
      return;
    }
    var wsUri = 'wss://44.225.65.218:8443/one2one';
    this.setWebsocket(wsUri);

    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      filterType: Store.getUserType(),
      mentorUrl: Store.getMentorHistory(),
      studentUrl: Store.getStudentHistory(),
    });
  }

  handleClick() {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_USER_TYPE,
    });

    const { filterType, mentorUrl, studentUrl } = this.state;

    if ( !filterType ) this.props.history.push(mentorUrl);
    else this.props.history.push(studentUrl);
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
  }

  register(user) {
    if(this.state.registerState === NOT_REGISTERED) {
      var message = {
        id: 'register',
        name: user
      };
      this.sendMessage(message);
    }
  }

  resgisterResponse(message) {
    if (message.response == 'accepted') {
      this.setState({
        registerState: REGISTERED
      })
    } else {
      if(message.response == 'rejected ') {
        this.setState({
          registerState: REGISTERED
        })
      } else {
        this.setState({
          registerState: NOT_REGISTERED
        })
        var errorMessage = message.message ? message.message
            : 'Unknown reason for register rejection.';
        console.log(errorMessage);
      }
    }
  }

  callResponse(message) {
    if (message.response != 'accepted') {
      // console.info('Call not accepted by peer. Closing call');
      alert(message.message);
      var errorMessage = message.message ? message.message : 'Unknown reason for call rejection.';
      // console.log(errorMessage);
      this.stop(true);
    } else {
      this.webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
        if (error)
          return console.error(error);
      });
      // this.setState({
      //   callState: IN_CALL,
      //   call: true,
      //   sdpAnswer: message.sdpAnswer
      // })
    }
  }

  startCommunication(message) {
    this.webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
      if (error)
        return console.error(error);
    });
    // this.setState({
    //   callState: IN_CALL,
    //   call: true,
    //   sdpAnswer: message.sdpAnswer
    // })
  }

  incomingCall(message) {
    console.log("++++++++++-----------------")
    // If bussy just reject without disturbing user
    if (this.state.callState != NO_CALL) {
      var response = {
        id : 'incomingCallResponse',
        from : message.from,
        callResponse : 'reject',
        message : 'bussy'

      };
      return this.sendMessage(response);
    }

    // that.ring = INCOMING_RING;
    // this.setState({
    //   callState: INCOMING_CALL
    // });
    if (window.confirm('User ' + message.from
      + ' is calling you. Do you accept the call?')) {
        this.setState({
          callState: INCOMING_CALL,
          call: true,
          from: message.from
        })

      // var options = {
      //   localVideo: videoInput,
      //   remoteVideo: videoOutput,
      //   onicecandidate: onIceCandidate
      // }

      // webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
      //   function (error) {
      //     if (error) {
      //       console.error(error);
      //       setCallState(NO_CALL);
      //     }

      //     this.generateOffer(function (error, offerSdp) {
      //       if (error) {
      //         console.error(error);
      //         setCallState(NO_CALL);
      //       }
      //       var response = {
      //         id: 'incomingCallResponse',
      //         from: message.from,
      //         callResponse: 'accept',
      //         sdpOffer: offerSdp
      //       };
      //       sendMessage(response);
      //     });
      //   });

    } else {
      var response = {
        id: 'incomingCallResponse',
        from: message.from,
        callResponse: 'reject',
        message: 'user declined'
      };
      this.sendMessage(response);
      this.stop(true);
    }
  }

  call(to) {
    console.log(to, '==============++++++++++++++');
    this.setState({
      callState: OUTGOING_CALL,
      call: true,
      to: to
    })

    // if (document.getElementById('peer').value == '') {
    //   window.alert("You must specify the peer name");
    //   return;
    // }

    // setCallState(PROCESSING_CALL);

    // showSpinner(videoInput, videoOutput);


  }

  stop(message) {
    this.setState({
      callState: NO_CALL,
      call: 0,
    });
    if (this.webRtcPeer) {
      this.webRtcPeer.dispose();
      this.webRtcPeer = null;

      if (!message) {
        var message = {
          id : 'stop'
        }
        this.sendMessage(message);
      }
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
    // if(!this.state.videoCallModal) {
    //   this.videoCallModal.current.clearValidationErrors();
    // }
  }

  toggle_modal() {
    this.setState({
      call: !this.state.call,
    });
    // if(!this.state.videoCallModal) {
    //   this.videoCallModal.current.clearValidationErrors();
    // }
  }

  render() {
    const {videoCallModal} = this.state;
    const { children } = this.props;
    const { noFooter, noNavbar, filterType } = this.state;
    if (children.props.location.pathname == '/trending' || children.props.location.pathname == '/recomended') {
      children.props.location.state = {};
      children.props.location.state.callState = this.state.callState;
      children.props.location.state.setWebRtcPeer = this.setWebRtcPeer;
      children.props.location.state.stop = this.stop;
      children.props.location.state.call = this.call;
    }

    return (
      <Container fluid>
        <Row>
          <MainSidebar filterType={filterType}/>
          <Col
            className="main-content p-0 main-content-class"
            tag="main"
          >
            {!noNavbar && <MainNavbar filterType={filterType} toggleType={() => this.handleClick()} />}
            {filterType && <SubMainNavbar/>}
            {children}
            {this.state.call && 
              // this.state.call && 
              // this.state.videoCallModal && 
              // <Redirect to={{pathname: '/call'}} />
              <VideoCall ref={this.videoCallModal} open={this.state.call} toggle={() => this.toggle_videocall()} toggle_modal={() => this.toggle_modal()} from={this.state.from} to={this.state.to} callState={this.state.callState} ws={this.ws} setWebRtcPeer={this.setWebRtcPeer} stop={this.stop}/>
              // <VideoCall />
            }
            {!noFooter && <MainFooter />}
          </Col>
        </Row>
      </Container>
    );
  }
}
