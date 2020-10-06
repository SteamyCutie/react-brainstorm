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
      userinfo: {}
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

  toggle(accepted) {
    const { callwithdescription } = this.props;
    // if(accepted){
    //   this.onDecline()
    // } else {
    //   this.onAccept()
    // }
    callwithdescription();
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

  render() {
    const { open } = this.props;
    const { loading, userinfo } = this.state;
    return (
      <div>
        <ReactNotification />
        <Modal size="lg" open={open} toggle={() => this.toggle()} className="modal-incoming-call center" backdrop={true} backdropClassName="backdrop-class">
          <ModalBody className="modal-video-call">
            <div className="video-call-element">
              <Row className="center video-tags">
                <label style={{fontSize: "25px", fontWeight: "bolder", color: "#333333"}}>Call to {userinfo.name}</label>
              </Row>
              <Row className="center">
                <Col md="4">
                  {userinfo.avatar && <img src={userinfo.avatar} alt="avatar" style={{width: "206px", height: "206px", marginTop: "10px", marginBottom: "50px"}} alter="User avatar" />}
                  {!userinfo.avatar && <img src={defaultavatar} alt="avatar" style={{width: "206px", height: "206px", marginTop: "10px", marginBottom: "50px"}} alter="User avatar" />}
                  {
                    userinfo.status === 1 && <div className="carousel-component-online-class"></div>
                  }
                </Col>
                <Col md="8" className="project-detail-input-group">
                  <label htmlFor="fePassword">Call description</label>
                  <FormTextarea placeholder="Type here" className="profile-detail-desc profile-detail-input" />
                </Col>
              </Row>
              <Row className="center btn-group-call">
                <Button className="btn-video-call-decline" onClick={() => this.toggle(true)}>
                  <img src={DeclineImg} placeholder="Phone" style={{paddingRight: "10px"}} alt="Decline"/>
                  Cancel
                </Button>
                <Button className="btn-video-call-accept" onClick={() => this.toggle(false)}>
                  <img src={AcceptImg} placeholder="Phone" style={{paddingRight: "10px"}} alt="Accept"/>
                  Call
                </Button>
              </Row>
            </div>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}