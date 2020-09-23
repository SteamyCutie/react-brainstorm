import React from "react";
import { Modal, ModalBody, Button, FormInput, Col, Row } from "shards-react";
import LoadingModal from "./LoadingModal";
import { addpayment } from '../../api/api';
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
    const { name, number, date, code } = this.state;
    const { toggle_success, toggle_fail, toggle_warning} = this.props;
    let param = {
      name: name,
      number: number,
      date: date,
      code: code
    }
    console.log(param);
    try {
      this.setState({loading: true});
      const result = await addpayment(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
        });
        toggle_success("Add Payment Success");
      } else if (result.data.result === "warning") {
        toggle_warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else {
          toggle_fail(result.data.message);
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