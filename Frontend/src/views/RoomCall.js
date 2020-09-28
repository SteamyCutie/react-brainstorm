import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormInput, CardFooter, FormSelect, Button, FormTextarea, ListGroup, ListGroupItem, FormGroup } from "shards-react";

// import { Participant } from "../components/VideoCallParticipant"

import kurentoUtils from 'kurento-utils';

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

var name;
var participants = {};

var room_ws = null;

function Participant(name) {
	this.name = name;
	var container = document.createElement('div');
	container.className = isPresentMainParticipant() ? PARTICIPANT_CLASS : PARTICIPANT_MAIN_CLASS;
	container.id = name;
	var span = document.createElement('span');
  var video = document.createElement('video');
  // var video = document.getElementById('video-from');
  var rtcPeer;

	container.appendChild(video);
	// container.appendChild(span);
	// container.onclick = switchContainerClass;
	document.getElementById('room-video-container').appendChild(container);

	// span.appendChild(document.createTextNode(name));

	video.id = 'video-' + name;
	video.autoplay = true;
	video.controls = false;


	this.getElement = function() {
		return container;
	}

	this.getVideoElement = function() {
		return video;
	}

	function switchContainerClass() {
		if (container.className === PARTICIPANT_CLASS) {
			var elements = Array.prototype.slice.call(document.getElementsByClassName(PARTICIPANT_MAIN_CLASS));
			elements.forEach(function(item) {
					item.className = PARTICIPANT_CLASS;
				});

      container.className = PARTICIPANT_MAIN_CLASS;
    } else {
      container.className = PARTICIPANT_CLASS;
		}
	}

	function isPresentMainParticipant() {
		return ((document.getElementsByClassName(PARTICIPANT_MAIN_CLASS)).length != 0);
	}

	this.offerToReceiveVideo = function(error, offerSdp, wp){
		if (error) return console.error ("sdp offer error")
		console.log('Invoking SDP offer callback function');
		var msg =  { id : "receiveVideoFrom",
				sender : name,
				sdpOffer : offerSdp
			};
		this.sendMessage(msg);
	}


	this.onIceCandidate = function (candidate, wp) {
    console.log("Local candidate" + JSON.stringify(candidate));

    var message = {
      id: 'onIceCandidate',
      candidate: candidate,
      name: name
    };
    this.sendMessage(message);
	}

	Object.defineProperty(this, 'rtcPeer', { writable: true});

	this.dispose = function() {
		console.log('Disposing participant ' + this.name);
		this.rtcPeer.dispose();
		// container.parentNode.removeChild(container);
  };
  
  this.sendMessage = function(message) {
    var jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    room_ws.send(jsonMessage);
  };
}

export default class RoomCall extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      errorMsg: '',
      code: '',
      participants: [], 
    }
  }

  componentWillMount() {
    this.setWebsocket('wss://' + '192.168.136.129:8443' + '/groupcall') // location.host
  }

  /******************************** Group Call Start ************************/

  setWebsocket(wsUri) {
    room_ws = new WebSocket(wsUri);
    this.ws = room_ws;
    localStorage.setItem('room_ws', this.ws);
    const that = this;

    this.ws.onmessage = function(message) {
      var parsedMessage = JSON.parse(message.data);
      console.info('Received message: ' + message.data);

      switch (parsedMessage.id) {
      case 'existingParticipants':
        that.onExistingParticipants(parsedMessage);
        break;
      case 'newParticipantArrived':
        that.onNewParticipant(parsedMessage);
        break;
      case 'participantLeft':
        that.onParticipantLeft(parsedMessage);
        break;
      case 'receiveVideoAnswer':
        that.receiveVideoResponse(parsedMessage);
        break;
      case 'iceCandidate':
        participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
          if (error) {
          console.error("Error adding candidate: " + error);
          return;
          }
        });
        break;
      default:
        console.error('Unrecognized message', parsedMessage);
      }
    }
  }

  register() {
    
    const radn_num = Math.floor(Math.random() * 101).toString();
    name = radn_num;
    var room = 'aaa';
  
    // document.getElementById('room-header').innerText = 'ROOM ' + room;
    // document.getElementById('join').style.display = 'none';
    // document.getElementById('room').style.display = 'block';

    console.log(this.ws.readyState, "Websocket Ready State");
  
    var message = {
      id : 'joinRoom',
      name : name,
      room : room,
    }
    this.sendMessage(message);
  }
  
  onNewParticipant(request) {
    const {participants} = this.state;
    let temp = participants;
    temp.push(request.name);

    this.setState({
      participants: temp, 
    })
    this.receiveVideo(request.name);
  }
  
  receiveVideoResponse(result) {
    participants[result.name].rtcPeer.processAnswer (result.sdpAnswer, function (error) {
      if (error) return console.error (error);
    });
  }
  
  callResponse(message) {
    if (message.response != 'accepted') {
      console.info('Call not accepted by peer. Closing call');
      this.stop();
    } else {
      this.webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
        if (error) return console.error (error);
      });
    }
  }
  
  onExistingParticipants(msg) {
    var constraints = {
      audio : true,
      video : {
        mandatory : {
          maxWidth : 320,
          maxFrameRate : 15,
          minFrameRate : 15
        }
      }
    };
    
    var participant = new Participant(name);
    participants[name] = participant;
    var video = participant.getVideoElement();
  
    var options = {
      localVideo: video,
      mediaConstraints: constraints,
      onicecandidate: participant.onIceCandidate.bind(participant)
    }

    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
      function (error) {
        if(error) {
          return console.error(error);
        }
        this.generateOffer (participant.offerToReceiveVideo.bind(participant));
    });
    
    this.setState({
      participants: msg.data, 
    })
    
    msg.data.forEach(this.receiveVideo);
  }
  
  leaveRoom() {
    this.sendMessage({
      id : 'leaveRoom'
    });
  
    for ( var key in participants) {
      participants[key].dispose();
    }
  
    // document.getElementById('join').style.display = 'block';
    // document.getElementById('room').style.display = 'none';
    // this.ws.close();
  }
  
  receiveVideo(sender) {
    var participant = new Participant(sender);
    participants[sender] = participant;
    var video = participant.getVideoElement();
    const that = this;
  
    var options = {
        remoteVideo: video,
        onicecandidate: participant.onIceCandidate.bind(participant)
      }
  
    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
        function (error) {
          if(error) {
            return console.error(error);
          }
          this.generateOffer (participant.offerToReceiveVideo.bind(participant));
    });
  }
  
  onParticipantLeft(request) {
    console.log('Participant ' + request.name + ' left');
    const currentParticipants = this.state.participants;
    let temp = currentParticipants;
    let filteredAry = temp.filter(e => e !== request.name)

    this.setState({
      participants: filteredAry, 
    })

    var participant = participants[request.name];
    participant.dispose();
    delete participants[request.name];

    var element = document.getElementById('video-' + request.name);
    element.parentNode.removeChild(element);
  }
  
  sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    this.ws.send(jsonMessage);
  }

  /********************************* Group Call End *************************/

  handleCreateRoom() {
    this.register();
  }

  onSelectRoomChange(e) {

  }

  render() {
    return (
      <div className="room-container">
      {/* </div> <Container fluid className="main-content-container px-4 pb-4 main-content-container-class"> */}
        <Col xl="9">
          <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.leaveRoom()}>Leave Room</Button>
          <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.register()}>Join Room</Button>
          <FormSelect style={{height: "50px", width: "400px", marginRight: "10px"}} onChange={(e) => this.onSelectRoomChange(e)}>
            <option value="">Select Room</option>
            <option value="">Room 1</option>
            <option value="">Room 2</option>
            <option value="">Room 3</option>
            <option value="">Room 4</option>
            <option value="">Room 5</option>
          </FormSelect>
          <div className="room-video-container" id="room-video-container">
            {/* <video id="video-from" width="100%" className="video-call-student">
              Your browser does not support the video tag.
            </video>
            <video id="video-me" width="200px" height="150px" className="video-call-mentor">
              Your browser does not support the video tag.
            </video> */}
          </div>
          <div id="room-chat-area" className="room-chat-area">
            <FormGroup>
              <FormTextarea placeholder="Please input" className="chat-history"/>
              <FormInput placeholder="Input.." className="chat-input"/>
            </FormGroup>
          </div>
        </Col>
        <Col xl="3" className="room-member">
          <div id="room-member" width="20%">
          <ListGroup>
            {this.state.participants.map((participant, key) => 
              <ListGroupItem id={key}>{participant}</ListGroupItem>
            )}
          </ListGroup>
          </div>
        </Col>
      {/* </Container> */}
      </div>
    )
  }
}
