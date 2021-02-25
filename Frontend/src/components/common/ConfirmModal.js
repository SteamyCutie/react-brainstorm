import React from "react";
import { Modal, ModalBody, ModalFooter, Button, Col, Row, ModalHeader } from "shards-react";
import LoadingModal from "./LoadingModal";
import { signout } from '../../api/api';
import Close from '../../images/Close.svg';
import { ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';

class AddNewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      id: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && this.props.id !== nextProps.id) {
      this.setState({ id: nextProps.id });
    }
  }

  toggle() {
    const { toggle } = this.props;
    toggle();
  }

  toggle_remove() {
    const { toggle_remove } = this.props;
    toggle_remove();
  }

  signout = async () => {
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
    } catch (error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
  }

  render() {
    const { open } = this.props;
    const { loading, id } = this.state;
    const { toggle_remove } = this.props
    return (
      <div>
        <Modal size="md" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalHeader>Delete Forum</ModalHeader>
          <ModalBody>
          </ModalBody>
          <ModalFooter>
            <Row form>
              <Col md="6" className="project-detail-input-group">
                <Button outline size="lg" onClick={() => this.toggle()}>Cancel</Button>
              </Col>
              <Col md="6" className="project-detail-input-group">
                <Button size="lg" theme="danger" onClick={() =>toggle_remove()}>Remove</Button>
              </Col>
            </Row>
          </ModalFooter>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}

export default withRouter(AddNewCard)