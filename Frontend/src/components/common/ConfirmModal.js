import React from "react";
import { Modal, ModalBody, ModalFooter, Button, Col, Row, ModalHeader } from "shards-react";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import LoadingModal from "./LoadingModal";
import { store } from 'react-notifications-component';
import { deleteforum, signout } from '../../api/api';

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
            this.showFail(result.data.message);
            this.signout();
          } else if (result.data.message === "Token is Invalid") {
            this.showFail(result.data.message);
            this.signout();
          } else if (result.data.message === "Authorization Token not found") {
            this.showFail(result.data.message);
            this.signout();
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

  signout = async() => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        this.removeSession();
      } else if (result.data.result === "warning") {

      } else {
        if (result.data.message === "Token is Expired") {
          
        } else if (result.data.message === "Token is Invalid") {
          
        } else if (result.data.message === "Authorization Token not found") {
          
        } else {
        }
      }
    } catch(error) {

    }
  }

  removeSession() {
    localStorage.clear();
    window.location.href = "/";
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
          <ModalHeader>Delete Forum</ModalHeader>
          <ModalBody>
          </ModalBody>
          <ModalFooter>
            <Row form>
              <Col md="6" className="project-detail-input-group">
                <Button outline size="lg" onClick={() => this.toggle()}>Cancel</Button>
              </Col>
              <Col md="6" className="project-detail-input-group">
                <Button size="lg" theme="danger" onClick={() => this.actionRemove(id)}>Remove</Button>
              </Col>
            </Row>
          </ModalFooter>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}