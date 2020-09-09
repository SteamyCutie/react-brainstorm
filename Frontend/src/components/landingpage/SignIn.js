import React from "react";
import { Button, Modal, ModalBody, FormInput } from "shards-react";
import "../../assets/landingpage.css"
import { Link } from "react-router-dom";
import { signin } from '../../api/api';

import Facebook from '../../images/Facebook.svg'
import Google from '../../images/Google.svg'
import Close from '../../images/Close.svg'

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email: "", password: ""};
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();
  }

  onChangeEmail = (e) => {
    this.setState({email: e.target.value});
  }

  onChangePassword = (e) => {
    this.setState({password: e.target.value});
  }

  actionSignin = async() => {
    try {
      const result = await signin(this.state);
      console.log(result, "+++");
      if (result.data.result == "success") {
        localStorage.setItem('email', result.data.data.email);
        window.location.href = '/mentorSession';
      } else {
        alert(result.data.message);
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
            <h1 className="content-center modal-header-class">Sign in</h1>
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
              <label htmlFor="fePassword">Password</label>
              <label htmlFor="feForgot" className="forgot-class">Forgot password?</label>
              <FormInput
                type="password"
                placeholder="XXXXXX"
                onChange={(e) => this.onChangePassword(e)}
                autoComplete="text"
              />
            </div>
            <div className="content-center block-content-class button-text-group-class">
              <Button onClick={() => this.actionSignin()}>Sign in</Button>
              <p>Don't have an account?&nbsp;<a href="#" onClick={() => this.toggle_modal()}>Sign up</a></p>
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