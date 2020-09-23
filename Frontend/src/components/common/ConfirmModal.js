import React from "react";
import { Modal, ModalBody, Button, Col, Row } from "shards-react";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import LoadingModal from "./LoadingModal";
import { store } from 'react-notifications-component';
import { deleteforum } from '../../api/api';

import Close from '../../images/Close.svg'

export default class AddNewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      id: 0
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && this.props.id !== nextProps.id) {
      this.setState({id: nextProps.id});
    }
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  actionRemove = async(id) => {
    const param = {id: id};
    try {
      this.setState({loading: true});
      const result = await deleteforum(param);
      if (result.data.result === "success") {
        this.toggle();
        this.showSuccess("Delete Schedule Success");
        window.location.href = "/scheduleLiveForum";
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
          if (result.data.message === "Token is Expired") {
            this.removeSession();
            window.location.href = "/";
          } else {
            this.showFail(result.data.message);      
          }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  removeSession() {
    localStorage.clear();
  }

  showSuccess(text) {
    store.addNotification({
      title: "Success",
      message: text,
      type: "success",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      },
    });
  }

  showFail(text) {
    store.addNotification({
      title: "Fail",
      message: text,
      type: "danger",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  showWarning(text) {
    store.addNotification({
      title: "Warning",
      message: text,
      type: "warning",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  render() {
    const { open} = this.props;
    const { loading, id } = this.state;
    return (
      <div>
        <ReactNotification />
        <Modal size="md" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Delete Forum</h1>
          <Row form>
            <Col md="6" className="project-detail-input-group">
              <Button outline size="lg" onClick={() => this.toggle()}>Cancel</Button>
            </Col>
            <Col md="6" className="project-detail-input-group">
              <Button size="lg" theme="danger" onClick={() => this.actionRemove(id)}>Remove</Button>
            </Col>
          </Row>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}