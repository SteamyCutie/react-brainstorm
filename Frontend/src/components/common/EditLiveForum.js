import React from "react";
import { Modal, ModalBody, Button, FormInput,  FormCheckbox, DatePicker, FormTextarea, FormSelect } from "shards-react";
import ReactNotification from 'react-notifications-component';
import MultiSelect from "react-multi-select-component";
import LoadingModal from "./LoadingModal";
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { gettags, editforum, getforum } from '../../api/api';
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
        from: '',
        to: '',
        day: ''
      },
      tags: [],
      selectedTags: [],
      requiremessage: {
        dtitle: '',
        ddescription: '',
      },
    };
  }

  componentWillMount() {
    this.getAllTags();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && this.props.id != nextProps.id) {
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

  setSelectedTags = (e) => {
    const {selectedTags} = this.state;
    let temp = selectedTags;
    temp = e;
    this.setState({selectedTags: temp});
    
    if (e.length > 0) {
      let tag = e[e.length - 1].value.toString();
      const {foruminfo} = this.state;
      let temp1 = foruminfo;

      if (temp1.tags.indexOf(tag) === -1)    
        temp1.tags.push(tag);
      else {
        var index = temp1.tags.indexOf(tag);
        if (index > -1)
          temp1.tags.splice(index, 1);
      }
      this.setState({foruminfo: temp1});
    } else {
      const {foruminfo} = this.state;
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
      } else {
        this.showFail(result.data.message);
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        }
      }
    } catch(err) {
        this.showFail("Something Went wrong");
      }
  }

  actionEdit = async() => {
    const {requiremessage} = this.state;
    const {toggle_editsuccess, toggle_editfail} = this.props;
    let temp = requiremessage;
    temp.dtitle = '';
    temp.description = '';
    this.setState({
      requiremessage: temp
    });

    try {
      this.setState({loading: true});
      const result = await editforum(this.state.foruminfo);
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
          toggle_editfail("Edit Forum Fail");
          if (result.data.message === "Token is Expired") {
            this.removeSession();
            window.location.href = "/";
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
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('user-type');
    localStorage.removeItem('ws');
  }

  getSession = async(id) => {
    let {selectedTags} = this.state;
    try {
      const result = await getforum({id: id});
      if (result.data.result === "success") {
        const {foruminfo} = this.state;
        let temp = foruminfo;
        temp.tags = result.data.data.tags;
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

        let params = [];
        for (var i = 0; i < result.data.data.tags.length; i ++) {
          param.label = result.data.data.tags_name[i].trim();
          param.value = parseInt(result.data.data.tags[i].trim());
          params.push(param);
          param = {};
        }

        this.setState({selectedTags: params});

      } else {
        this.showFail(result.data.message);
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        }
      }
    } catch(err) {
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

  render() {
    const { open } = this.props;
    const { tags, selectedTags } = this.state;
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
                item.value == this.state.foruminfo.from ? <option key={idx} value={item.value} selected>{item.str}</option> : <option key={idx} value={item.value}>{item.str}</option>
              );
            })}
          </FormSelect>
          <FormSelect id="feInputState" className="col-md-6 available-time-input" onChange={(e) => this.onChangeTo(e)}>
            {Timelinelist.map((item, idx) => {
              return (
                item.value == this.state.foruminfo.to ? <option key={idx} value={item.value} selected>{item.str}</option> : <option key={idx} value={item.value}>{item.str}</option>
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