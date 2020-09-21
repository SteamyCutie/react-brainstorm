import React from "react";
import { Button, Modal, ModalBody,  Row, } from "shards-react";
import "../../assets/landingpage.css"

import AcceptImg from '../../images/call-accept.svg'

export default class ErrorModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {

  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} toggle={() => this.props.toggle()} className="modal-incoming-call center" backdrop={true} backdropClassName="backdrop-class">
          <ModalBody className="modal-video-call">
            <div className="video-call-element">
              <Row className="center video-tags">
                <label style={{fontSize: "13px", fontWeight: "bolder", color: "#333333"}}>{this.props.message} is calling to you</label>
              </Row>
              <Row className="center btn-group-call">
              <Button className="btn-video-call-accept" onClick={this.props.toggle()}>
                <img src={AcceptImg} placeholder="Phone" style={{paddingRight: "10px"}} alt="Error"/>
                OK
              </Button>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}