import React from "react";
import { Container, Row, Col, Button, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import SmallCardForum from "../components/common/SmallCardForum";
import CreateLiveForum from "../components/common/CreateLiveForum";
import EditLiveForum from "../components/common/EditLiveForum";
import ConfirmModal from "../components/common/ConfirmModal";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { getforums } from "../api/api";
import kurentoUtils from 'kurento-utils';

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

var name;
var participants = {};

function Participant(name) {
	this.name = name;
	var container = document.createElement('div');
	container.className = isPresentMainParticipant() ? PARTICIPANT_CLASS : PARTICIPANT_MAIN_CLASS;
	container.id = name;
	var span = document.createElement('span');
	var video = document.createElement('video');
	var rtcPeer;

	container.appendChild(video);
	container.appendChild(span);
	container.onclick = switchContainerClass;
	document.getElementById('participants').appendChild(container);

	span.appendChild(document.createTextNode(name));

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
		container.parentNode.removeChild(container);
	};
}

export default class ScheduleLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      loading: false,
      forumInfos: [],
      ModalOpen: false,
      ModalEditOpen: false,
      ModalConfirmOpen: false, 
      room: '', 
    };
  }

  componentWillMount() {
    //this.getForums();  
    // this.setWebsocket('wss://' + 'media.brainsshare.com:8443' + '/groupcall') // location.host
    this.setWebsocket('wss://' + 'localhost:8443' + '/groupcall') // location.host
  }

  /******************************** Group Call Start ************************/

  setWebsocket(wsUri) {
    this.ws = new WebSocket(wsUri);
    //const that = this;

    // this.ws.onmessage = function(message) {
    //   var parsedMessage = JSON.parse(message.data);
    //   console.info('Received message: ' + message.data);

    //   switch (parsedMessage.id) {
    //   case 'existingParticipants':
    //     this.onExistingParticipants(parsedMessage);
    //     break;
    //   case 'newParticipantArrived':
    //     this.onNewParticipant(parsedMessage);
    //     break;
    //   case 'participantLeft':
    //     this.onParticipantLeft(parsedMessage);
    //     break;
    //   case 'receiveVideoAnswer':
    //     this.receiveVideoResponse(parsedMessage);
    //     break;
    //   case 'iceCandidate':
    //     participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
    //           if (error) {
    //           console.error("Error adding candidate: " + error);
    //           return;
    //           }
    //       });
    //       break;
    //   default:
    //     console.error('Unrecognized message', parsedMessage);
    //   }
    // }
  }

  register() {
    name = 'asdf';
    var room = 'aaaa';
  
    // document.getElementById('room-header').innerText = 'ROOM ' + room;
    // document.getElementById('join').style.display = 'none';
    // document.getElementById('room').style.display = 'block';
  
    var message = {
      id : 'joinRoom',
      name : name,
      room : room,
    }
    this.sendMessage(message);
  }
  
  onNewParticipant(request) {
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
    // console.log(name + " registered in room " + room);
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
  
    msg.data.forEach(this.receiveVideo);
  }
  
  leaveRoom() {
    this.sendMessage({
      id : 'leaveRoom'
    });
  
    for ( var key in participants) {
      participants[key].dispose();
    }
  
    document.getElementById('join').style.display = 'block';
    document.getElementById('room').style.display = 'none';
  
    this.ws.close();
  }
  
  receiveVideo(sender) {
    var participant = new Participant(sender);
    participants[sender] = participant;
    var video = participant.getVideoElement();
  
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
    });;
  }
  
  onParticipantLeft(request) {
    console.log('Participant ' + request.name + ' left');
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

  toggle_createliveforum() {
    this.setState({
      ModalOpen: !this.state.ModalOpen
    });
  }

  toggle_createsuccess(text) {
    this.showSuccess(text);
  }

  toggle_createfail(text) {
    this.showFail(text);
  }

  toggle_editsuccess(text) {
    this.showSuccess(text);
  }

  toggle_createwarning(text) {
    this.showWarning(text);
  }

  toggle_editfail(text) {
    this.showFail(text);
  }

  toggle_editliveforum(id) {
    if (id) {
      this.setState({
        ModalEditOpen: !this.state.ModalEditOpen,
        id: id
      });
    }
    else {
      this.setState({
        ModalEditOpen: !this.state.ModalEditOpen,
      });
    }
  }

  toggle_confirm(id) {
    this.setState({
      ModalConfirmOpen: !this.state.ModalConfirmOpen,
      id: id
    });
  }

  getForums = async() => {
    try {
      this.setState({loading: true});
      const result = await getforums({email: localStorage.getItem('email')});
      if (result.data.result === "success") {
        this.setState({forumInfos: result.data.data});
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  showSuccess(text) {
    store.addNotification({
      title: "Success",
      message: text,
      type: "success",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  showFail(text) {
    store.addNotification({
      title: "Fail",
      message: text,
      type: "danger",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  showWarning(text) {
    store.addNotification({
      title: "Warning",
      message: text,
      type: "warning",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  removeSession() {
    localStorage.clear();
  }

  handleCreateRoom() {
    // this.setWebsocket('wss://' + 'localhost:8443' + '/groupcall') // location.host
    window.open("/room-call");
  }

  handleJoinRoom() {
    window.open("/room-call");
  }

  onSelectRoomChange(e) {

  }

  render() {
    const { ModalOpen, ModalEditOpen, ModalConfirmOpen, loading, forumInfos, id } = this.state;
    return (
      <div>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <CreateLiveForum open={ModalOpen} toggle={() => this.toggle_createliveforum()} toggle_createsuccess={(text) => this.toggle_createsuccess(text)} toggle_createfail={(text) => this.toggle_createfail(text)} toggle_createwarning={(text) => this.toggle_createwarning(text)}></CreateLiveForum>
        <EditLiveForum open={ModalEditOpen} id={id} toggle={() => this.toggle_editliveforum()} toggle_editsuccess={(text) => this.toggle_editsuccess(text)} toggle_editfail={(text) => this.toggle_editfail(text)}></EditLiveForum>
        <ConfirmModal open={ModalConfirmOpen} id={id} toggle={() => this.toggle_confirm()}></ConfirmModal>
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <Card small className="schedule-forum-card">
            <CardHeader className="live-forum-header">
              <h5 className="live-forum-header-title no-margin">Schedule live forum</h5>
              {parseInt(localStorage.getItem('is_mentor')) === 1 ? <Button className="live-forum-header-button" onClick={() => this.toggle_createliveforum()}>Create live forum</Button> : <></>}
              
              <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.handleCreateRoom()}>Create Room</Button>
              <Button className="live-forum-header-button" style={{marginRight: "10px"}} onClick={() => this.register()}>Join Room</Button>
              <FormSelect style={{height: "50px", width: "400px", marginRight: "10px"}} onChange={(e) => this.onSelectRoomChange(e)}>
                <option value="">Select Room</option>
                <option value="">Room 1</option>
                <option value="">Room 2</option>
                <option value="">Room 3</option>
                <option value="">Room 4</option>
                <option value="">Room 5</option>
              </FormSelect>
            </CardHeader>
            <CardBody>
              <Row>
                {forumInfos.map((item, idx) => 
                  <Col key={idx} xl="4" lg="4" sm="6">
                    <SmallCardForum key={idx} item={item} toggle_editliveforum={(id) => this.toggle_editliveforum(id)} toggle_confirm={(id) => this.toggle_confirm(id)}/>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>    
        </Container>
      </div>
    )
  }
};