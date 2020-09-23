import React from "react";
import { Modal, ModalBody, Button, FormInput,  DatePicker, FormTextarea, FormSelect } from "shards-react";
import ReactNotification from 'react-notifications-component';
import MultiSelect from "react-multi-select-component";
import LoadingModal from "./LoadingModal";
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { gettags, editforum, getforum, getallstudents } from '../../api/api';
import Timelinelist from '../../common/TimelistList';
import Close from '../../images/Close.svg'

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
        day: ''
      },
      tags: [],
      students: [],
      selectedTags: [],
      selectedUsers: [],
      requiremessage: {
        dtitle: '',
        ddescription: '',
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
    const {foruminfo} = this.state;
    let temp = foruminfo;
    temp.title = e.target.value;
    this.setState({foruminfo: temp});
  }

  onChangeDescription = (e) => {
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
    const {foruminfo} = this.state;
    let temp = foruminfo;
    temp.description = e.target.value;
    this.setState({foruminfo: temp});
  }

  setSelectedUsers = (e) => {
    const {selectedUsers} = this.state;
    var temp = selectedUsers;
    temp = e;
    this.setState({selectedUsers: temp});

    if (e.length > 0) {
      const { foruminfo } = this.state;
      let temp1 = foruminfo;
      temp1.students = [];
      for(var i = 0; i < e.length; i ++) {
        temp1.students.push(e[i].value);
      }
      this.setState({foruminfo: temp1});
    } else {
      const { foruminfo } = this.state;
      let temp1 = foruminfo;
      temp1.students = [];
      this.setState({foruminfo: temp1});
    }
  }

  setSelectedTags = (e) => {
    console.log(e, "tags");
    const {selectedTags} = this.state;
    let temp = selectedTags;
    temp = e;
    this.setState({selectedTags: temp});
    
    if (e.length > 0) {
      const { foruminfo } = this.state;
      let temp1 = foruminfo;
      temp1.tags = [];
      for(var i = 0; i < e.length; i ++) {
        temp1.tags.push(e[i].value);
      }
      this.setState({foruminfo: temp1});
    } else {
      const { foruminfo } = this.state;
      let temp1 = foruminfo;
      temp1.tags = [];
      this.setState({foruminfo: temp1});
    }
  }

  getAllTags = async() => {
    try {
      const result = await gettags();
      if (result.data.result === "success") {
        let param = {
          label: '',
          value: ''
        };

        let params = [];

        for (var i = 0; i < result.data.data.length; i ++) {
          param.label = result.data.data[i].name;
          param.value = result.data.data[i].id;
          params.push(param);
          param = {};
        }
        this.setState({tags: params});
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
    } catch(err) {
        this.showFail("Something Went wrong");
      }
  }

  getAllStudents = async() => {
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

        for (var i = 0; i < result.data.data.length; i ++) {
          param.label = result.data.data[i].email;
          param.value = result.data.data[i].id;
          params.push(param);
          param = {};
        }
        this.setState({students: params});
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else if (result.data.message === "Token in Invalid") {
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
    } catch (err) {
      this.showFail("Something Went wrong");
    }
  }

  actionEdit = async() => {
    const {requiremessage, foruminfo} = this.state;
    const {toggle_editsuccess, toggle_editfail} = this.props;
    let temp = requiremessage;
    temp.dtitle = '';
    temp.description = '';
    this.setState({
      requiremessage: temp
    });
    try {
      this.setState({loading: true});
      const result = await editforum(foruminfo);
      if (result.data.result === "success") {
        this.toggle();
        toggle_editsuccess("Edit Forum Success");
        window.location.href = "/scheduleLiveForum";
      } else {
        if (result.data.type === 'require') {
          const {requiremessage} = this.state;
          let temp = requiremessage;
          if (result.data.message.title) {
            temp.dtitle = result.data.message.title[0];
          }
          if (result.data.message.description) {
            temp.ddescription = result.data.message.description[0];
          }
          this.setState({
            requiremessage: temp
          });
        } else {
          if (result.data.message === "Token is Expired") {
            this.removeSession();
            window.location.href = "/";
          } else {
            toggle_editfail("Edit Forum Fail");
          }
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      toggle_editfail("Edit Forum Fail");
    };
  }

  removeSession() {
    localStorage.clear();
  }

  getSession = async(id) => {
    try {
      const result = await getforum({id: id});
      if (result.data.result === "success") {
        const {foruminfo} = this.state;
        let temp = foruminfo;
        temp.tags = result.data.data.tags;
        temp.students = result.data.data.students_id;
        temp.id = result.data.data.id;
        temp.title = result.data.data.title;
        temp.description = result.data.data.description;
        temp.from = result.data.data.from;
        temp.to = result.data.data.to;
        temp.day = result.data.data.day;
        this.setState({foruminfo: temp});
        let param = {
          label: '',
          value: 0
        };

        let param1 = {
          label: '',
          value: 0
        };

        let params = [], params1 = [];
        for (var i = 0; i < result.data.data.tags.length; i ++) {
          param.label = result.data.data.tags_name[i].trim();
          param.value = parseInt(result.data.data.tags[i].trim());
          params.push(param);
          param = {};
        }

        for (var i = 0; i < result.data.data.students.length; i ++) {
          param1.label = result.data.data.students_email[i].trim();
          param1.value = result.data.data.students_id[i];
          params1.push(param1);
          param1 = {};
        }
        this.setState({
          selectedUsers: params1,
          selectedTags: params
        });
        
        console.log(foruminfo, "---");
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
    } catch(err) {
      console.log(err);
      this.showFail("Something Went wrong");
    }
  }

  onChangeDay = (e) => {
    const {foruminfo} = this.state;
    let temp = foruminfo;
    let date = new Date(e);
    let displayday = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    temp.day = displayday;
    this.setState({foruminfo: temp});
    this.setState({displayday: date});
  };

  onChangeFrom = (e) => {
    const {foruminfo} = this.state;
    let temp = foruminfo;
    temp.from = e.target.value;
    this.setState({foruminfo: temp});
  };

  onChangeTo = (e) => {
    const {foruminfo} = this.state;
    let temp = foruminfo;
    temp.to = e.target.value;
    this.setState({foruminfo: temp});
  };

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
    const { open } = this.props;
    const { tags, students, selectedTags, selectedUsers } = this.state;
    return (
      <div>
        <ReactNotification />
        <Modal size="lg" open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Edit live forum</h1>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Forum name</label>
            {this.state.requiremessage.dtitle !== '' && <span className="require-message">{this.state.requiremessage.dtitle}</span>}
            {this.state.requiremessage.dtitle !== '' && <FormInput className="profile-detail-input" placeholder="Title" autoFocus="1" invalid onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title}/>}
            {this.state.requiremessage.dtitle ==='' && <FormInput className="profile-detail-input" placeholder="Title" autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title}/>}
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Description</label>
            {this.state.requiremessage.ddescription !== '' && <span className="require-message">{this.state.requiremessage.ddescription}</span>}
            {this.state.requiremessage.ddescription !== '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description}/>}
            {this.state.requiremessage.ddescription === '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description}/>}
          </div>
          <div className="content-center block-content-class modal-input-group-class" style={{marginBottom: 20}}>
            <label htmlFor="feEmail">Tags</label>
            <MultiSelect
              options={tags}
              value={selectedTags}
              onChange={(e) => this.setSelectedTags(e)}
              labelledBy={"Select"}
            />
          </div>
          <div className="content-center block-content-class modal-input-group-class" style={{marginBottom: 20}}>
            <label htmlFor="feEmail">Students</label> 
            <MultiSelect
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
          <div className="content-center block-content-class modal-input-group-class" style={{marginTop: 20}}>
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
          <div className="content-center block-content-class button-text-group-class">
            <Button onClick={() => this.actionEdit()}>Edit</Button>
          </div>
          </ModalBody>
        </Modal>
        {this.state.loading && <LoadingModal open={true} />}
      </div>
    );
  }
}