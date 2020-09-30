import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormInput, CardFooter, FormSelect, Button, FormTextarea, ListGroup, ListGroupItem, FormGroup } from "shards-react";
import kurentoUtils from 'kurento-utils';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import DeclineImg from '../images/call-decline.svg'
import { Height } from "@material-ui/icons";

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

var name;
var participants = [];

var room_ws = null;

function Participant(user_info, isLocalVideo) {
  this.user_name = user_info.user_name;
	this.user_id = user_info.user_id;
	this.user_avatar = user_info.user_avatar;
	this.user_type = user_info.user_type;

	var container = document.createElement('div');
	container.className = isPresentMainParticipant() ? PARTICIPANT_CLASS : PARTICIPANT_MAIN_CLASS;
	container.id = this.user_id;
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
		var msg =  {
			id : "receiveVideoFrom",
			sender : this.user_id,
			sdpOffer : offerSdp
		};
		this.sendMessage(msg);
	}


	this.onIceCandidate = function (candidate, wp) {
    console.log("Local candidate" + JSON.stringify(candidate));

    var message = {
      id: 'onIceCandidate',
      candidate: candidate,
      user_id: this.user_id,
    };
    this.sendMessage(message);
	}

	Object.defineProperty(this, 'rtcPeer', { writable: true});

	this.dispose = function() {
		console.log('Disposing participant ' + this.name);
    this.rtcPeer.dispose();
    
    const myNode = document.getElementById("room-video-container");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.lastChild);
    }
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
      self_info: {}, 
      roomName: '', 
      fullScreen: false, 
    }
  }

  componentWillMount() {
    this.setWebsocket('wss://' + '192.168.136.129:8443' + '/groupcall');
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
        participants[parsedMessage.user_id].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
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

    var info = {
      room : "aaa",
      user_id: rand_num + "@gmail.com", 
      user_name: "Full Developer: " + rand_num, 
      user_avatar: "https://brainshares.s3-us-west-2.amazonaws.com/1599807220_517526_aaa.png", 
      user_type: 1, 
    }

    this.setState({
      self_info: info, 
      roomName: rand_num, 
    }, () => {
      var message = {
        id : 'joinRoom',
        room : this.state.self_info.room,
        user_id: this.state.self_info.user_id, 
        user_name: this.state.self_info.user_name, 
        user_avatar: this.state.self_info.user_avatar, 
        user_type: this.state.self_info.user_type, 
      }
      this.sendMessage(message);
    })
  }
  
  onNewParticipant(request) {
    const {participants} = this.state;
    let temp = participants;
    
    temp.push(request.user_info);

    this.setState({
      participants: temp, 
    }, () => {
      this.receiveVideo(request.user_info);
    })

  }
  
  receiveVideoResponse(result) {
    participants[result.user_id].rtcPeer.processAnswer (result.sdpAnswer, function (error) {
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
    
    var participant = new Participant(this.state.self_info, true);
    participants[this.state.self_info.user_id] = participant;
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
  
    var temp = [];
    this.setState({
      participants: temp, 
    })

    for ( var key in participants) {
      participants[key].dispose();
    }
  
    // this.ws.close();
  }
  
  receiveVideo(sender) {
    var participant = new Participant(sender, false);
    participants[sender.user_id] = participant;
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
    console.log('Participant ' + request.user_id + ' left');
    const currentParticipants = this.state.participants;
    let temp = currentParticipants;
    let index;

    for (index = 0; index < temp.length; index ++) {
      if(temp[index].user_id === request.user_id) {
        temp.splice(index, 1);
        break;
      }
    }

    this.setState({
      participants: temp, 
    })

    var participant = participants[request.user_id];
    participant.dispose();
    delete participants[request.user_id];
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
      if(param === participant.user_id) {
        document.getElementById(participant.user_id).classList.remove("room-video-display-none");
      } else {
        document.getElementById(participant.user_id).classList.add("room-video-display-none");
      }
      
    })
  }

  toggleFullScreen() {

  }

  render() {
    return (
      <div className="room-container" id="room-container">
        <div className="room-button-container">
          
        </div>
        <div className="room-video-container center" id="room-video-container">
            
        </div>
        <div id="room-member" width="20%" className="room-member">
          <List dense >
            {this.state.participants.map((participant, key) => {
              return (
                <ListItem 
                  key={participant.user_id} 
                  button
                  onClick={() => this.handleListItemClick(participant.user_id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={participant.user_name}
                      src={participant.user_avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText id={participant.user_id} primary={participant.user_name} />
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className="room-control-container">
          <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.leaveRoom()}>Leave Room</Button>
          <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.register()}>Join Room</Button>
          <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.toggleFullScreen()}>Full Screen</Button>
          
          <Button className="btn-room-call-decline" style={{marginRight: "10px"}} onClick={() => this.toggleFullScreen()}>
            <img src={DeclineImg} placeholder="Phone" style={{height: "60px", width: "60px"}} alt="Decline"/>
          </Button>
        </div>
      </div>
    )
  }
}
