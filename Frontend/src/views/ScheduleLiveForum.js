import React from "react";
import { Container, Row, Col, Button, Card, CardBody, CardHeader } from "shards-react";
import SmallCardForum from "../components/common/SmallCardForum";
import CreateLiveForum from "../components/common/CreateLiveForum";
import EditLiveForum from "../components/common/EditLiveForum";
import ConfirmModal from "../components/common/ConfirmModal";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { getforums } from "../api/api";

export default class ScheduleLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      loading: false,
      forumInfos: [],
      ModalOpen: false,
      ModalEditOpen: false,
      ModalConfirmOpen: false
    };
  }

  componentDidMount() {
    this.getForums();  
  }

  toggle_createliveforum() {
    this.setState({
      ModalOpen: !this.state.ModalOpen
    });
  }

  toggle_createsuccess(text) {
    this.showSuccess(text);
  }

  toggle_createfail(text) {
    this.showFail(text);
  }

  toggle_editsuccess(text) {
    this.showSuccess(text);
  }

  toggle_editfail(text) {
    this.showFail(text);
  }

  toggle_editliveforum(id) {
    if (id) {
      this.setState({
        ModalEditOpen: !this.state.ModalEditOpen,
        id: id
      });
    }
    else {
      this.setState({
        ModalEditOpen: !this.state.ModalEditOpen,
      });
    }
  }

  toggle_confirm(id) {
    this.setState({
      ModalConfirmOpen: !this.state.ModalConfirmOpen,
      id: id
    });
  }

  getForums = async() => {
    try {
      this.setState({loading: true});
      const result = await getforums({email: localStorage.getItem('email')});
      if (result.data.result === "success") {
        this.setState({forumInfos: result.data.data});
      } else {
        this.showFail(result.data.message);
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
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
      }
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

  removeSession() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('user-type');
    localStorage.removeItem('ws');
  }

  render() {
    const { ModalOpen, ModalEditOpen, ModalConfirmOpen, loading, forumInfos, id } = this.state;
    return (
      <div>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <CreateLiveForum open={ModalOpen} toggle={() => this.toggle_createliveforum()} toggle_createsuccess={(text) => this.toggle_createsuccess(text)} toggle_createfail={(text) => this.toggle_createfail(text)}></CreateLiveForum>
        <EditLiveForum open={ModalEditOpen} id={id} toggle={() => this.toggle_editliveforum()} toggle_editsucess={(text) => this.toggle_editsucess(text)} toggle_editfail={(text) => this.toggle_editfail(text)}></EditLiveForum>
        <ConfirmModal open={ModalConfirmOpen} id={id} toggle={() => this.toggle_confirm()}></ConfirmModal>
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <Card small className="schedule-forum-card">
            <CardHeader className="live-forum-header">
              <h5 className="live-forum-header-title no-margin">Schedule live forum</h5>
              {localStorage.getItem('is_mentor') == 1 && <Button className="live-forum-header-button" onClick={() => this.toggle_createliveforum()}>Create live forum</Button>}
            </CardHeader>
            <CardBody>
              <Row>
                {forumInfos.map((item, idx) => 
                  <Col key={idx} xl="4" lg="4" sm="6">
                    <SmallCardForum key={idx} item={item} toggle_editliveforum={(id) => this.toggle_editliveforum(id)} toggle_confirm={(id) => this.toggle_confirm(id)}/>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>    
        </Container>
      </div>
    )
  }
};