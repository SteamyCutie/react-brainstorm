import React from "react";
import { Modal, ModalBody, Button, FormInput, DatePicker, FormTextarea, FormSelect } from "shards-react";
import MultiSelect from "react-multi-select-component";
import LoadingModal from "./LoadingModal";
import { createforum, gettags, getsubscribedstudents, getassociatedstudents, signout } from '../../api/api';
import Timelinelist from '../../common/TimelistList';
import Languagelist from '../../common/LanguageList';
import Close from '../../images/Close.svg';
import moment from 'moment';

export default class CreateLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSubscribedUsers: [],
      selectedAssociatedUsers: [],
      associated_students: [], 
      subscribed_students: [], 
      selectedTags: [],
      loading: false,
      displayday: '',
      foruminfo: {
        title: "",
        description: "",
        email: "",
        tags: [],
        students: [],
        language: 'English',
        from: '00:00',
        to: '00:00',
        day: new Date().toISOString().slice(0, 10),
        forum_start: '',
        forum_end: ''
      },
      tags: [],
      students: [],
      requiremessage: {
        dtitle: '',
        description: '',
      },
    };

  }

  componentWillMount() {    
    let { foruminfo } = this.state;
    foruminfo.email = localStorage.getItem('email');
    this.setState({ foruminfo });
    this.getAllTags();
    this.getSubscribedStudents();
    this.getAssociatedStudents();
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

  getAllTags = async () => {
    const { toggle_createfail } = this.props;
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
      } else {
        if (result.data.message === "Token is Expired") {
          toggle_createfail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          toggle_createfail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          toggle_createfail(result.data.message);
          this.signout();
        } else {
          toggle_createfail(result.data.message);
        }
      }
    } catch (err) {
      toggle_createfail("Something Went wrong");
    }
  }

  getAssociatedStudents = async () => {
    const { toggle_createfail } = this.props;
    let param = {
      email: localStorage.getItem('email')
    }
    try {
      const result = await getassociatedstudents(param);
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
        this.setState({ associated_students: params });
      } else {
        if (result.data.message === "Token is Expired") {
          toggle_createfail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token in Invalid") {
          toggle_createfail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          toggle_createfail(result.data.message);
          this.signout();
        } else {
          toggle_createfail(result.data.message);
        }
      }
    } catch (err) {
      toggle_createfail("Something Went wrong");
    }
  }

  getSubscribedStudents = async () => {
    const { toggle_createfail } = this.props;
    let param = {
      email: localStorage.getItem('email')
    }
    try {
      const result = await getsubscribedstudents(param);
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
        this.setState({ subscribed_students: params });
      } else {
        if (result.data.message === "Token is Expired") {
          toggle_createfail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token in Invalid") {
          toggle_createfail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          toggle_createfail(result.data.message);
          this.signout();
        } else {
          toggle_createfail(result.data.message);
        }
      }
    } catch (err) {
      toggle_createfail("Something Went wrong");
    }
  }

  actionSave = async () => {
    let { requiremessage, foruminfo, selectedSubscribedUsers, selectedAssociatedUsers } = this.state;
    const { toggle_createsuccess, toggle_createfail, toggle_createwarning } = this.props;
    requiremessage.dtitle = '';
    requiremessage.description = '';
    this.setState({
      requiremessage
    });
    try {
      const forum_start = foruminfo.day +" "+ foruminfo.from;
      const forum_end = foruminfo.day +" "+ foruminfo.to;
      let temp = foruminfo;
      temp.forum_start = new Date(forum_start).getTime()/1000;
      temp.forum_end = new Date(forum_end).getTime()/1000;
      let students = [];
      for (var i = 0; i < selectedSubscribedUsers.length; i ++)
      students.push(selectedSubscribedUsers[i].value);
      
      for (var i = 0; i < selectedAssociatedUsers.length; i ++) {
        for (var j = 0; j < students.length; j++) {
          if(students[j] != selectedAssociatedUsers[i].value)
          students.push(selectedAssociatedUsers[i].value)
        }
      }
      foruminfo.students = students;

      this.setState({ foruminfo: temp });
      const result = await createforum(foruminfo);      
      if (result.data.result === "success") {
        this.toggle();
        toggle_createsuccess("Create Forum Success");
      } else if (result.data.result === "warning") {
        toggle_createwarning(result.data.message);
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
            toggle_createfail(result.data.message);
            this.signout();
          } else if (result.data.message === "Token is Invalid") {
            toggle_createfail(result.data.message);
            this.signout();
          } else if (result.data.message === "Authorization Token not found") {
            toggle_createfail(result.data.message);
            this.signout();
          } else {
            toggle_createfail("Create Forum Fail");
          }
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      toggle_createfail("Create Forum Fail");
    }
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

  onChangeLanguage = (e) => {
    let { foruminfo } = this.state;
    foruminfo.language = e.target.value;
    this.setState({ foruminfo });
  };

  onChangeTo = (e) => {
    let { foruminfo } = this.state;
    foruminfo.to = e.target.value;
    this.setState({ foruminfo });
  };

  handleChange = (event) => {
    let { personName } = this.state;
    personName.push(event);
    this.setState({ personName })
  };

  setSelectedSubscribedUsers = (e) => {
    this.setState({ selectedSubscribedUsers: e });
  }

  setSelectedAssociatedUsers = (e) => {
    this.setState({ selectedAssociatedUsers: e });
  }

  setSelectedTags = (e) => {
    this.setState({ selectedTags: e });

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

  render() {
    const { open } = this.props;
    const { selectedAssociatedUsers, selectedSubscribedUsers, selectedTags, tags, subscribed_students, associated_students, foruminfo, requiremessage, displayday, loading } = this.state;

    return (
      <div>
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Create live forum</h1>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Title</label>
              {requiremessage.dtitle !== '' && <span className="require-message">{requiremessage.dtitle}</span>}
              {requiremessage.dtitle !== '' && <FormInput className="profile-detail-input" placeholder="Title" invalid autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={foruminfo.title} />}
              {requiremessage.dtitle === '' && <FormInput className="profile-detail-input" placeholder="Title" autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={foruminfo.title} />}
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Description</label>
              {requiremessage.description !== '' && <span className="require-message">{requiremessage.description}</span>}
              {requiremessage.description !== '' && <FormTextarea style={{ marginBottom: 20 }} className="profile-detail-desc profile-detail-input" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={foruminfo.description} />}
              {requiremessage.description === '' && <FormTextarea style={{ marginBottom: 20 }} className="profile-detail-desc profile-detail-input" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={foruminfo.description} />}
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
              <label htmlFor="feEmail">Associated students</label>
              <MultiSelect
                hasSelectAll={true}
                options={associated_students}
                value={selectedAssociatedUsers}
                onChange={(e) => this.setSelectedAssociatedUsers(e)}
                labelledBy={"Select"}
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class" style={{ marginBottom: 20 }}>
              <label htmlFor="feEmail">Subscribed students</label>
              <MultiSelect
                hasSelectAll={true}
                options={subscribed_students}
                value={selectedSubscribedUsers}
                onChange={(e) => this.setSelectedSubscribedUsers(e)}
                labelledBy={"Select"}
              />
            </div>
            <div className="content-center block-content-class modal-input-group-class" style={{ marginBottom: 20 }}>
              <label htmlFor="feEmail">Language</label>
              <FormSelect id="feInputState" onChange={(e) => this.onChangeLanguage(e)}>
                {Languagelist.map((item, idx) => {
                  return (
                    <option key={idx} value={item.value} >{item.value}</option>
                  );
                })}
              </FormSelect>
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Date</label>
            </div>
            <DatePicker
              md="6"
              size="lg"
              selected={displayday}
              onChange={(e) => this.onChangeDay(e)}
              value={foruminfo.day}
              placeholderText="Select Date"
              dropdownMode="select"
              className="text-center"
              style={{ marginBottom: 20 }}
            />

            <div className="content-center block-content-class modal-input-group-class" style={{ marginTop: 20 }}>
              <label htmlFor="feEmail">From~To</label>
            </div>
            <FormSelect id="feInputState" className="col-md-6 available-time-input" onChange={(e) => this.onChangeFrom(e)}>
              {Timelinelist.map((item, idx) => {
                return (
                  <option key={idx} value={item.value} >{item.str}</option>
                );
              })}
            </FormSelect>
            <FormSelect id="feInputState" className="col-md-6 available-time-input" onChange={(e) => this.onChangeTo(e)}>
              {Timelinelist.map((item, idx) => {
                return (
                  <option key={idx} value={item.value} >{item.str}</option>
                );
              })}
            </FormSelect>
            <div className="content-center block-content-class button-text-group-class-mentor">
              <Button onClick={() => this.actionSave()}>Save</Button>
            </div>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}