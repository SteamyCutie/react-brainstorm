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
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} className="modal-class custom" backdrop={true} backdropClassName="backdrop-class">
          <Loader type="ThreeDots" color="#04B5FA" height="100" width="100" style={{position: 'fixed', zIndex: '10', left: '50%', top: '50%'}}/>
        </Modal>
      </div>
    );
  }
}