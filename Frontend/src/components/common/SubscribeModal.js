import React from "react";
import { Button, Modal, ModalBody } from "shards-react";
import "../../assets/landingpage.css"
import SmallCardPaymentSubscribe from "../common/SmallCardPaymentSubscribe"
import LoadingModal from "./LoadingModal";
import { subscribe, signout, getusercards } from '../../api/api';
import Close from '../../images/Close.svg';
import { ToastsStore } from 'react-toasts';

export default class SubscribeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      paymentCard: [],
      id: ''
    }
  }

  componentWillMount() {
    this.getUserCards();
  }

  getUserCards = async () => {
    let param = {
      user_id: localStorage.getItem('user_id')
    }
    try {
      this.setState({ loading: true });
      const result = await getusercards(param);
      if (result.data.result === "success") {
        let param = {
          card_type: 1,
          is_primary: 1,
          card_name: '',
          expired_date: '',
          image: '',
          id: ''
        }

        let params = [];
        for (var i = 0; i < result.data.data.length; i++) {
          param.card_type = result.data.data[i].card_type;
          param.card_name = result.data.data[i].card_name;
          param.is_primary = result.data.data[i].is_primary;
          param.expired_date = result.data.data[i].expired_date;
          param.id = result.data.data[i].id;
          if (param.card_type === 4) {
            param.image = require("../../images/VisaCard-logo.png");
          } else if (param.card_type === 5) {
            param.image = require("../../images/Mastercard-logo.png");
          } else if (param.card_type === 3) {
            param.image = require("../../images/Travelcard-logo.jpg");
          } else if (param.card_type === 6) {
            param.image = require("../../images/Discovercard-logo.jpg");
          } else {
            param.image = require("../../images/Wrongcard-logo.jpg");
          }
          params.push(param);
          param = {};
        }
        this.setState({
          loading: false,
          paymentCard: params
        });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  toggle() {
    const { toggle } = this.props;
    toggle();
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();
  }

  handleSubscribe = async (mentor_id, sub_plan_fee) => {
    let param = {
      email: localStorage.getItem('email'),
      mentor_id: mentor_id,
      sub_plan_fee: sub_plan_fee,
      // card_type: 'visa',
      payment_id: this.state.id
    }
    if (param.payment_id === null || param.payment_id === undefined || param.payment_id === "") {
      ToastsStore.warning("Please add or select card");
      return;
    } else {
      try {
        this.setState({ loading: true });
        const result = await subscribe(param);
        if (result.data.result === "success") {
          ToastsStore.success("Subscribe Success");
          this.props.actionSuccess();
          this.toggle();
        } else if (result.data.result === "warning") {
          ToastsStore.warning(result.data.message);
        } else {
          if (result.data.message === "Token is Expired") {
            ToastsStore.error(result.data.message);
            this.signout();
          } else if (result.data.message === "Token is Invalid") {
            ToastsStore.error(result.data.message);
            this.signout();
          } else if (result.data.message === "Authorization Token not found") {
            ToastsStore.error(result.data.message);
            this.signout();
          } else {
            ToastsStore.error(result.data.message);
          }
        }
        this.setState({ loading: false });
      } catch (err) {
        this.setState({ loading: false });
        ToastsStore.error("Something Went wrong");
      };
    }
  }

  changeCard(payment_id) {
    this.setState({
      id: payment_id
    });
  }

  signout = async () => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        this.removeSession();
      } else if (result.data.result === "warning") {
        this.removeSession();
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
        } else if (result.data.message === "Token is Invalid") {
          this.removeSession();
        } else if (result.data.message === "Authorization Token not found") {
          this.removeSession();
        } else {
          this.removeSession();
        }
      }
    } catch (error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
  }

  render() {
    const { open, item } = this.props;
    const { loading, paymentCard } = this.state;
    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="subscribe-modal">
            <h1 className="content-center modal-header-class">Subscribe mentor {item.name}</h1>
            <div style={{ width: "100%" }}>
              <h5 style={{ float: "left", fontSize: "16px", fontWeight: "bold", color: "#04B5FA" }}>Monthly subscription</h5>
              <h5 style={{ float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA" }}>${item.sub_plan_fee}</h5>
            </div>
            <div className="subscribe-card-container">
              <h5 style={{ float: "left", fontSize: "16px", fontWeight: "bold", color: "#333333", paddingBottom: "10px" }}>Choose card</h5>
              {paymentCard.map((card, idx) => (
                <SmallCardPaymentSubscribe
                  key={idx}
                  type={card.card_type}
                  title={card.card_name}
                  expireDate={card.expired_date}
                  image={card.image}
                  payment_id={card.id}
                  changeCard={(payment_id) => this.changeCard(payment_id)}
                  is_primary={card.is_primary}
                />
              ))}
              { /* eslint-disable-next-line */ }
              <a href="javascript:void(0)" onClick={() => this.toggle_modal()}><h5 style={{ float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA" }}>+ Add new card</h5></a>
            </div>
            <div className="content-center block-content-class button-text-group-class" style={{ marginBottom: "40px" }}>
              <Button className="center" onClick={() => this.handleSubscribe(item.id, item.sub_plan_fee)}>Subscribe</Button>
            </div>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}