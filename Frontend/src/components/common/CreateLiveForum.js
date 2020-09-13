import React from "react";
import { Modal, ModalBody, Button, FormInput,  FormCheckbox, DatePicker } from "shards-react";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { createforum, gettags } from '../../api/api';

import Close from '../../images/Close.svg'

export default class CreateLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayfrom: '',
      displayto: '',
      foruminfo: {
        title: "",
        description: "",
        email: "",
        tags: [],
        from: '',
        to: '',
      },
      tags: [],
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
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();
  }

  onChangeTitle = (e) => {
    const {foruminfo} = this.state;
    let temp = foruminfo;
    temp.title = e.target.value;
    this.setState({foruminfo: temp});
  }

  onChangeDescription = (e) => {
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
    console.log(this.state.foruminfo);
  }

  getAllTags = async() => {
    try {
      const result = await gettags();
      if (result.data.result === "success") {
        this.setState({tags: result.data.data});
        console.log(this.state);
      } else {
        this.showFail(result.data.message);
      }
    } catch(err) {
      this.showFail(err);
    };
  }

  actionSave = async() => {
    const {requiremessage} = this.state;
    let temp = requiremessage;
    temp.dtitle = '';
    temp.description = '';
    this.setState({
      requiremessage: temp
    });
    try {
      const result = await createforum(this.state.foruminfo);
      if (result.data.result === "success") {
        this.toggle();
        this.showSuccess("Create Schedule Success");
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
      }
    } catch(err) {
      this.showFail("Create Schedule Fail");
    };
  }

  onChangeFrom = (e) => {
    const {foruminfo} = this.state;
    let temp = foruminfo;
    let date = new Date(e);
    let displayfrom = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    temp.from = displayfrom;
    this.setState({foruminfo: temp});
    this.setState({displayfrom: date});
  };

  onChangeTo = (e) => {
    const {foruminfo} = this.state;
    let temp = foruminfo;
    let date = new Date(e);
    let displayto = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    temp.to = displayto;
    this.setState({foruminfo: temp});
    this.setState({displayto: date});
  };

  onTimeChange(time) {
    console.log(time);
    this.setState({time});
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
        <Modal open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Input Information</h1>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Title</label>
            {this.state.requiremessage.dtitle != '' && <span className="require-message">{this.state.requiremessage.dtitle}</span>}
            {this.state.requiremessage.dtitle != '' && <FormInput className="profile-detail-input" placeholder="Title" invalid onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title}/>}
            {this.state.requiremessage.dtitle == '' && <FormInput className="profile-detail-input" placeholder="Title" onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title}/>}
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Description</label>
            {this.state.requiremessage.ddescription != '' && <span className="require-message">{this.state.requiremessage.ddescription}</span>}
            {this.state.requiremessage.ddescription != '' && <FormInput className="profile-detail-input" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description}/>}
            {this.state.requiremessage.ddescription == '' && <FormInput className="profile-detail-input" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description}/>}
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail">Tags</label>
            {this.state.tags.map((item, idx) => 
              <FormCheckbox className="mb-1" value={item.id} onChange={(e) => this.onChangeTags(e)}>{item.name}</FormCheckbox>
            )}
          </div>
          <div><label htmlFor="fePassword">From</label></div>
          <DatePicker
            md="6"
            size="lg"
            selected={this.state.displayfrom}
            onChange={(e) => this.onChangeFrom(e)}
            value={this.state.foruminfo.from}
            placeholderText="Select Date"
            dropdownMode="select"
            className="text-center"
          />
          <div><label htmlFor="fePassword">To</label></div>
          <DatePicker
            md="6"
            size="lg"
            selected={this.state.displayto}
            onChange={(e) => this.onChangeTo(e)}
            value={this.state.foruminfo.to}
            placeholderText="To"
            dropdownMode="select"
            className="text-center"
          />
          <div className="content-center block-content-class button-text-group-class">
            <Button onClick={() => this.actionSave()}>Save</Button>
          </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}