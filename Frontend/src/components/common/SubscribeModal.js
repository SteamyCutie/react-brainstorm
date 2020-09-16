import React from "react";
import { Button, Modal, ModalBody } from "shards-react";
import "../../assets/landingpage.css"
import SmallCardPaymentSubscribe from "../common/SmallCardPaymentSubscribe"
import Close from '../../images/Close.svg'

export default class SubscribeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      paymentCard: [
        {
          type: "master",
          title: "Mastercard ending in 2715",
          image: require("../../images/Mastercard-logo.png"),
          expireDate: "8/23",
        },
        {
          type: "visa",
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

  handleSubscribe = async(mentor_id, sub_plan_fee) => {
    let param = {
      email: localStorage.getItem('email'),
      mentor_id: mentor_id,
      sub_plan_fee: sub_plan_fee,
      type: 'visa'
    }
    try {
      this.setState({loading: true});
      // const result = await subscribe(param);
      // if (result.data.result == "success") {
      // } else {
      // }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
    };
  }

  changeCard(type) {
  }

  render() {
    const { open, item } = this.props;
    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} placeholder="Close Image" alt="Close Image"/></Button>
          <ModalBody className="subscribe-modal">
            <h1 className="content-center modal-header-class">Subscribe mentor {item.name}</h1>
            <div style={{width: "100%"}}>
              <h5 style={{float: "left", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>Monthly subscription</h5>
              <h5 style={{float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>${item.sub_plan_fee}</h5>
            </div>
            <div className="subscribe-card-container">
            <h5 style={{float: "left", fontSize: "16px", fontWeight: "bold", color: "#333333", paddingBottom: "10px"}}>Choose card</h5>
              {this.state.paymentCard.map((card, idx) => (
                <SmallCardPaymentSubscribe
                  key={idx}
                  type={card.type}
                  title={card.title}
                  expireDate={card.expireDate}
                  image={card.image}
                  changeCard={this.changeCard}
                />
              ))}
              <h5 style={{float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>+ Add new card</h5>
            </div>
            <div className="content-center block-content-class button-text-group-class" style={{marginBottom: "40px"}}>
              <Button className="center" onClick={() => this.handleSubscribe(item.id, item.sub_plan_fee)}>Subscribe</Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}