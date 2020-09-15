import React from "react";
import { Modal, ModalBody, Button, FormInput,  FormCheckbox, DatePicker, FormTextarea, FormSelect } from "shards-react";
import ReactNotification from 'react-notifications-component';
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
      requiremessage: {
        dtitle: '',
        ddescription: '',
      },
    };
  }

  componentWillMount() {
    this.getAllTags();
    this.getSession(this.props.id);
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

  onChangeTags = (e) => {
    const {foruminfo} = this.state;
    let temp = foruminfo;
    if (temp.tags.indexOf(e.target.value) === -1)    
      temp.tags.push(e.target.value);
    else {
      var index = temp.tags.indexOf(e.target.value);
      if (index > -1)
        temp.tags.splice(index, 1);
    }
    this.setState({foruminfo: temp});
  }

  getAllTags = async() => {
    try {
      const result = await gettags();
      if (result.data.result === "success") {
        this.setState({tags: result.data.data});
      } else {
        this.showFail(result.data.message);
      }
    } catch(err) {
        this.showFail(err);
      }
  }

  getSession = async(id) => {
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
      } else {
        this.showFail(result.data.message);
      }
    } catch(err) {
      this.showFail(err);
    }
  }

  actionEdit = async() => {
    const {requiremessage} = this.state;
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
        this.showSuccess("Edit Schedule Success");
        window.location.href = "/scheduleLiveForum";
      } else {
        if (result.data.type == 'require') {
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
        }
        this.showFail("Create Schedule Fail");
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Create Schedule Fail");
    };
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
    return (
      <div>
        <Modal size="lg" open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Schedule live forum Information</h1>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Title</label>
            {this.state.requiremessage.dtitle != '' && <span className="require-message">{this.state.requiremessage.dtitle}</span>}
            {this.state.requiremessage.dtitle != '' && <FormInput className="profile-detail-input" placeholder="Title" invalid onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title}/>}
            {this.state.requiremessage.dtitle == '' && <FormInput className="profile-detail-input" placeholder="Title" onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title}/>}
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Description</label>
            {this.state.requiremessage.ddescription != '' && <span className="require-message">{this.state.requiremessage.ddescription}</span>}
            {this.state.requiremessage.ddescription != '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description}/>}
            {this.state.requiremessage.ddescription == '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description}/>}
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail">Tags</label><br></br>
            {this.state.tags.map((item, idx) => {
              var index = this.state.foruminfo.tags.findIndex((value) => item.id == value)
              return index > -1 ? <FormCheckbox inline className="col-md-5 col-lg-5 col-xs-5" checked value={this.state.foruminfo.tags[index]} onChange={(e) => this.onChangeTags(e)}>{item.name}</FormCheckbox> : 
                <FormCheckbox inline className="col-md-5 col-lg-5 col-xs-5" value={item.id} onChange={(e) => this.onChangeTags(e)}>{item.name}</FormCheckbox>;
            })}
          </div>
          <div><label htmlFor="fePassword">From</label></div>
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
          <div><label htmlFor="fePassword">From~To</label></div>
          <FormSelect id="feInputState" className="col-md-5 available-time-input" onChange={(e) => this.onChangeFrom(e)}>
            {Timelinelist.map((item, idx) => {
              return (
                item.value == this.state.foruminfo.from ? <option value={item.value} selected>{item.str}</option> : <option value={item.value}>{item.str}</option>
              );
            })}
          </FormSelect>
          ~
          <FormSelect id="feInputState" className="col-md-5 available-time-input" onChange={(e) => this.onChangeTo(e)}>
            {Timelinelist.map((item, idx) => {
              return (
                item.value == this.state.foruminfo.to ? <option value={item.value} selected>{item.str}</option> : <option value={item.value}>{item.str}</option>
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