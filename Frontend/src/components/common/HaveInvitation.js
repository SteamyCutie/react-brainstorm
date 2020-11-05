import React from "react";
import { Button, Modal, ModalBody, Row, FormTextarea} from "shards-react";
import "../../assets/landingpage.css"

import DeclineImg from '../../images/call-decline.svg'
import AcceptImg from '../../images/call-accept.svg'
import defaultavatar from '../../images/avatar.jpg'

export default class HaveInvitation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
    
    this.onAccept = this.props.onAccept
    this.onDecline = this.props.onDecline
  }

  componentWillMount() {

  }

  toggle(accepted) {
    if(accepted){
      this.onDecline()
    } else {
      this.onAccept()
    }
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} className="modal-invitation-room center" backdrop={true} backdropClassName="backdrop-class">
          <ModalBody className="modal-video-call">
            <div className="video-call-element">
              <Row className="center video-tags">
                <label style={{fontSize: "25px", fontWeight: "bolder", color: "#333333", textAlign: "center"}}>You have invitation in Room </label>
              </Row>
              <Row className="center btn-group-call">
                <Button className="btn-video-call-accept" onClick={() => this.toggle(false)}>
                  <img src={AcceptImg} placeholder="Phone" style={{paddingRight: "10px"}} alt="Accept"/>
                  Accept
                </Button>
                <Button className="btn-video-call-decline" onClick={() => this.toggle(true)}>
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