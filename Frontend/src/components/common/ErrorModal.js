import React from "react";
import { Button, Modal, ModalBody,  Row, Col } from "shards-react";
import "../../assets/landingpage.css"

import DeclineImg from '../../images/call-decline.svg'
import AcceptImg from '../../images/call-accept.svg'

export default class ErrorModal extends React.Component {
  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.state = {

    };
    
    this.onAccept = this.props.onAccept
    this.onDecline = this.props.onDecline
  }

  componentDidMount() {

  }

  toggle(accepted) {
    const { toggle } = this.props;
    if(accepted){
      this.onDecline()
    } else {
      this.onAccept()
    }
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
                <label style={{fontSize: "13px", fontWeight: "bolder", color: "#333333"}}>{this.props.message} is calling to you</label>
              </Row>
              <Row className="center btn-group-call">
              <Button className="btn-video-call-accept" onClick={this.props.handleClick()}>
                <img src={AcceptImg} placeholder="Phone" style={{paddingRight: "10px"}}/>
                Accept
              </Button>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}