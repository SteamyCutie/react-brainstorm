import React from "react";
import { Button, Modal, ModalBody,  Row} from "shards-react";
import "../../assets/landingpage.css"

import DeclineImg from '../../images/call-decline.svg'
import AcceptImg from '../../images/call-accept.svg'

export default class IncomingCall extends React.Component {
  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.state = {

    };
    
    this.onAccept = this.props.onAccept
    this.onDecline = this.props.onDecline
  }

  componentWillMount() {

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
                <label style={{fontSize: "25px", fontWeight: "bolder", color: "#333333"}}>{this.props.name} is calling to you</label>
              </Row>
              <Row className="center">
                <img src={this.props.avatar} alt="avatar" style={{width: "206px", height: "206px", marginTop: "10px", marginBottom: "50px"}} alter="User avatar" />
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