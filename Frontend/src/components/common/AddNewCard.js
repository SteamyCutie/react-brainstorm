import React from "react";
import { Modal, ModalBody, Button, FormInput, Col, Row } from "shards-react";
import LoadingModal from "./LoadingModal";
import { createpayment } from '../../api/api';
import Close from '../../images/Close.svg'

export default class AddNewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cvc: '',
      expiry: '',
      focus: '',
      name: '',
      number: '',
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
    if (array.length > 20) {
      return;
    }
    const {cardinfo} = this.state;
    let temp = cardinfo;
    temp.number = e.target.value;
    this.setState({cardinfo: temp});
  }

  onChangeDate = (e) => {
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
    const { cardinfo, requiremessage } = this.state;
    const { toggle_success, toggle_fail, toggle_warning} = this.props;

    let temp = requiremessage;
    temp.dname = '';
    temp.dnumber = '';
    temp.ddate = '';
    temp.dcode = '';
    let param = {
      user_id: localStorage.getItem('user_id'),
      card_name: cardinfo.name,
      card_number: cardinfo.number,
      card_expiration: cardinfo.date,
      cvc_code: cardinfo.code
    }
    try {
      this.setState({loading: true});
      const result = await createpayment(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
        });
        toggle_success("Add Payment Success");
        window.location.href = "/studentWallet";
      } else if (result.data.result === "warning") {
        toggle_warning(result.data.message);
      } else {
        if (result.data.type === "require") {
          const {requiremessage} = this.state;
          let temp = requiremessage;
          if (result.data.message.card_name) {
            temp.dname = result.data.message.card_name[0];
          }
          if (result.data.message.card_number) {
            temp.dnumber = result.data.message.card_number[0];
          }
          if (result.data.message.cvc_code) {
            temp.dcode = result.data.message.cvc_code[0];
          }
          if (result.data.message.card_expiration) {
            temp.ddate = result.data.message.card_expiration[0];
          }
          
          this.setState({
            requiremessage: temp
          });
        } else {
          if (result.data.message === "Token is Expired") {
            toggle_fail(result.data.message);
            this.removeSession();
            window.location.href = "/";
          } else if (result.data.message === "Token is Invaild") {
            toggle_fail(result.data.message);
            this.removeSession();
            window.location.href = "/";
          } else if (result.data.message === "Authorization Token not found") {
            toggle_fail(result.data.message);
            this.removeSession();
            window.location.href = "/";
          } else {
            toggle_fail(result.data.message);
          }
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      toggle_fail("Something Went wrong");
    }; 
  }

  removeSession() {
    localStorage.clear();
  }

  handleInputFocus = (e) => {
    this.setState({ focus: e.target.name });
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  }

  render() {
    const { open } = this.props;
    const { cardinfo, requiremessage, loading } = this.state;
    return (
      <div>
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
            {requiremessage.dnumber !== '' && <FormInput id="cardnumber" className="profile-detail-input" placeholder="1234 5678 2472 8394" invalid onChange={(e) => this.onChangeNumber(e)} value={cardinfo.number}/>}
            {requiremessage.dnumber === '' && <FormInput id="cardnumber" className="profile-detail-input" placeholder="1234 5678 2472 8394" onChange={(e) => this.onChangeNumber(e)} value={cardinfo.number}/>}
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