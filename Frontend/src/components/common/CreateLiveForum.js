import React from "react";
import { Modal, ModalBody, Button, FormInput, DatePicker, FormTextarea, FormSelect, FormCheckbox } from "shards-react";
import MultiSelect from "react-multi-select-component";
import LoadingModal from "./LoadingModal";
import { createforum, signout } from '../../api/api';
import Timelinelist from '../../common/TimelistList';
import Languagelist from '../../common/LanguageList';
import Close from '../../images/Close.svg';

export default class CreateLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      displayday: '',
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
      ageLimitation: "18 and older",
    };

  }

  toggle() {
    const { toggle } = this.props;
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
    let temp = [...this.state.attachments];

    for( const key in Object.keys(files)) {
      temp.push(files[key]);
    }

    this.setState({attachments: temp});
  }

  handleAttachmentsRemove = (eve, idx) => {
    let { attachments } = this.state;

    attachments.splice(idx, 1);
    this.setState({attachments});
  }

  onChangeAgeLimitaton = (eve) => {
    this.setState({ageLimitation: eve.target.value});
  }
  
  actionSave = async () => {
    const { requiremessage, students, opened, title, description, tags, language, from, to, day, email, price, attachments, ageLimitation } = this.state;
    const { toggle_createsuccess, toggle_createfail, toggle_createwarning } = this.props;
    
    requiremessage.dtitle = '';
    requiremessage.description = '';
    this.setState({
      requiremessage
    });
    
    let param = null;
    const forum_start = day +" "+ from;
    const forum_end = day +" "+ to;
    
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

        attachments.forEach(function(file) {
          data.append("files[]", file)
        });
        data.append("forumInfo", JSON.stringify({
          email,
          title,
          description,
          tags: t_tags,
          language,
          forum_start: new Date(forum_start).getTime()/1000,
          forum_end: new Date(forum_end).getTime()/1000,
          opened: true,
          ageLimitation,
          price
        }));

        param = data;
      }

      const result = await createforum(param);
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


  render() {
    const { open } = this.props;
    const {
      requiremessage,
      displayday,
      loading,
      opened,
      attachments,
      title,
      description,
      day, 
      price,
      tags,
      students
    } = this.state;

    const { allTags, allStudents } = this.props;

    return (
      <div>
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Create live forum</h1>
            <div style={{float: "left", width: "100%"}}></div>
            <div style={{float: "right"}}>
              <FormCheckbox toggle onChange={e => this.handleOpenForum(e)} >Make this forum as open</FormCheckbox>
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Title</label>
              {requiremessage.dtitle !== '' && <span className="require-message">{requiremessage.dtitle}</span>}
              {requiremessage.dtitle !== '' && <FormInput className="profile-detail-input" placeholder="Title" invalid autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={title} />}
              {requiremessage.dtitle === '' && <FormInput className="profile-detail-input" placeholder="Title" autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={title} />}
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Description</label>
              {requiremessage.description !== '' && <span className="require-message">{requiremessage.description}</span>}
              {requiremessage.description !== '' && <FormTextarea style={{ marginBottom: 20 }} className="profile-detail-desc profile-detail-input" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={description} />}
              {requiremessage.description === '' && <FormTextarea style={{ marginBottom: 20 }} className="profile-detail-desc profile-detail-input" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={description} />}
            </div>
            {opened &&
              <div className="content-center block-content-class modal-input-group-class" style={{ marginBottom: 20 }}>
                <label htmlFor="feEmail">Age limitation</label>
                <FormSelect id="feInputState" onChange={(e) => this.onChangeAgeLimitaton(e)}>
                  <option value={"18 and older"} >18 and older</option>
                  <option value={"1-17 years"} >1-17 years</option>
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
                hasSelectAll={true}
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
                  onChange={(e) => this.setSelectedStudents(e)}
                  labelledBy={"Select"}
                />
              </div>
            }
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
              value={day}
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
                    <div key={idx} style={{padding: "2px 8px", margin: "0px 8px", backgroundColor: "#04B5FA", borderRadius: "10px", display: "inline-block"}}>
                      <label style={{color: "white",fontSize: "14px", textTransform: "none", margin: "0px"}}>{file.name}</label>
                      <label value={idx} style={{color: "white", fontSize: "17px", fontWeight: "bold", margin: "0px", padding: "0px 3px"}} onClick={(evt)=>this.handleAttachmentsRemove(evt,idx)}>×</label>
                    </div>
                  )
                })}
              </>
            }
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