import React from "react";
import { Modal, ModalBody, Button, ModalFooter, Col, Row } from "shards-react";
import Cleave from 'cleave.js/react';
import LoadingModal from "./LoadingModal";
import { createpayment } from '../../api/api';
import Close from '../../images/Close.svg'
import BackIcon from "../../images/Back_icon.svg"
import NextIcon from "../../images/Next_icon.svg"

export default class BookSession extends React.Component {
  constructor(props) {
    super(props);
    let today = new Date();
    this.state = {
      date: today
    };
  }

  componentWillMount() {
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  checkLabel = () => {
    var first = this.state.date.getDate() - this.state.date.getDay();
    var last = first + 6;

    var firstday = new Date(this.state.date.setDate(first)).toUTCString();
    var lastday = new Date(this.state.date.setDate(last)).toUTCString();

    console.log(firstday, lastday);
    // let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // let dayName = days[this.state.date.getDay()];
    // let month = this.state.date.getMonth() + 1;
    // let monthName = month < 10 ? `0${month}` : month;
    // let date = this.state.date.getDate();
    // let dateName = date < 10 ? `0${date}` : date;
    // let totalName = `${dayName} ${monthName}/${dateName}`;
    let totalName = "111";
    return totalName;
  }

  goToBack() {
    let newDate = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth(),
      this.state.date.getDate() - 7);
    this.setState({
      date: newDate
    })
  }

  goToNext() {
    let newDate = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth(),
      this.state.date.getDate() + 7);
    this.setState({
      date: newDate
    })
  }

  actionBookSession = async() => {
    // const { cardinfo, requiremessage } = this.state;
    // const { toggle_success, toggle_fail, toggle_warning} = this.props;

    // let temp = requiremessage;
    // temp.dname = '';
    // temp.dnumber = '';
    // temp.ddate = '';
    // temp.dcode = '';
    // let param = {
    //   user_id: localStorage.getItem('user_id'),
    //   card_name: cardinfo.name,
    //   card_number: cardinfo.number,
    //   card_expiration: cardinfo.date,
    //   cvc_code: cardinfo.code
    // }
    // try {
    //   this.setState({loading: true});
    //   const result = await createpayment(param);
    //   if (result.data.result === "success") {
    //     this.setState({
    //       loading: false,
    //     });
    //     toggle_success("Add Payment Success");
    //     window.location.href = "/studentWallet";
    //   } else if (result.data.result === "warning") {
    //     toggle_warning(result.data.message);
    //   } else {
    //     if (result.data.type === "require") {
    //       const {requiremessage} = this.state;
    //       let temp = requiremessage;
    //       if (result.data.message.card_name) {
    //         temp.dname = result.data.message.card_name[0];
    //       }
    //       if (result.data.message.card_number) {
    //         temp.dnumber = result.data.message.card_number[0];
    //       }
    //       if (result.data.message.cvc_code) {
    //         temp.dcode = result.data.message.cvc_code[0];
    //       }
    //       if (result.data.message.card_expiration) {
    //         temp.ddate = result.data.message.card_expiration[0];
    //       }
          
    //       this.setState({
    //         requiremessage: temp
    //       });
    //     } else {
    //       if (result.data.message === "Token is Expired") {
    //         toggle_fail(result.data.message);
    //         this.removeSession();
    //         window.location.href = "/";
    //       } else if (result.data.message === "Token is Invaild") {
    //         toggle_fail(result.data.message);
    //         this.removeSession();
    //         window.location.href = "/";
    //       } else if (result.data.message === "Authorization Token not found") {
    //         toggle_fail(result.data.message);
    //         this.removeSession();
    //         window.location.href = "/";
    //       } else {
    //         toggle_fail(result.data.message);
    //       }
    //     }
    //   }
    //   this.setState({loading: false});
    // } catch(err) {
    //   this.setState({loading: false});
    //   toggle_fail("Something Went wrong");
    // }; 
  }

  removeSession() {
    localStorage.clear();
  }

  render() {
    const { open } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Book a session</h1>
            
            <div className="week-header" style={{display: 'inline'}}>
              {this.checkLabel()}
            </div>
            <Button onClick={() => this.goToBack()} className="back-icon-class">
              <img src={BackIcon} alt="BackIcon" />
            </Button>
            <Button onClick={() => this.goToNext()} className="next-icon-class">
              <img src={NextIcon} alt="NextIcon" />
            </Button>
            <Row>
              <Col className="week-style-header-available">
                <p>Fri</p>
                <button type="button" className="btn btn-primary today">11</button>
              </Col>
              <Col className="week-style-header-disable">
                <p>Sat</p>
                <button type="button" className="btn btn-primary not-today">11</button>
              </Col>
              <Col className="week-style-header-disable">
                <p>Sun</p>
                <button type="button" className="btn btn-primary today">11</button>
              </Col>
              <Col className="week-style-header-available">
                <p>Mon</p>
                <button type="button" className="btn btn-primary not-today">11</button>
              </Col>
              <Col className="week-style-header-available">
                <p>Tue</p>
                <button type="button" className="btn btn-primary not-today">11</button>
              </Col>
              <Col className="week-style-header-available">
                <p>Wed</p>
                <button type="button" className="btn btn-primary not-today">11</button>
              </Col>
              <Col className="week-style-header-disable">
                <p>Thu</p>
                <button type="button" className="btn btn-primary not-today">11</button>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="content-center block-content-class button-text-group-class">
              <Button onClick={() => this.actionBookSession()}>Book a session</Button>
            </div>
          </ModalFooter>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}