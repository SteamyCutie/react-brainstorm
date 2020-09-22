import React from "react";
import { Modal } from "shards-react";
import "../../assets/landingpage.css"
import Loader from 'react-loader-spinner';
export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} className="modal-class custom" backdrop={true} backdropClassName="backdrop-class">
          <Loader type="ThreeDots" color="#04B5FA" height="100" width="100" style={{position: 'fixed', zIndex: '9600', left: '50%', top: '50%'}}/>
        </Modal>
      </div>
    );
  }
}