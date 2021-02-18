import React from "react";
import { Modal, ModalBody, Button, FormInput, DatePicker, FormTextarea, FormSelect, FormCheckbox } from "shards-react";
import MultiSelect from "react-multi-select-component";
import LoadingModal from "./LoadingModal";
import { editforum, signout } from '../../api/api';
import Timelinelist from '../../common/TimelistList';
import Languagelist from '../../common/LanguageList';
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
      id: null,
      email: localStorage.getItem('email'),
      title: "",
      price: null,
      description: "",
      day: new Date().toISOString().slice(0, 10),
      from: "",
      to: "",
      language: "English",
      tags: [],
      students: [],
      requiremessage: {
        dtitle: '',
        description: '',
      },
      opened: false,
      attachments: [],
      t_attachments: [],
      age_limitation: "18 and older",
      day: "",
      from_time: "",
      to_time: "",
      tempInfo: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.forumInfo) != JSON.stringify(nextProps.forumInfo)) {
      if (nextProps.forumInfo !== null) {
        const {
          tag_name,
          student_info,
          age_limitation,
          day,
          description,
          forum_end,
          forum_start,
          from,
          id,
          language,
          opened,
          price,
          title,
          to,
          attachments
        } = nextProps.forumInfo;
        
        const from_time = moment(from).format("hh:mm a");
        const to_time = moment(to).format("hh:mm a");
        const {allTags, allStudents} = this.props;
        let tags = [];
        let students = [];
        
        for (const idx1 in tag_name) {
          for (const idx2 in allTags) {
            if (allTags[idx2].label === tag_name[idx1].name) {
              tags.push(allTags[idx2]);
            }
          }
        }
        
        for (const idx1 in student_info) {
          for (const idx2 in allStudents) {
            if (allStudents[idx2].label === student_info[idx1].email) {
              students.push(allStudents[idx2]);
            }
          }
        }
        
        let tempInfo = Object.assign({
          age_limitation,
          day,
          description,
          forum_end,
          forum_start,
          from,
          id,
          language,
          opened,
          price,
          title,
          to,
          tags,
          students,
          from_time,
          to_time,
          attachments
        });

        this.setState({
          tempInfo,
          id,
          age_limitation,
          day,
          description,
          forum_end,
          forum_start,
          from,
          language,
          opened,
          price,
          title,
          to,
          tags,
          students,
          from_time,
          to_time,
          attachments
        });
      }
    }
  }

  toggle() {
    const { toggle } = this.props;
    const {
      age_limitation,
      day,
      description,
      forum_end,
      forum_start,
      from,
      id,
      language,
      opened,
      price,
      title,
      to,
      tags,
      students,
      from_time,
      to_time,
      attachments
    } = this.state.tempInfo;

    this.setState({
      age_limitation,
      day,
      description,
      forum_end,
      forum_start,
      from,
      id,
      language,
      opened,
      price,
      title,
      to,
      tags,
      students,
      from_time,
      to_time,
      attachments
    });

    toggle();
  }

  onChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  }

  onChangePrice = (e) => {
    this.setState({ price: e.target.value });
  }
  
  onChangeDescription = (e) => {
    this.setState({ description: e.target.value });
  }

  onChangeDay = (e) => {
    let date = new Date(e);
    let displayday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.setState({ day: displayday });
    this.setState({ displayday: date });
  };

  onChangeFrom = (e) => {
    this.setState({ from: e.target.value });
  };
  
  onChangeTo = (e) => {
    this.setState({ to: e.target.value });
  };

  onChangeLanguage = (e) => {
    this.setState({ language: e.target.value });
  };

  setSelectedStudents = (e) => {
    this.setState({ students:e });
  }

  setSelectedTags = (e) => {
    this.setState({ tags: e });
  }

  handleOpenForum = (e) => {
    this.setState({opened: !this.state.opened});
  }

  handleFileChange(eve) {
    const { files } = eve.target;
    let temp = [...this.state.t_attachments];

    for( const key in Object.keys(files)) {
      temp.push(files[key]);
    }

    this.setState({t_attachments: temp});
  }

  handleAttachmentsRemove = (eve, idx) => {
    let { attachments } = this.state;

    attachments.splice(idx, 1);
    this.setState({attachments});
  }

  handleTempAttachmentsRemove = (eve, idx) => {
    let { t_attachments } = this.state;

    t_attachments.splice(idx, 1);
    this.setState({t_attachments});
  }

  onChangeAgeLimitaton = (eve) => {
    this.setState({age_limitation: eve.target.value});
  }

  actionEdit = async () => {
    const { requiremessage, id, students, opened, title, description, tags, language, from_time, to_time, day, email, price, attachments, t_attachments, age_limitation } = this.state;
    const { toggle_editsuccess, toggle_editfail } = this.props;
    
    requiremessage.dtitle = '';
    requiremessage.description = '';
    this.setState({
      requiremessage
    });
    
    let param = null;
    const forum_start = day +" "+ from_time;
    const forum_end = day +" "+ to_time;
    
    try {
      if (!opened) {
        let t_students = [];
        let t_tags = [];
        for (let i = 0; i < students.length; i ++)
          t_students.push(students[i].value);

        for (let i = 0; i < tags.length; i ++)
          t_tags.push(tags[i].value);
        
        let data = new FormData();
        data.append("forumInfo", JSON.stringify({
          id,
          email,
          title,
          description,
          tags: t_tags,
          language,
          forum_start: new Date(forum_start).getTime()/1000,
          forum_end: new Date(forum_end).getTime()/1000,
          students: t_students,
          opened: false
        }));

        param = data;
      } else {
        let t_students = [];
        let t_tags = [];
        for (let i = 0; i < students.length; i ++)
          t_students.push(students[i].value);

        for (let i = 0; i < tags.length; i ++)
          t_tags.push(tags[i].value);

        let data = new FormData();

        t_attachments.forEach(function(file) {
          data.append("files[]", file)
        });
        data.append("forumInfo", JSON.stringify({
          id,
          email,
          title,
          description,
          tags: t_tags,
          attachments,
          language,
          forum_start: new Date(forum_start).getTime()/1000,
          forum_end: new Date(forum_end).getTime()/1000,
          opened: true,
          ageLimitation: age_limitation,
          price
        }));

        param = data;
      }

      const result = await editforum(param);
      if (result.data.result === "success") {
        this.toggle();
        toggle_editsuccess("Edit Forum Success");
      } else if (result.data.result === "warning") {
        toggle_editsuccess(result.data.message);
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
            toggle_editfail(result.data.message);
            this.signout();
          } else if (result.data.message === "Token is Invalid") {
            toggle_editfail(result.data.message);
            this.signout();
          } else if (result.data.message === "Authorization Token not found") {
            toggle_editfail(result.data.message);
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
  }

  render() {
    const { open } = this.props;
    const {
      requiremessage,
      displayday,
      loading,
      opened,
      attachments,
      t_attachments,
      title,
      description,
      day, 
      price,
      tags,
      students,
      age_limitation,
      language,
      from_time,
      to_time,

    } = this.state;

    const { allTags, allStudents } = this.props;

    return (
      <div>
        <Modal size="lg" open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="cofntent-center modal-header-class">Edit live forum</h1>
            <div style={{float: "left", width: "100%"}}></div>
            <div style={{float: "right"}}>
              <FormCheckbox toggle onChange={e => this.handleOpenForum(e)} checked={opened} >Make this forum as open</FormCheckbox>
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Title</label>
              {this.state.requiremessage.dtitle !== '' && <span className="require-message">{this.state.requiremessage.dtitle}</span>}
              {this.state.requiremessage.dtitle !== '' && <FormInput className="profile-detail-input" placeholder="Title" autoFocus="1" invalid onChange={(e) => this.onChangeTitle(e)} value={title} />}
              {this.state.requiremessage.dtitle === '' && <FormInput className="profile-detail-input" placeholder="Title" autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={title} />}
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Description</label>
              {this.state.requiremessage.description !== '' && <span className="require-message">{this.state.requiremessage.description}</span>}
              {this.state.requiremessage.description !== '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={description} />}
              {this.state.requiremessage.description === '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={description} />}
            </div>
            {opened &&
              <div className="content-center block-content-class modal-input-group-class" style={{ marginBottom: 20 }}>
                <label htmlFor="feEmail">Age limitation</label>
                <FormSelect id="feInputState" onChange={(e) => this.onChangeAgeLimitaton(e)}>
                  <option value={"18 and older"} selected={age_limitation === "18 and older"}>18 and older</option>
                  <option value={"1-17 years"} selected={age_limitation === "1-17 years"}>1-17 years</option>
                </FormSelect>
              </div>
            }
            {opened &&
              <div className="content-center block-content-class modal-input-group-class">
                <label htmlFor="feEmail" className="profile-detail-important">Price</label>
                {requiremessage.dtitle !== '' && <span className="require-message">{requiremessage.dtitle}</span>}
                {requiremessage.dtitle !== '' && <FormInput type="number" className="profile-detail-input" placeholder="Price" invalid autoFocus="1" onChange={(e) => this.onChangePrice(e)} value={price} />}
                {requiremessage.dtitle === '' && <FormInput type="number" className="profile-detail-input" placeholder="Price" autoFocus="1" onChange={(e) => this.onChangePrice(e)} value={price} />}
              </div>
            }
            <div className="content-center block-content-class modal-input-group-class" style={{ marginBottom: 20 }}>
              <label htmlFor="feEmail">Tags</label>
              <MultiSelect
                hasSelectAll={false}
                options={allTags}
                value={tags}
                onChange={(e) => this.setSelectedTags(e)}
                labelledBy={"Select"}
              />
            </div>
            {!opened &&
              <div className="content-center block-content-class modal-input-group-class" style={{ marginBottom: 20 }}>
                <label htmlFor="feEmail">Students</label>
                <MultiSelect
                  hasSelectAll={true}
                  options={allStudents}
                  value={students}
                  onChange={(e) => this.setSelectedUsers(e)}
                  labelledBy={"Select"}
                />
              </div>
            }
            <div className="content-center block-content-class modal-input-group-class" style={{ marginBottom: 20 }}>
              <label htmlFor="feEmail">Language</label>
              <FormSelect id="feInputState" onChange={(e) => this.onChangeLanguage(e)}>
                {Languagelist.map((item, idx) => {
                  return (
                    item.value === language 
                    ? <option key={idx} value={item.value} selected>{item.value}</option>
                    : <option key={idx} value={item.value} >{item.value}</option>
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
              selected={this.state.displayday}
              onChange={(e) => this.onChangeDay(e)}
              value={day}
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
                  item.str === from_time ? <option key={idx} value={item.value} selected>{item.str}</option> : <option key={idx} value={item.value}>{item.str}</option>
                );
              })}
            </FormSelect>
            <FormSelect id="feInputState" className="col-md-6 available-time-input" onChange={(e) => this.onChangeTo(e)}>
              {Timelinelist.map((item, idx) => {
                return (
                  item.str === to_time ? <option key={idx} value={item.value} selected>{item.str}</option> : <option key={idx} value={item.value}>{item.str}</option>
                );
              })}
            </FormSelect>
            {opened &&
              <>
                <div className="content-center block-content-class modal-input-group-class" style={{ marginTop: 20 }}>
                  <label htmlFor="feEmail">Attachments</label>
                </div>
                <div>
                  <label className="custom-file-upload">
                    <input type="file" multiple onChange={(eve) => this.handleFileChange(eve)}/>
                    <i className="fa fa-cloud-upload" /> Browse
                  </label>
                </div>
                {attachments.map((file, idx) => {
                  return (
                    <div key={idx} style={{padding: "2px 8px", margin: "2px 8px", backgroundColor: "#04B5FA", borderRadius: "10px", display: "inline-block"}}>
                      <label style={{color: "white",fontSize: "14px", textTransform: "none", margin: "0px"}}>{file.name}</label>
                      <label value={idx} style={{color: "white", fontSize: "17px", fontWeight: "bold", margin: "0px", padding: "0px 3px"}} onClick={(evt)=>this.handleAttachmentsRemove(evt,idx)}>×</label>
                    </div>
                  )
                })}
                {t_attachments.map((file, idx) => {
                  return (
                    <div key={idx} style={{padding: "2px 8px", margin: "2px 8px", backgroundColor: "#04B5FA", borderRadius: "10px", display: "inline-block"}}>
                      <label style={{color: "white",fontSize: "14px", textTransform: "none", margin: "0px"}}>{file.name}</label>
                      <label value={idx} style={{color: "white", fontSize: "17px", fontWeight: "bold", margin: "0px", padding: "0px 3px"}} onClick={(evt)=>this.handleTempAttachmentsRemove(evt,idx)}>×</label>
                    </div>
                  )
                })}
              </>
            }
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