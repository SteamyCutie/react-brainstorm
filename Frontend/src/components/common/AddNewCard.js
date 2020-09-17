import React from "react";
import { Modal, ModalBody, Button, FormInput, Col, Row } from "shards-react";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import LoadingModal from "./LoadingModal";
import { store } from 'react-notifications-component';
import { createforum, gettags } from '../../api/api';

import Close from '../../images/Close.svg'

export default class AddNewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cardinfo: {
        name: '',
        number: '',
        date: '',
        code: ''
      },
      requiremessage: {
        dname: '',
        dnumber: '',
        ddate: '',
        dcode: ''
      },
    };
  }

  componentWillMount() {
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();
  }

  onChangeName = (e) => {
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
    const {cardinfo} = this.state;
    let temp = cardinfo;
    temp.name = e.target.value;
    this.setState({cardinfo: temp});
  }

  onChangeNumber = (e) => {
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
    const {cardinfo} = this.state;
    let temp = cardinfo;
    temp.number = e.target.value;
    this.setState({cardinfo: temp});
  }

  onChangedate = (e) => {
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
    const {cardinfo} = this.state;
    let temp = cardinfo;
    temp.date = e.target.value;
    this.setState({cardinfo: temp});
  }

  onChangeCode = (e) => {
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
    const {cardinfo} = this.state;
    let temp = cardinfo;
    temp.code = e.target.value;
    this.setState({cardinfo: temp});
  }

  actionAdd = async() => {
    const {cardinfo} = this.state;
    // const {requiremessage} = this.state;
    // let temp = requiremessage;
    // temp.dreview = '';
    // this.setState({
    //   requiremessage: temp
    // });
    // try {
    //   this.setState({loading: true});
    //   const result = await createforum(this.state.foruminfo);
    //   if (result.data.result === "success") {
    //     this.toggle();
    //     this.showSuccess("Review Success");
    //     window.location.href = "/scheduleLiveForum";
    //   } else {
    //     if (result.data.type === 'require') {
    //       const {requiremessage} = this.state;
    //       let temp = requiremessage;
    //       if (result.data.message.title) {
    //         temp.dtitle = result.data.message.title[0];
    //       }
    //       if (result.data.message.description) {
    //         temp.ddescription = result.data.message.description[0];
    //       }
    //       this.setState({
    //         requiremessage: temp
    //       });
    //     } else {
    //       if (result.data.message === "Token is Expired") {
    //         this.removeSession();
    //         window.location.href = "/";
    //       }
    //     }
    //   }
    //   this.setState({loading: false});
    // } catch(err) {
    //   this.setState({loading: false});
    //   this.showFail("Something Went wrong");
    // };
  }

  removeSession() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('user-type');
    localStorage.removeItem('ws');
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

  render() {
    const { open } = this.props;
    const { cardinfo, requiremessage, loading } = this.state;
    return (
      <div>
        <ReactNotification />
        <Modal size="md" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Add new card</h1>

          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmailAddress" className="profile-detail-important">Cardholder name</label>
            {requiremessage.dname !== '' && <span className="require-message">{requiremessage.dname}</span>}
            {requiremessage.dname !== '' && <FormInput className="profile-detail-input" placeholder="Cardholder name" autoFocus="1" invalid onChange={(e) => this.onChangeName(e)} value={cardinfo.name}/>}
            {requiremessage.dname === '' && <FormInput className="profile-detail-input" placeholder="Cardholder name" autoFocus="1" onChange={(e) => this.onChangeName(e)} value={cardinfo.name}/>}
          </div>

          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmailAddress" className="profile-detail-important">Credit or debit card number</label>
            {requiremessage.dnumber !== '' && <span className="require-message">{requiremessage.dnumber}</span>}
            {requiremessage.dnumber !== '' && <FormInput className="profile-detail-input" placeholder="1234 5678 2472 8394" invalid onChange={(e) => this.onChangeNumber(e)} value={cardinfo.number}/>}
            {requiremessage.dnumber === '' && <FormInput className="profile-detail-input" placeholder="1234 5678 2472 8394" onChange={(e) => this.onChangeNumber(e)} value={cardinfo.number}/>}
          </div>
          <Row form>
            <Col md="6" className="modal-input-group-class">
              <label htmlFor="feEmailAddress" className="profile-detail-important">Expiration date</label>
              {requiremessage.ddate !== '' && <span className="require-message">{requiremessage.ddate}</span>}
              {requiremessage.ddate !== '' && <FormInput className="profile-detail-input" placeholder="MM/YY" invalid onChange={(e) => this.onChangeDate(e)} value={cardinfo.date}/>}
              {requiremessage.ddate === '' && <FormInput className="profile-detail-input" placeholder="MM/YY" onChange={(e) => this.onChangeDate(e)} value={cardinfo.date}/>}
            </Col>

            <Col md="6" className="modal-input-group-class">
              <label htmlFor="feEmailAddress" className="profile-detail-important">CVC code</label>
              {requiremessage.dcode !== '' && <span className="require-message">{requiremessage.dcode}</span>}
              {requiremessage.dcode !== '' && <FormInput className="profile-detail-input" placeholder="123" invalid onChange={(e) => this.onChangeCode(e)} value={cardinfo.code}/>}
              {requiremessage.dcode === '' && <FormInput className="profile-detail-input" placeholder="123" onChange={(e) => this.onChangeCode(e)} value={cardinfo.code}/>}
            </Col>
          </Row>
          <div className="content-center block-content-class button-text-group-class">
            <Button onClick={() => this.actionAdd()}>Add</Button>
          </div>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}