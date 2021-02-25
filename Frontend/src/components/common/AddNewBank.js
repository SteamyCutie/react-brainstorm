import React from "react";
import { Modal, ModalBody, Button, FormSelect } from "shards-react";
import Cleave from 'cleave.js/react';
import LoadingModal from "./LoadingModal";
import { registerbankbymentor, signout } from '../../api/api';
import Close from '../../images/Close.svg'

export default class AddNewBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      number: '',
      ifsc: '',
      swift: '',
      loading: false,
      bankinfo: {
        name: '',
        number: '',
        ifsc: '',
        swift: ''
      },
      requiremessage: {
        dname: '',
        dnumber: '',
        difsc: '',
        dswift: ''
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
    let {bankinfo} = this.state;
    bankinfo.name = e.target.value;
    this.setState({bankinfo});
  }

  onChangeNumber = (e) => {
    let {bankinfo} = this.state;
    bankinfo.number = e.target.value;
    this.setState({bankinfo});
  }

  onChangeIFSC = (e) => {
    let {bankinfo} = this.state;
    bankinfo.ifsc = e.target.value;
    this.setState({bankinfo});
  }

  onChangeSWIFT = (e) => {
    let {bankinfo} = this.state;
    bankinfo.swift = e.target.value;
    this.setState({bankinfo});
  }

  actionAdd = async() => {
    let { bankinfo, requiremessage } = this.state;
    const { toggle_success, toggle_fail, toggle_warning} = this.props;

    requiremessage.dname = '';
    requiremessage.dnumber = '';
    requiremessage.difsc = '';
    requiremessage.dswift = '';
    let param = {
      user_id: localStorage.getItem('user_id'),
      bank_name: bankinfo.name,
      bank_number: bankinfo.number,
      bank_ifsc: bankinfo.ifsc,
      bank_swift: bankinfo.swift
    }
    try {
      this.setState({loading: true});
      const result = await registerbankbymentor(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
        });
        toggle_success("Add Payment Success");
        this.props.history.push('/mentorWallet');
      } else if (result.data.result === "warning") {
        toggle_warning(result.data.message);
      } else {
        if (result.data.type === "require") {
          let {requiremessage} = this.state;
          if (result.data.message.card_name) {
            requiremessage.dname = result.data.message.card_name[0];
          }
          if (result.data.message.card_number) {
            requiremessage.dnumber = result.data.message.card_number[0];
          }
          if (result.data.message.cvc_code) {
            temp.dcode = result.data.message.cvc_code[0];
          }
          if (result.data.message.card_expiration) {
            requiremessage.ddate = result.data.message.card_expiration[0];
          }
          
          this.setState({
            requiremessage
          });
        } else {
          if (result.data.message === "Token is Expired") {
            toggle_fail(result.data.message);
            this.signout();
          } else if (result.data.message === "Token is Invaild") {
            toggle_fail(result.data.message);
            this.signout();
          } else if (result.data.message === "Authorization Token not found") {
            toggle_fail(result.data.message);
            this.signout();
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

  signout = async() => {
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
    } catch(error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
    //this.props.history.push('/');
  }

  render() {
    const { open } = this.props;
    const { bankinfo, requiremessage, loading } = this.state;
    return (
      <div>
        <Modal size="md" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Add payment method</h1>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmailAddress" className="profile-detail-important">Bank Name</label>
            {requiremessage.dexpertise !== '' && <span className="require-message">{requiremessage.dexpertise}</span>}
            <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeName(e)}>
              {/* {expertise.map((item, idx) =>
                item.value === param.expertise ? <option key={idx} value={item.value} selected>{item.name}</option> : <option key={idx} value={item.value}>{item.name}</option>
              )} */}
            </FormSelect>
            {/* {requiremessage.dname !== '' && <span className="require-message">{requiremessage.dname}</span>}
            {requiremessage.dname !== '' && <FormInput className="profile-detail-input" placeholder="Cardholder name" autoFocus="1" invalid onChange={(e) => this.onChangeName(e)} value={bankinfo.name}/>}
            {requiremessage.dname === '' && <FormInput className="profile-detail-input" placeholder="Cardholder name" autoFocus="1" onChange={(e) => this.onChangeName(e)} value={bankinfo.name}/>} */}
          </div>

          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmailAddress" className="profile-detail-important">Account number</label>
            {requiremessage.dnumber !== '' && <span className="require-message">{requiremessage.dnumber}</span>}
            {requiremessage.dnumber !== '' && <Cleave placeholder="1234 5678 2472 8394" className="profile-detail-input form-control is-invalid" onChange={(e) => this.onChangeNumber(e)} value={bankinfo.number}/>}
            {requiremessage.dnumber === '' && <Cleave placeholder="1234 5678 2472 8394" className="profile-detail-input form-control" onChange={(e) => this.onChangeNumber(e)} value={bankinfo.number}/>}
          </div>

          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmailAddress" className="profile-detail-important">IFSC Code</label>
            {requiremessage.difsc !== '' && <span className="require-message">{requiremessage.difsc}</span>}
            {requiremessage.difsc !== '' && <Cleave placeholder="1234 5678 2472 8394" className="profile-detail-input form-control is-invalid" onChange={(e) => this.onChangeIFSC(e)} value={bankinfo.ifsc}/>}
            {requiremessage.difsc === '' && <Cleave placeholder="1234 5678 2472 8394" className="profile-detail-input form-control" onChange={(e) => this.onChangeIFSC(e)} value={bankinfo.ifsc}/>}
          </div>

          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmailAddress" className="profile-detail-important">SWIFT Code</label>
            {requiremessage.dswift !== '' && <span className="require-message">{requiremessage.dswift}</span>}
            {requiremessage.dswift !== '' && <Cleave placeholder="1234 5678 2472 8394" className="profile-detail-input form-control is-invalid" onChange={(e) => this.onChangeSWIFT(e)} value={bankinfo.swift}/>}
            {requiremessage.dswift === '' && <Cleave placeholder="1234 5678 2472 8394" className="profile-detail-input form-control" onChange={(e) => this.onChangeSWIFT(e)} value={bankinfo.swift}/>}
          </div>
          
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