import React from "react";
import { Button, Modal, ModalBody,  Row, FormTextarea, Col } from "shards-react";
import LoadingModal from "./LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import "../../assets/landingpage.css";
import DeclineImg from '../../images/call-decline.svg';
import AcceptImg from '../../images/call-accept.svg';
import defaultavatar from '../../images/avatar.jpg';

import { getuserinfobyid } from '../../api/api';

export default class OutcomingCallDesc extends React.Component {
  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.state = {
      loading: false,
      userinfo: {},
      remaincount: 150,
      description: '',
      callState: false,
    };
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && this.props.id !== nextProps.id) {
      this.getUserInfo(nextProps.id);
    }
  }

  getUserInfo = async(id) => {
    let param = {
      id: id
    }
    try {
      this.setState({loading: true});
      const result = await getuserinfobyid(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          userinfo: result.data.data
        });
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
          this.signout();
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

  changeDescription(e) {
    var array = e.target.value.split("");
    if (array.length > 150) {
      return;
    } else {
      var { remaincount } = this.state;
      remaincount = 150 - array.length;
      this.setState({
        remaincount: remaincount,
        description: e.target.value
      });
    }
  }

  toggle(accepted) {
    const { setDescription } = this.props;
    if(accepted){
      // this.onDecline()
    } else {
      // this.onAccept()
      setDescription(this.state.description);
      // callwithdescription();
      this.setState({
        description: '',
      })
    }
  }

  removeSession() {
    localStorage.clear();
    window.location.href = "/";
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
      },
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

  handleCancel() {
    const {onCancel} = this.props;
    onCancel();

    this.setState({
      callState: false, 
      description: '', 
      userinfo: {}, 
    })
  }

  handleCall() {
    const {setDescription} = this.props;

    setDescription(this.state.description, this.state.userinfo);

    this.setState({
      callState: true, 
      userinfo: {}, 
    })

    document.getElementById("call-description").disabled = true;
  }

  handleEndCall() {
    const {onCallEnd} = this.props;
    onCallEnd();

    this.setState({
      callState: false, 
      description: '', 
      userinfo: {}, 
    })
  }

  render() {
    const { open } = this.props;
    const { loading, userinfo, remaincount, description } = this.state;
    return (
      <div>
        <ReactNotification />
        <Modal size="lg" open={open} toggle={() => this.toggle()} className="modal-incoming-call center" backdrop={true} backdropClassName="backdrop-class">
          <ModalBody className="modal-video-call">
            <div className="video-call-element">
              <Row className="center video-tags">
                <label style={{fontSize: "25px", fontWeight: "bolder", color: "#333333"}}>{this.state.callState ? "Calling" : "Call"} to {userinfo.name}</label>
              </Row>
              <Row style={{marginBottom: "50px"}}>
                <Col md="4" className="no-padding calling-avatar">
                  {userinfo.avatar && <img src={userinfo.avatar} alt="avatar" style={{width: "206px", height: "206px", borderRadius: "6px"}} alter="User avatar" />}
                  {!userinfo.avatar && <img src={defaultavatar} alt="avatar" style={{width: "206px", height: "206px", borderRadius: "6px"}} alter="User avatar" />}
                  {
                    userinfo.status === 1 && <div className="carousel-component-online-class"></div>
                  }
                </Col>
                <Col md="8" xs="12" className="no-padding">
                  <label htmlFor="fePassword">Call description</label>
                  <label htmlFor="fePassword" className="remain-symbols">{remaincount} symbols left</label>
                  <FormTextarea id="call-description" placeholder="Type here" style={{height: "175px", fontSize: "17px"}}onChange={(e) => this.changeDescription(e)} value={description}/>
                </Col>
              </Row>
              <Row className="center btn-group-call">
                {!this.state.callState && 
                  <Button id="btn-call-cancel" className="btn-video-call-decline" onClick={() => this.handleCancel()}>
                    Cancel
                  </Button>
                }
                {!this.state.callState && 
                  <Button id="btn-call-call" className="btn-video-call-accept" onClick={() => this.handleCall()}>
                    <img src={AcceptImg} placeholder="Phone" style={{paddingRight: "10px"}} alt="Accept"/>
                    Call
                  </Button>
                }
                {this.state.callState && 
                  <Button id="btn-call-end" className="btn-video-call-decline" onClick={() => this.handleEndCall()}>
                    <img src={DeclineImg} placeholder="Phone" style={{paddingRight: "10px"}} alt="Decline"/>
                    End
                  </Button>
                }
              </Row>
            </div>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}