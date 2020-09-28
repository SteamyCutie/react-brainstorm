import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormInput, CardFooter, FormSelect, Button, FormTextarea, ListGroup, ListGroupItem, FormGroup } from "shards-react";
import kurentoUtils from 'kurento-utils';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

var name;
var participants = {};

var room_ws = null;

function Participant(name, isLocalVideo) {
	this.name = name;
	var container = document.createElement('div');
	container.className = isPresentMainParticipant() ? PARTICIPANT_CLASS : PARTICIPANT_MAIN_CLASS;
	container.id = name;
	var span = document.createElement('span');
  var video = document.createElement('video');
  var rtcPeer;

	container.appendChild(video);
	container.appendChild(span);
	document.getElementById('room-video-container').appendChild(container);

	

	video.id = 'video-' + name;
	video.autoplay = true;
  video.controls = false;

  if(isLocalVideo) {
    container.classList.add("local-video");
  } else {
    container.classList.add("room-video-display-none");
    container.classList.add("participant-video");
    span.appendChild(document.createTextNode(name));
  }

	this.getElement = function() {
		return container;
	}

	this.getVideoElement = function() {
		return video;
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
		container.parentNode.removeChild(container);
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
      selfName: '', 
      roomName: '', 
      fullScreen: false, 
    }

    // this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  componentWillMount() {
    this.setWebsocket('wss://' + '192.168.136.130:8443' + '/groupcall');
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
    
    const rand_num = Math.floor(Math.random() * 101).toString();
    name = rand_num;
    var room = 'aaa';
  
    this.setState({
      selfName: rand_num, 
      roomName: room, 
    })
  
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
    
    var participant = new Participant(this.state.selfName, true);
    participants[this.state.selfName] = participant;
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
    document.getElementById(this.state.participants[this.state.participants.length - 1]).classList.remove("room-video-display-none");
  }
  
  leaveRoom() {
    this.sendMessage({
      id : 'leaveRoom'
    });
  
    for ( var key in participants) {
      participants[key].dispose();
    }
  
    // this.ws.close();
  }
  
  receiveVideo(sender) {
    var participant = new Participant(sender, false);
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

  handleListItemClick(param) {
    this.state.participants.map((participant) => {
      if(param === participant) {
        document.getElementById(participant).classList.remove("room-video-display-none");
      } else {
        document.getElementById(participant).classList.add("room-video-display-none");
      }
      
    })
  }

  toggleFullScreen() {
    const element = document.getElementById("room-container");

    if(!this.state.fullScreen) {
      console.log("11111111111111111111111111111111")
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      }
    } else {
      console.log("2222222222222222222222222222222222")
      element.webkitExitFullscreen();
      if (element.exitFullscreen) {
        element.exitFullscreen();
      } else if (element.mozCancelFullScreen) { /* Firefox */
        element.mozCancelFullScreen();
      } else if (element.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        element.webkitExitFullscreen();
      } else if (element.msExitFullscreen) { /* IE/Edge */
        element.msExitFullscreen();
      }
    }

    this.setState({
      fullScreen: !this.state.fullScreen, 
    })
  }

  render() {
    return (
      <div className="room-container" id="room-container">
        <Col xl="9">
          <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.leaveRoom()}>Leave Room</Button>
          <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.register()}>Join Room</Button>
          <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.toggleFullScreen()}>Full Screen</Button>
          <div className="room-video-container" id="room-video-container">

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
            <List dense >
              {this.state.participants.map((participant, key) => {
                const labelId = {participant};
                return (
                  <ListItem 
                    key={participant} 
                    button
                    onClick={() => this.handleListItemClick(participant)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={participant}
                        src={`/static/images/avatar/${participant + 1}.jpg`}
                      />
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={participant} />
                  </ListItem>
                );
              })}
            </List>
          </div>
        </Col>
      </div>
    )
  }
}
