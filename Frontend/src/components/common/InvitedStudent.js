import React from "react";
import { Modal, ModalBody, ModalFooter, Button, Col, Row } from "shards-react";
import LoadingModal from "./LoadingModal";
import Close from '../../images/Close.svg'
import Recycle from '../../images/Recycle.svg'
import avatar2 from "../../images/avatar.jpg"
import { deleteinviteduser, signout } from '../../api/api';
import { ToastsStore } from 'react-toasts';

export default class InvitedStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cardinfo: {
        name: '',
        number: '',
        date: '',
        code: ''
      },
      requiremessage: {
        dname: '',
        dnumber: '',
        ddate: '',
        dcode: ''
      },
    };
  }

  componentWillMount() {
  }

  toggle() {
    const { toggle } = this.props;
    toggle();
  }

  actionSave = async () => {
    const { toggle } = this.props;
    toggle();
  }

  actionRemove = async (session_id, student_id) => {
    const param = {
      session_id: session_id,
      student_id: student_id
    };
    try {
      this.setState({ loading: true });
      const result = await deleteinviteduser(param);
      if (result.data.result === "success") {
        ToastsStore.success("Remove invited user success");
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  toggle_invitemore(id) {
    const { toggle_invitemore } = this.props;
    toggle_invitemore(id);
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
    this.props.histhory.push('/');
  }

  render() {
    const { open, students, id } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <Modal size="md" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Invited students</h1>
            <Row form>
              <label onClick={() => this.toggle_invitemore(id)}><h5 style={{ float: "right", fontSize: "16px", fontWeight: "bold", color: "#04B5FA" }}>+ Invite more students</h5></label>
            </Row>
            {students.map((item, idx) => (
              <Row form>
                <Col md="8" className="modal-input-group-class" key={idx}>
                  <div className="items-container">
                    <div className="no-padding">
                      <img src={avatar2} className="invited-student-logo" alt="card" />
                    </div>
                    <div className="nvited-student-desc">
                      <h4 className="small-card-payment-title no-margin">{item.name}</h4>
                      <h6 className="invited-student-desc-desc no-margin">{item.description}</h6>
                    </div>
                  </div>
                </Col>
                <Col md="2" className="modal-input-group-class" key={idx}>
                  <div className="content-center block-content-class button-text-group-class">
                    <Button style={{ marginBottom: 10 }} className="btn-mentor-detail-book" onClick={() => this.actionRemove(id, item.id)}>
                      <img src={Recycle} alt="Clock" />
                    Remove
                  </Button>
                  </div>
                </Col>
              </Row>
            ))}
          </ModalBody>
          <ModalFooter>
            <div className="content-center block-content-class button-text-group-class-mentor">
              <Button onClick={() => this.actionSave()}>Save</Button>
            </div>
          </ModalFooter>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}