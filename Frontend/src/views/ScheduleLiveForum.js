import React from "react";
import { Container, Row, Col, Button, Card, CardBody, CardHeader } from "shards-react";
import SmallCardForum from "../components/common/SmallCardForum";
import CreateLiveForum from "../components/common/CreateLiveForum";
import EditLiveForum from "../components/common/EditLiveForum";
import ConfirmModal from "../components/common/ConfirmModal";
import LoadingModal from "../components/common/LoadingModal";
import { deleteforum, gettags, getallstudents, getforums, getuserinfo, signout } from "../api/api";
import { ToastsStore } from 'react-toasts';
import moment from 'moment';
moment.locale('en');

export default class ScheduleLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      user: {},
      loading: false,
      forumInfos: [],
      ModalOpen: false,
      ModalEditOpen: false,
      ModalConfirmOpen: false,
      room: '',
      allStudents: [],
      allTags: [],
    };
  }

  componentWillMount() {
    this.getUserInfo();
    this.getForums();
    this.getAllTags();
    this.getAllStudents();
  }

  getAllTags = async () => {
    try {
      const result = await gettags();
      if (result.data.result === "success") {
        let param = {
          label: '',
          value: ''
        };

        let params = [];

        for (var i = 0; i < result.data.data.length; i++) {
          param.label = result.data.data[i].name;
          param.value = result.data.data[i].id;
          params.push(param);
          param = {};
        }
        this.setState({ allTags: params });
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
    } catch (err) {
      ToastsStore.error("Something went wrong.");
    }
  }

  getAllStudents = async () => {
    let param = {
      email: localStorage.getItem('email')
    }
    try {
      const result = await getallstudents(param);
      if (result.data.result === "success") {
        let param = {
          label: '',
          value: ''
        };

        let params = [];

        for (var i = 0; i < result.data.data.length; i++) {
          param.label = result.data.data[i].email;
          param.value = result.data.data[i].id;
          params.push(param);
          param = {};
        }
        this.setState({ allStudents: params });
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token in Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
    } catch (err) {
      ToastsStore.error("Something Went wrong");
    }
  }

  toggle_createliveforum() {
    this.setState({
      ModalOpen: !this.state.ModalOpen
    });
  }

  toggle_createsuccess(text) {
    this.getForums();
    ToastsStore.success(text);
  }

  toggle_createfail(text) {
    ToastsStore.error(text);
  }

  toggle_editsuccess(text) {
    this.getForums();
    ToastsStore.success(text);
  }

  toggle_createwarning(text) {
    ToastsStore.warning(text);
  }

  toggle_editfail(text) {
    ToastsStore.error(text);
  }

  handleEditForum(id) {
    if (id !== null) {
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
    // this.getForums();
  }

  handleDeleteForum(id) {
    this.setState({
      ModalConfirmOpen: !this.state.ModalConfirmOpen,
      id: id
    });
    
  }

  getForums = async () => {
    let param = {
      email: localStorage.getItem('email')
    }
    try {
      this.setState({ loading: true });
      const result = await getforums(param);
      if (result.data.result === "success") {
        let t_forumInfos = result.data.data;
        t_forumInfos.forEach(t_forumInfo => {
          t_forumInfo.from = moment(t_forumInfo.forum_start * 1000).format("YYYY-MM-DD h:mm:ss");
          t_forumInfo.to = moment(t_forumInfo.forum_end * 1000).format("YYYY-MM-DD h:mm:ss");
          t_forumInfo.day = moment(t_forumInfo.forum_start * 1000).format("DD/MM/YY");
          t_forumInfo.from_time = moment(t_forumInfo.forum_start * 1000).format("h:mm a");
          t_forumInfo.to_time = moment(t_forumInfo.forum_end * 1000).format("h:mm a");
        });              
        this.setState({ forumInfos: t_forumInfos });
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

  getUserInfo = async () => {
    try {
      const result = await getuserinfo({ email: localStorage.getItem('email') });
      if (result.data.result === "success") {
        this.setState({ user: result.data.data });
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
    } catch (err) {
      ToastsStore.error("Something Went wrong");
    };
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
    this.props.history.push('/');
  }

  handleCreateRoom() {
    // this.setWebsocket('wss://' + 'localhost:8443' + '/groupcall') // location.host
    this.register();
    window.open("/room-call");
  }

  handleJoinRoom() {
    window.open("/room-call");
  }

  onSelectRoomChange(e) {

  }

  startSession(id) {
    const { forumInfos } = this.state;
    var index = 0;
    var room_id = null;

    for (index = 0; index < forumInfos.length; index++) {
      if (forumInfos[index].id === id) {
        room_id = forumInfos[index].room_id;
        break;
      }
    }

    this.props.startSession(room_id);
  }

  toggle_remove = async () => {
    const param = { id: this.state.forumInfos[this.state.id] };
    try {
      this.setState({ loading: true });
      const result = await deleteforum(param);
      if (result.data.result === "success") {
        this.toggle_confirm();
        this.getForums();
        ToastsStore.success("Delete Schedule Success");
        this.props.history.push('/scheduleLiveForum');
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

  render() {
    const { ModalOpen, ModalEditOpen, ModalConfirmOpen, loading, forumInfos, id, user, allTags, allStudents } = this.state;

    return (
      <div>
        {loading && <LoadingModal open={true} />}
        <CreateLiveForum 
          open={ModalOpen} 
          toggle={() => this.toggle_createliveforum()} 
          allTags={allTags}
          allStudents={allStudents}
          toggle_createsuccess={(text) => this.toggle_createsuccess(text)} 
          toggle_createfail={(text) => this.toggle_createfail(text)} 
          toggle_createwarning={(text) => this.toggle_createwarning(text)}>
        </CreateLiveForum>
        <EditLiveForum 
          open={ModalEditOpen}
          id={id}
          allTags={allTags}
          allStudents={allStudents}
          forumInfo={id ? forumInfos[id] : null}
          toggle={() => this.handleEditForum()}
          toggle_editsuccess={(text) => this.toggle_editsuccess(text)}
          toggle_editfail={(text) => this.toggle_editfail(text)}>
        </EditLiveForum>
        <ConfirmModal open={ModalConfirmOpen} forumInfo={ forumInfos } toggle={() => this.toggle_confirm()} toggle_remove = {() => this.toggle_remove() }></ConfirmModal>
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <Card small className="schedule-forum-card">
            <CardHeader className="live-forum-header">
              <h5 className="live-forum-header-title no-margin">Schedule live forum</h5>
              {user.is_mentor === 1 ? <Button className="live-forum-header-button" onClick={() => this.toggle_createliveforum()}>Create live forum</Button> : <></>}
            </CardHeader>
            <CardBody>
              <Row>
                {forumInfos.map((item, idx) =>
                  <Col key={idx} xl="4" lg="4" sm="6">
                    <SmallCardForum                      
                      key={idx}
                      item={item}
                      history={false}
                      forumEdit={() => this.handleEditForum(idx)}
                      forumDelete={() => this.handleDeleteForum(idx)}
                      startSession={() => this.startSession(idx)}
                    />
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