import React from "react";
import { Button, Modal, ModalBody, FormInput } from "shards-react";
import "../../assets/landingpage.css"
import { Link } from "react-router-dom";
import SmallCardPaymentSubscribe from "../common/SmallCardPaymentSubscribe"

import Facebook from '../../images/Facebook.svg'
import Google from '../../images/Google.svg'
import Close from '../../images/Close.svg'

export default class SubscribeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentCard: [
        {
          title: "Mastercard ending in 2715",
          image: require("../../images/Mastercard-logo.png"),
          expireDate: "8/23",
        },
        {
          title: "Visa ending in 9372",
          image: require("../../images/VisaCard-logo.png"),
          expireDate: "02/21",
        }
      ]
    }
  }

  toggle() {
    const { toggle } = this.props;
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
        <Modal open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} placeholder="Close Image" /></Button>
          <ModalBody className="subscribe-modal">
            <h1 className="content-center modal-header-class">Subscribe mentor Kianna Press</h1>
            <div style={{width: "100%"}}>
              <h5 style={{float: "left", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>Monthly subscription</h5>
              <h5 style={{float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>$50</h5>
            </div>
            <div className="subscribe-card-container">
            <h5 style={{float: "left", fontSize: "16px", fontWeight: "bold", color: "#333333", paddingBottom: "10px"}}>Choose card</h5>
              {this.state.paymentCard.map((card, idx) => (
                <SmallCardPaymentSubscribe
                  id={idx}
                  title={card.title}
                  expireDate={card.expireDate}
                  image={card.image}
                />
              ))}
              <h5 style={{float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>+ Add new card</h5>
            </div>
            <div className="content-center block-content-class button-text-group-class" style={{marginBottom: "40px"}}>
              <Button className=" center">Subscribe</Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}