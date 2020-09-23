import React from "react";
import { Modal, ModalBody, Button, FormInput, DatePicker, FormTextarea, FormSelect } from "shards-react";
import MultiSelect from "react-multi-select-component";
import 'react-notifications-component/dist/theme.css';
import LoadingModal from "./LoadingModal";
import { createforum, gettags, getallstudents } from '../../api/api';
import Timelinelist from '../../common/TimelistList';

import Close from '../../images/Close.svg'

export default class CreateLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUsers: [],
      selectedTags: [],
      loading: false,
      displayday: '',
      foruminfo: {
        title: "",
        description: "",
        email: "",
        tags: [],
        students: [],
        from: '00:00',
        to: '00:00',
        day: new Date().toISOString().slice(0,10)
      },
      tags: [],
      students: [],
      requiremessage: {
        dtitle: '',
        ddescription: '',
      },
    };

  }

  componentWillMount() {
    const {foruminfo} = this.state;
    let temp = foruminfo;
    temp.email = localStorage.getItem('email');
    this.setState({foruminfo: temp});

    this.getAllTags();
    this.getAllStudents();
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

  getAllTags = async() => {
    const {toggle_createfail} = this.props;
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
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else if (result.data.message === "Token is Invalid") {
          this.removeSession();
          window.location.href = "/";
        } else {
          toggle_createfail(result.data.message);
        }
      }
    } catch(err) {
      toggle_createfail("Something Went wrong");
      }
  }

  getAllStudents = async() => {
    const { toggle_createfail } = this.props;
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
          toggle_createfail(result.data.message);
        }
      }
    } catch (err) {
      toggle_createfail("Something Went wrong");
    }
  }

  actionSave = async() => {
    const {requiremessage, foruminfo} = this.state;
    const {toggle_createsuccess, toggle_createfail, toggle_createwarning} = this.props;
    let temp = requiremessage;
    temp.dtitle = '';
    temp.description = '';
    this.setState({
      requiremessage: temp
    });
    try {
      this.setState({loading: true});
      const result = await createforum(foruminfo);
      if (result.data.result === "success") {
        this.toggle();
        window.location.href = "/scheduleLiveForum";
        toggle_createsuccess("Create Forum Success");
      } else if (result.data.result === "warning") {
        toggle_createwarning(result.data.message);
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
            toggle_createfail("Create Forum Fail");
          }
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      toggle_createfail("Create Forum Fail");
    }
  }

  removeSession() {
    localStorage.clear();
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
  
  handleChange = (event) => {
    const {personName} = this.state;
    const temp = personName;
    temp.push(event);
    this.setState({personName: temp})
  };

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
  
  render() {
    const { open } = this.props;
    const { selectedUsers, selectedTags, tags, students, foruminfo, requiremessage, displayday, loading } = this.state;
    
    return (
      <div>
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Create live forum</h1>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Title</label>
            {requiremessage.dtitle !== '' && <span className="require-message">{requiremessage.dtitle}</span>}
            {requiremessage.dtitle !== '' && <FormInput className="profile-detail-input" placeholder="Title" invalid autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={foruminfo.title}/>}
            {requiremessage.dtitle === '' && <FormInput className="profile-detail-input" placeholder="Title" autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={foruminfo.title}/>}
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Description</label>
            {requiremessage.ddescription !== '' && <span className="require-message">{requiremessage.ddescription}</span>}
            {requiremessage.ddescription !== '' && <FormTextarea style={{marginBottom: 20}} className="profile-detail-desc profile-detail-input" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={foruminfo.description}/>}
            {requiremessage.ddescription === '' && <FormTextarea style={{marginBottom: 20}} className="profile-detail-desc profile-detail-input" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={foruminfo.description}/>}
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
            selected={displayday}
            onChange={(e) => this.onChangeDay(e)}
            value={foruminfo.day}
            placeholderText="Select Date"
            dropdownMode="select"
            className="text-center"
            style={{marginBottom: 20}}
          />

          <div className="content-center block-content-class modal-input-group-class" style={{marginTop: 20}}>
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
          <div className="content-center block-content-class button-text-group-class">
            <Button onClick={() => this.actionSave()}>Save</Button>
          </div>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}