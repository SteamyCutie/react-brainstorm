import React from "react";
import { Button, Modal, ModalBody, Row, FormTextarea, FormInput} from "shards-react";
import "../../assets/landingpage.css"

import DeclineImg from '../../images/call-decline.svg'
import AcceptImg from '../../images/call-accept.svg'
import defaultavatar from '../../images/avatar.jpg'
import WhiteboardCloseImg from '../../images/whiteboard-close.svg'
import { signout, getallparticipants } from '../../api/api';
import UserActions from "../layout/MainNavbar/NavbarNav/UserActions";

export default class InviteParticipant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      users: [], 
      suggestedUsers: [], 
    };
    
    this.onAccept = this.props.onAccept
    this.onDecline = this.props.onDecline
  }

  componentDidMount() {
    this.getAllParticipants();
  }

  toggle(accepted) {
    if(accepted){
      this.onDecline()
    } else {
      this.onAccept()
    }
  }

  removeSession() {
    localStorage.clear();
    window.location.href = "/";
  }

  signout = async() => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        this.removeSession();
      } else if (result.data.result === "warning") {
        this.removeSession();
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
        } else if (result.data.message === "Token is Invalid") {
          this.removeSession();
        } else if (result.data.message === "Authorization Token not found") {
          this.removeSession();
        } else {
          this.removeSession();
        }
      }
    } catch(error) {
      this.removeSession();
    }
  }

  getAllParticipants = async() => {
    let param = {
      user_id: localStorage.getItem("user_id")
    }
    try {
      const result = await getallparticipants(param);
      if (result.data.result === "success") {
        let param = {
          label: '',
          value: '', 
          email: '',
          avatar: '', 
        };

        let params = [];
        let params_suggested = [];

        for (var i = 0; i < result.data.data.length; i ++) {
          var randNum = Math.floor(Math.random() * result.data.data.length);

          param.label = result.data.data[i].name;
          param.value = result.data.data[i].id;
          param.email = result.data.data[i].email;
          param.avatar = result.data.data[i].avatar;

          if (randNum % 2 && params_suggested.length < 4) {
            params_suggested.push(param);
          } 

          params.push(param);
          param = {};
        }
        console.log(params, "#95");
        this.setState({
          users: params, 
          suggestedUsers: params_suggested, 
        });
      } else if (result.data.result === "warning") {

      } else {
        if (result.data.message === "Token is Expired") {
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.signout();
        }
      }
    } catch(err) {

    }
  }

  handleChange(e) {
    this.setState({
      email: e.target.value, 
    })
  }

  handleClick() {
    this.props.onInvite(this.state.email);

    this.setState({
      email: '', 
    })
  }

  render() {
    const { open } = this.props;
    const {suggestedUsers} = this.state;
    return (
      <div>
        <Modal open={open} className="modal-invitation-room-participant center" backdrop={true} backdropClassName="backdrop-class">
          <ModalBody className="modal-room-invite">
            <div className="room-invite-element">
              <Button className="btn-rooom-control3 float-center" onClick={() => this.props.onInviteClose()}>
                <img src={WhiteboardCloseImg} alt="Add user"/>
              </Button>
              <Row className="center room-invite-label">
                <label style={{fontSize: "25px", fontWeight: "bolder", color: "#333333", textAlign: "center"}}>Invite participants</label>
              </Row>
              <Row className="room-invite-input">
                <FormInput className="room-invite-email" placeholder="Enter participant email" onChange={(e) => this.handleChange(e)} value={this.state.email} />
                <Button className="btn-room-invite" onClick={() => this.handleClick()}>
                  Invite
                </Button>
              </Row>
              <div className="room-invite-participants">
                <label className="room-invite-participants-label">Suggested participants</label>
                {suggestedUsers.map((user, key) => {
                  return (
                    <Row className="room-invite-suggested" id={key}>
                      <img src={user.avatar} alt={user.label}/>
                      <div style={{width: "305px"}}>
                        <div className="room-invite-participants-name">{user.label}</div>
                        <div className="room-invite-participant-email">{user.email}</div>
                      </div>
                      <Button className="btn-room-invite-suggested" onClick={() => this.handleClick()}>
                        Invite
                      </Button>
                    </Row>
                  );
                })}
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
