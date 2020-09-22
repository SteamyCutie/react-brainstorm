import React from "react";
import { Button, Modal, ModalBody, Row } from "shards-react";
import "../../assets/landingpage.css"

import DeclineImg from '../../images/call-decline.svg'

export default class IncomingCall extends React.Component {
  constructor(props) {
    super(props);

    this.handleDecline = this.props.onDecline;
  }

  componentWillMount() {
    
  }

  toggle() {
    const { toggle } = this.props;
    this.handleDecline();
    toggle();
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-incoming-call center" backdrop={true} backdropClassName="backdrop-class">
          <ModalBody className="modal-video-call">
            <div className="video-call-element">
              <Row className="center video-tags">
                <label style={{fontSize: "25px", fontWeight: "bolder", color: "#333333", textAlign: "center"}}>Calling to {this.props.name}</label>
              </Row>
              <Row className="center">
                <img src={this.props.avatar} alt="avatar" style={{width: "206px", height: "206px", marginTop: "10px", marginBottom: "50px"}} alter="User avatar" />
              </Row>
              <Row className="center">
                <label style={{fontSize: "15px", fontWeight: "bolder", color: "#333333", textAlign: "center", height: "20px"}}>{this.props.errMsg}</label>
              </Row>
              <Row className="center btn-group-call">
                <Button className="btn-video-call-decline" onClick={() => this.toggle()}>
                  <img src={DeclineImg} placeholder="Phone" style={{paddingRight: "10px"}} alt="Decline"/>
                  Decline
                </Button>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}