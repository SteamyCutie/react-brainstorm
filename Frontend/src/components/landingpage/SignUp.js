import React from "react";
import { Button, Modal, ModalBody, FormInput } from "shards-react";
import "../../assets/landingpage.css"
import { signup } from '../../api/api';

import Facebook from '../../images/Facebook.svg'
import Google from '../../images/Google.svg'
import Close from '../../images/Close.svg'

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: "", email: "", password: "", confirmpassword: ""};
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
    this.setState({name: e.target.value});
  }

  onChangeEmail = (e) => {
    this.setState({email: e.target.value});
  }

  onChangePassword = (e) => {
    this.setState({password: e.target.value});
  }

  onChangeConfirmPassword = (e) => {
    this.setState({confirmpassword: e.target.value});
  }

  actionSignup = async() => {
    try {
      const result = await signup(this.state);
      if (result.data.result == "success") {
        localStorage.setItem('email', result.data.data.email);
        window.location.href = '/profile';
      } else {
        alert("Failed");
      }
    } catch(err) {
      alert(err);
    };
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} placeholder="Close Image" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Sign up</h1>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Full name</label>
              <FormInput
                type="text"
                placeholder="Alfredo Aminoff"
                onChange={(e) => this.onChangeName(e)}
                autoComplete="email"
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Email</label>
              <FormInput
                type="email"
                placeholder="youremail@gmail.com"
                onChange={(e) => this.onChangeEmail(e)}
                autoComplete="email"
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Create password</label>
              <FormInput
                type="password"
                placeholder="XXXXXXXX"
                onChange={(e) => this.onChangePassword(e)}
                autoComplete="password"
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Confirm password</label>
              <FormInput
                type="password"
                placeholder="XXXXXXXX"
                onChange={(e) => this.onChangeConfirmPassword(e)}
                autoComplete="password"
              />
            </div>
            <div className="content-center block-content-class button-text-group-class">
              <Button onClick={() => this.actionSignup()}>Sign up</Button>
              <p>Already have an account?&nbsp;<a href="#" onClick={() => this.toggle_modal()}>Sign in</a></p>
            </div>
            <div className="content-center seperation-line-class">
              <hr />
              or
              <hr />
            </div>
            <div className="content-center">
              <Button className="sign-with-facebook"><img src={Facebook} placeholder="Facebook Image" />Sign In with Facebook</Button>
            </div>
            <div className="content-center">
              <Button className="sign-with-google"><img src={Google} placeholder="Google Image" />Sign In with Google</Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}