import React from "react";
import { Button, Modal, ModalBody, ModalHeader, FormInput } from "shards-react";
import "../../assets/landingpage.css"

import Facebook from '../../images/Facebook.svg'
import Google from '../../images/Google.svg'
import Close from '../../images/Close.svg'

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();
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
                // onChange={() => {}}
                autoComplete="email"
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Email</label>
              <FormInput
                type="email"
                placeholder="youremail@gmail.com"
                // onChange={() => {}}
                autoComplete="email"
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Create password</label>
              <FormInput
                type="password"
                placeholder="XXXXXXXX"
                // onChange={() => {}}
                autoComplete="password"
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Confirm password</label>
              <FormInput
                type="password"
                placeholder="XXXXXXXX"
                // onChange={() => {}}
                autoComplete="password"
              />
            </div>
            <div className="content-center block-content-class button-text-group-class">
              <Button>Sign up</Button>
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