import React from "react";
import { Button, Modal, ModalBody } from "shards-react";
import "../../assets/landingpage.css"
import SmallCardPaymentSubscribe from "../common/SmallCardPaymentSubscribe"
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import LoadingModal from "./LoadingModal";
import { store } from 'react-notifications-component';

import { subscribe } from '../../api/api';
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
      card_type: 'visa'
    }
    try {
      this.setState({loading: true});
      const result = await subscribe(param);
      if (result.data.result === "success") {
        this.showSuccess("Subscribe Success");
        this.props.actionSuccess();
        this.toggle();
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
          this.removeSession();
          window.location.href = "/";
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

  changeCard(type) {
  }

  removeSession() {
    localStorage.clear();
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
    const { open, item } = this.props;
    const { loading, paymentCard } = this.state;
    return (
      <div>
        <ReactNotification />
        <Modal open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close"/></Button>
          <ModalBody className="subscribe-modal">
            <h1 className="content-center modal-header-class">Subscribe mentor {item.name}</h1>
            <div style={{width: "100%"}}>
              <h5 style={{float: "left", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>Monthly subscription</h5>
              <h5 style={{float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>${item.sub_plan_fee}</h5>
            </div>
            <div className="subscribe-card-container">
            <h5 style={{float: "left", fontSize: "16px", fontWeight: "bold", color: "#333333", paddingBottom: "10px"}}>Choose card</h5>
              {paymentCard.map((card, idx) => (
                <SmallCardPaymentSubscribe
                  key={idx}
                  type={card.type}
                  title={card.title}
                  expireDate={card.expireDate}
                  image={card.image}
                  changeCard={this.changeCard}
                />
              ))}
              <a href="#!" onClick={() => this.toggle_modal()}><h5 style={{float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA"}}>+ Add new card</h5></a>
            </div>
            <div className="content-center block-content-class button-text-group-class" style={{marginBottom: "40px"}}>
              <Button className="center" onClick={() => this.handleSubscribe(item.id, item.sub_plan_fee)}>Subscribe</Button>
            </div>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}