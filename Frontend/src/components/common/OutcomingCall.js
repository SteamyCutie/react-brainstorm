import React from "react";
import { Button, Modal, ModalBody, Row, Col } from "shards-react";
import "../../assets/landingpage.css"

import DeclineImg from '../../images/call-decline.svg'

export default class IncomingCall extends React.Component {
  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.state = {
      errMsg: '',
    };
    
    this.handleDecline = this.props.onDecline;
  }

  componentDidMount() {
    
  }

  setErrMsg(message) {
    this.setState({
      errMsg: message,
    })
  }

  toggle() {
    const { toggle } = this.props;
    this.handleDecline();
    toggle();
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-incoming-call center" backdrop={true} backdropClassName="backdrop-class">
          <ModalBody className="modal-video-call">
            <div className="video-call-element">
              <Row className="center video-tags">
                <label style={{fontSize: "25px", fontWeight: "bolder", color: "#333333"}}>Calling to {this.props.name}</label>
              </Row>
              <Row className="center">
                <img src={this.props.avatarURL} style={{width: "206px", height: "206px", marginTop: "10px", marginBottom: "50px"}} alter="User avatar" />
              </Row>
              <Row className="center">
                <label style={{fontSize: "15px", fontWeight: "bolder", color: "#333333"}}>{this.state.errMsg}</label>
              </Row>
              <Row className="center btn-group-call">
                <Button className="btn-video-call-decline" onClick={() => this.toggle()}>
                  <img src={DeclineImg} placeholder="Phone" style={{paddingRight: "10px"}}/>
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