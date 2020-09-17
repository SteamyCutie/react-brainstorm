import React from "react";
import { Modal, ModalBody, Button, FormInput, DatePicker, FormTextarea, FormSelect } from "shards-react";
import MultiSelect from "react-multi-select-component";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import LoadingModal from "./LoadingModal";
import { store } from 'react-notifications-component';
import { createforum, gettags } from '../../api/api';
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
        from: '00:00',
        to: '00:00',
        day: '2020-01-01'
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

  actionSave = async() => {
    const {requiremessage} = this.state;
    let temp = requiremessage;
    temp.dtitle = '';
    temp.description = '';
    this.setState({
      requiremessage: temp
    });
    try {
      this.setState({loading: true});
      const result = await createforum(this.state.foruminfo);
      if (result.data.result === "success") {
        this.toggle();
        this.showSuccess("Create Schedule Success");
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
          }
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  removeSession() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('user-type');
    localStorage.removeItem('ws');
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

  // setSelectedOptions = (e) => {
  //   const {selectedTags} = this.state;
  //   var temp = selectedTags;
  //   temp = e;
  //   this.setState({selectedTags: temp})
  // }

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
    const { selectedUsers, selectedTags, tags, foruminfo, requiremessage, displayday, loading } = this.state;
    const options = [
      { label: "Grapes 🍇", value: "grapes" },
      { label: "Mango 🥭", value: "mango" },
      { label: "Strawberry 🍓", value: "strawberry", disabled: true },
      { label: "Watermelon 🍉", value: "watermelon" },
      { label: "Pear 🍐", value: "pear" },
      { label: "Apple 🍎", value: "apple" },
      { label: "Tangerine 🍊", value: "tangerine" },
      { label: "Pineapple 🍍", value: "pineapple" },
      { label: "Peach 🍑", value: "peach" },
    ];
    return (
      <div>
        <ReactNotification />
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
            {requiremessage.ddescription !== '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={foruminfo.description}/>}
            {requiremessage.ddescription === '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={foruminfo.description}/>}
          </div>
          
          <div><label htmlFor="fePassword">Tags</label></div>
          <MultiSelect
            options={tags}
            value={selectedTags}
            onChange={(e) => this.setSelectedTags(e)}
            labelledBy={"Select"}
          />

          <div><label htmlFor="fePassword">Users</label></div>
          <MultiSelect
            options={options}
            value={selectedUsers}
            onChange={(e) => this.setSelectedOptions(e)}
            labelledBy={"Select"}
          />
          <div><label htmlFor="fePassword">Day</label></div>
          <DatePicker
            md="6"
            size="lg"
            selected={displayday}
            onChange={(e) => this.onChangeDay(e)}
            value={foruminfo.day}
            placeholderText="Select Date"
            dropdownMode="select"
            className="text-center"
          />
          <div><label htmlFor="fePassword">From~To</label></div>
          <FormSelect id="feInputState" className="col-md-5 available-time-input" onChange={(e) => this.onChangeFrom(e)}>
            {Timelinelist.map((item, idx) => {
              return (
                <option key={idx} value={item.value} >{item.str}</option>
              );
            })}
          </FormSelect>
          ~
          <FormSelect id="feInputState" className="col-md-5 available-time-input" onChange={(e) => this.onChangeTo(e)}>
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