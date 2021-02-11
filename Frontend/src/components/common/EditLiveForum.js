import React from "react";
import { Modal, ModalBody, Button, FormInput, DatePicker, FormTextarea, FormSelect } from "shards-react";
import MultiSelect from "react-multi-select-component";
import LoadingModal from "./LoadingModal";
import { gettags, editforum, getforum, getallstudents, signout } from '../../api/api';
import Timelinelist from '../../common/TimelistList';
import Close from '../../images/Close.svg';
import { ToastsStore } from 'react-toasts';
import moment from 'moment';
moment.locale('en');

export default class EditLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      displayday: '',
      displayfrom: '',
      displayto: '',
      foruminfo: {
        id: "",
        title: "",
        description: "",
        tags: [],
        students: [],
        from: '',
        to: '',
        day: '',
        forum_start: '',
        forum_end: ''
      },
      tags: [],
      students: [],
      selectedTags: [],
      selectedUsers: [],
      requiremessage: {
        dtitle: '',
        description: '',
      },
    };
  }

  componentWillMount() {
    this.getAllTags();
    this.getAllStudents();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && this.props.id !== nextProps.id) {
      this.getSession(nextProps.id);
    }
  }

  toggle() {
    const { toggle } = this.props;
    toggle();
  }

  onChangeTitle = (e) => {
    var array = e.target.value.split("");
    if (array.length > 30) {
      return;
    }
    let { foruminfo } = this.state;
    foruminfo.title = e.target.value;
    this.setState({ foruminfo });
  }

  onChangeDescription = (e) => {
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
    let { foruminfo } = this.state;
    foruminfo.description = e.target.value;
    this.setState({ foruminfo });
  }

  setSelectedUsers = (e) => {
    var temp = e;
    this.setState({ selectedUsers: temp });

    if (e.length > 0) {
      let { foruminfo } = this.state;
      foruminfo.students = [];
      for (var i = 0; i < e.length; i++) {
        foruminfo.students.push(e[i].value);
      }
      this.setState({ foruminfo });
    } else {
      let { foruminfo } = this.state;
      foruminfo.students = [];
      this.setState({ foruminfo });
    }
  }

  setSelectedTags = (e) => {
    let temp = e;
    this.setState({ selectedTags: temp });

    if (e.length > 0) {
      let { foruminfo } = this.state;
      foruminfo.tags = [];
      for (var i = 0; i < e.length; i++) {
        foruminfo.tags.push(e[i].value);
      }
      this.setState({ foruminfo });
    } else {
      let { foruminfo } = this.state;
      foruminfo.tags = [];
      this.setState({ foruminfo });
    }
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
        this.setState({ tags: params });
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
        this.setState({ students: params });
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

  actionEdit = async () => {
    let { requiremessage, foruminfo } = this.state;
    const { toggle_editsuccess, toggle_editfail } = this.props;
    requiremessage.dtitle = '';
    requiremessage.description = '';
    this.setState({
      requiremessage
    });
    try {
      this.setState({ loading: true });
      const forum_start = foruminfo.day +" "+ foruminfo.from;
      const forum_end = foruminfo.day +" "+ foruminfo.to;
      
      foruminfo.forum_start = new Date(forum_start).getTime()/1000;
      foruminfo.forum_end = new Date(forum_end).getTime()/1000;
      this.setState({ foruminfo });
      const result = await editforum(foruminfo);
      if (result.data.result === "success") {
        this.toggle();
        toggle_editsuccess("Edit Forum Success");
      } else {
        if (result.data.type === 'require') {
          let { requiremessage } = this.state;
          if (result.data.message.title) {
            requiremessage.dtitle = result.data.message.title[0];
          }
          if (result.data.message.description) {
            requiremessage.description = result.data.message.description[0];
          }
          this.setState({
            requiremessage
          });
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
            toggle_editfail("Edit Forum Fail");
          }
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      toggle_editfail("Edit Forum Fail");
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
    //this.props.history.push('/');
  }

  getSession = async (id) => {
    this.setState({ loading: true });
    try {
      const result = await getforum({ id: id });
      if (result.data.result === "success") {
        let { foruminfo } = this.state;
        foruminfo.tags = result.data.data.tags;
        foruminfo.students = result.data.data.students_id;
        foruminfo.id = result.data.data.id;
        foruminfo.title = result.data.data.title;
        foruminfo.description = result.data.data.description;
        foruminfo.from = moment(result.data.data.forum_start * 1000).format("H:mm");
        foruminfo.to = moment(result.data.data.forum_end * 1000).format("H:mm");
        foruminfo.day =  moment(result.data.data.forum_start * 1000).format("YYYY-MM-DD");        
        
        this.setState({ foruminfo });
        let param = {
          label: '',
          value: 0
        };

        let param1 = {
          label: '',
          value: 0
        };

        let params = [], params1 = [];
        for (var i = 0; i < result.data.data.tags.length; i++) {
          param.label = result.data.data.tags_name[i].trim();
          param.value = parseInt(result.data.data.tags[i].trim());
          params.push(param);
          param = {};
        }

        for (var j = 0; j < result.data.data.students.length; j++) {
          param1.label = result.data.data.students_email[j].trim();
          param1.value = result.data.data.students_id[j];
          params1.push(param1);
          param1 = {};
        }
        this.setState({
          selectedUsers: params1,
          selectedTags: params
        });
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
    }
  }

  onChangeDay = (e) => {
    let { foruminfo } = this.state;
    let date = new Date(e);
    let displayday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    foruminfo.day = displayday;
    this.setState({ foruminfo });
    this.setState({ displayday: date });
  };

  onChangeFrom = (e) => {
    let { foruminfo } = this.state;
    foruminfo.from = e.target.value;
    this.setState({ foruminfo });
  };

  onChangeTo = (e) => {
    let { foruminfo } = this.state;
    foruminfo.to = e.target.value;
    this.setState({ foruminfo });
  };

  render() {
    const { open } = this.props;
    const { tags, students, selectedTags, selectedUsers } = this.state;
    return (
      <div>
        <Modal size="lg" open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Edit live forum</h1>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Forum name</label>
              {this.state.requiremessage.dtitle !== '' && <span className="require-message">{this.state.requiremessage.dtitle}</span>}
              {this.state.requiremessage.dtitle !== '' && <FormInput className="profile-detail-input" placeholder="Title" autoFocus="1" invalid onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title} />}
              {this.state.requiremessage.dtitle === '' && <FormInput className="profile-detail-input" placeholder="Title" autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title} />}
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Description</label>
              {this.state.requiremessage.description !== '' && <span className="require-message">{this.state.requiremessage.description}</span>}
              {this.state.requiremessage.description !== '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description} />}
              {this.state.requiremessage.description === '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description} />}
            </div>
            <div className="content-center block-content-class modal-input-group-class" style={{ marginBottom: 20 }}>
              <label htmlFor="feEmail">Tags</label>
              <MultiSelect
                hasSelectAll={false}
                options={tags}
                value={selectedTags}
                onChange={(e) => this.setSelectedTags(e)}
                labelledBy={"Select"}
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class" style={{ marginBottom: 20 }}>
              <label htmlFor="feEmail">Students</label>
              <MultiSelect
                hasSelectAll={true}
                options={students}
                value={selectedUsers}
                onChange={(e) => this.setSelectedUsers(e)}
                labelledBy={"Select"}
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Date</label>
            </div>
            <DatePicker
              md="6"
              size="lg"
              selected={this.state.displayday}
              onChange={(e) => this.onChangeDay(e)}
              value={this.state.foruminfo.day}
              placeholderText="From"
              dropdownMode="select"
              className="text-center"
            />
            <div className="content-center block-content-class modal-input-group-class" style={{ marginTop: 20 }}>
              <label htmlFor="feEmail">From~To</label>
            </div>
            <FormSelect id="feInputState" className="col-md-6 available-time-input" onChange={(e) => this.onChangeFrom(e)}>
              {Timelinelist.map((item, idx) => {
                return (
                  item.value === this.state.foruminfo.from ? <option key={idx} value={item.value} selected>{item.str}</option> : <option key={idx} value={item.value}>{item.str}</option>
                );
              })}
            </FormSelect>
            <FormSelect id="feInputState" className="col-md-6 available-time-input" onChange={(e) => this.onChangeTo(e)}>
              {Timelinelist.map((item, idx) => {
                return (
                  item.value === this.state.foruminfo.to ? <option key={idx} value={item.value} selected>{item.str}</option> : <option key={idx} value={item.value}>{item.str}</option>
                );
              })}
            </FormSelect>
            <div className="content-center block-content-class button-text-group-class-mentor">
              <Button onClick={() => this.actionEdit()}>Edit</Button>
            </div>
          </ModalBody>
        </Modal>
        {this.state.loading && <LoadingModal open={true} />}
      </div>
    );
  }
}