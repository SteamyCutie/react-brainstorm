import React from "react";
import { Modal, ModalBody, Button, FormInput, Col, Row } from "shards-react";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import LoadingModal from "./LoadingModal";
import { store } from 'react-notifications-component';
import { createforum, gettags } from '../../api/api';

import Close from '../../images/Close.svg'
import Recycle from '../../images/Recycle.svg'
import avatar2 from "../../images/avatar.jpg"

export default class InvitedStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cardinfo: {
        name: '',
        number: '',
        date: '',
        code: ''
      },
      requiremessage: {
        dname: '',
        dnumber: '',
        ddate: '',
        dcode: ''
      },
    };
  }

  componentWillMount() {
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  actionSave = async() => {
    const {cardinfo} = this.state;
  }

  actionRemove = async() => {
    const {cardinfo} = this.state;
  }

  removeSession() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('user-type');
    localStorage.removeItem('user_name');
    localStorage.removeItem('ws');
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

  render() {
    const { open } = this.props;
    const { cardinfo, requiremessage, loading } = this.state;
    return (
      <div>
        <ReactNotification />
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Invited students</h1>
          <Row form>
            <a href="#!"><h5 style={{float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>+ Invite more students</h5></a>
          </Row>
          <Row form>
            <Col md="10" className="modal-input-group-class">
              <div className="items-container">
                <div className="no-padding">
                  <img src={avatar2} className="invited-student-logo" alt="card"/>
                </div>
                <div className="nvited-student-desc">
                  <h4 className="small-card-payment-title no-margin">David</h4>
                  <h6 className="invited-student-desc-desc no-margin">12312312</h6>
                </div>
              </div>
            </Col>
            <Col md="2" className="modal-input-group-class">
              <div className="content-center block-content-class button-text-group-class">
                <Button style={{marginBottom: 10}} className="btn-mentor-detail-book" onClick={() => this.actionRemove()}>
                  <img src={Recycle} alt="Clock" />
                  Remove
                </Button>
              </div>
            </Col>
          </Row>
          
          <div className="content-center block-content-class button-text-group-class">
            <Button onClick={() => this.actionSave()}>Save</Button>
          </div>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}