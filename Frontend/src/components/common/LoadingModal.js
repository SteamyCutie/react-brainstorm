import React from "react";
import { Button, Modal, ModalBody, FormInput } from "shards-react";
import "../../assets/landingpage.css"
import { Link } from "react-router-dom";
import { signin } from '../../api/api';
import Loader from 'react-loader-spinner';

import Facebook from '../../images/Facebook.svg'
import Google from '../../images/Google.svg'
import Close from '../../images/Close.svg'

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // document.getElementById("email-input").focus();
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} className="modal-class custom" backdrop={true} backdropClassName="backdrop-class">
          {/* <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} placeholder="Close Image" /></Button> */}
          {/* <ModalBody className="modal-content-class"> */}
            <Loader type="ThreeDots" color="#04B5FA" height="100" width="100" style={{position: 'fixed', zIndex: '1', left: '50%', top: '50%'}}/>
          {/* </ModalBody> */}
        </Modal>
      </div>
    );
  }
}