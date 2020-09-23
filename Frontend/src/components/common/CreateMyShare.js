import React from "react";
import { Modal, ModalBody, Button, FormInput } from "shards-react";
import { uploadvideo, createshareinfo } from '../../api/api';
import {DropzoneArea} from 'material-ui-dropzone';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import LoadingModal from "./LoadingModal";

import Close from '../../images/Close.svg'

export default class CreateMyShare extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      loading: false,
      foruminfo: {
        title: "",
        description: "",
        email: "",
        media_url: "",
        media_type: "",
      },
      tags: [],
      requiremessage: {
        dtitle: "",
        ddescription: "",
      },
    };
  }

  componentWillMount() {
    const {foruminfo} = this.state;
    let temp = foruminfo;
    temp.email = localStorage.getItem('email');
    this.setState({foruminfo: temp});
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

  actionSave = async() => {
    const {requiremessage} = this.state;
    let temp = requiremessage;
    temp.dtitle = '';
    temp.ddescription = '';
    
    this.setState({
      requiremessage: temp
    });
    try {
      this.setState({loading: true});
      const result = await createshareinfo(this.state.foruminfo);
      if (result.data.result === "success") {
        this.toggle();
        this.showSuccess("Action Successful");
        window.location.reload();
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
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
          this.showFail(result.data.message);
          if (result.data.message === "Token is Expired") {
            this.removeSession();
            window.location.href = "/";
          } else {
            this.showFail(result.data.message);
          }
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
      this.toggle();
    };
  }

  removeSession() {
    localStorage.clear();
  }

  onChnageVideo = async(e) => {
    if (e[0] === null || e[0] === undefined)
      return;
    else {
      const formData = new FormData();
      formData.append('files[]', e[0]);
      try {
        this.setState({loading: true});
        const result = await uploadvideo(formData);
        if (result.data.result === "success") {
          const {foruminfo} = this.state;
          let temp = foruminfo;
          temp.media_url = result.data.data;
          this.setState({foruminfo: temp});
          this.showSuccess("Upload Video Success");
        } else {
          this.showFail();
        }
        this.setState({loading: false});
      } catch(err) {
        this.setState({loading: false});
        this.showFail();
      };
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

  showFail() {
    store.addNotification({
      title: "Fail",
      message: "Action Fail!",
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
    store.addNOtification({
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
    
    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Upload photo/video</h1>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Title</label>
            {this.state.requiremessage.dtitle !== '' && <span className="require-message">{this.state.requiremessage.dtitle}</span>}
            {this.state.requiremessage.dtitle !== '' && <FormInput className="profile-detail-input" type="text" placeholder="Title" autoFocus="1" invalid onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title}/>}
            {this.state.requiremessage.dtitle === '' && <FormInput className="profile-detail-input" type="text" placeholder="Title" autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title}/>}
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Description</label>
            {this.state.requiremessage.ddescription !== '' && <span className="require-message">{this.state.requiremessage.ddescription}</span>}
            {this.state.requiremessage.ddescription !== '' && <FormInput className="profile-detail-input" type="text" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description}/>}
            {this.state.requiremessage.ddescription === '' && <FormInput className="profile-detail-input" type="text" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description}/>}
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail">Photo/Video</label>
            <DropzoneArea acceptedFiles={['video/mp4']} onChange={(e) => this.onChnageVideo(e)}/>
          </div>
          <div className="content-center block-content-class button-text-group-class">
            <Button onClick={() => this.actionSave()}>Upload</Button>
          </div>
          </ModalBody>
        </Modal>
        {this.state.loading && <LoadingModal open={true} />}
      </div>
    );
  }
}