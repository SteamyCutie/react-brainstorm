import React from "react";
import { Modal, ModalBody, Button, FormInput } from "shards-react";
import { uploadvideo, createshareinfo, signout } from '../../api/api';
import { DropzoneArea } from 'material-ui-dropzone';
import LoadingModal from "./LoadingModal";
import Close from '../../images/Close.svg';
import { ToastsStore } from 'react-toasts';

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
        description: "",
      },
    };
  }

  componentWillMount() {
    let { foruminfo } = this.state;
    foruminfo.email = localStorage.getItem('email');
    this.setState({ foruminfo });
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
    let { foruminfo } = this.state;
    foruminfo.title = e.target.value;
    this.setState({ foruminfo });
  }

  onChangeDescription = (e) => {
    let { foruminfo } = this.state;
    foruminfo.description = e.target.value;
    this.setState({ foruminfo });
  }

  actionSave = async () => {
    let { requiremessage } = this.state;
    requiremessage.dtitle = '';
    requiremessage.description = '';

    this.setState({
      requiremessage
    });
    try {
      this.setState({ loading: true });
      const result = await createshareinfo(this.state.foruminfo);
      if (result.data.result === "success") {
        this.toggle();
        ToastsStore.success("Action Successful");
        window.location.reload();
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
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
          ToastsStore.error(result.data.message);
          if (result.data.message === "Token is Expired") {
            ToastsStore.error(result.data.message);
            this.signout();
          } else if (result.data.message === "Token is Invalid") {
            ToastsStore.error(result.data.message);
            this.signout();
          } else if (result.data.message === "Authorization Token not found") {
            ToastsStore.error(result.data.message);
            this.signout();
          } else {
            ToastsStore.error(result.data.message);
          }
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
      this.toggle();
    };
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

  onChnageVideo = async (e) => {
    if (e[0] === null || e[0] === undefined)
      return;
    else {
      const formData = new FormData();
      formData.append('files[]', e[0]);
      try {
        this.setState({ loading: true });
        const result = await uploadvideo(formData);
        if (result.data.result === "success") {
          let { foruminfo } = this.state;
          foruminfo.media_url = result.data.data;
          foruminfo.media_type = result.data.mimetype;
          this.setState({ foruminfo});
          ToastsStore.success("Upload Video Success");
        } else {
          ToastsStore.error();
        }
        this.setState({ loading: false });
      } catch (err) {
        this.setState({ loading: false });
        ToastsStore.error();
      };
    }
  }

  render() {
    const { open } = this.props;

    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Upload video</h1>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Title</label>
              {this.state.requiremessage.dtitle !== '' && <span className="require-message">{this.state.requiremessage.dtitle}</span>}
              {this.state.requiremessage.dtitle !== '' && <FormInput className="profile-detail-input" type="text" placeholder="Title" autoFocus="1" invalid onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title} />}
              {this.state.requiremessage.dtitle === '' && <FormInput className="profile-detail-input" type="text" placeholder="Title" autoFocus="1" onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title} />}
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Description</label>
              {this.state.requiremessage.description !== '' && <span className="require-message">{this.state.requiremessage.description}</span>}
              {this.state.requiremessage.description !== '' && <FormInput className="profile-detail-input" type="text" placeholder="Description" invalid onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description} />}
              {this.state.requiremessage.description === '' && <FormInput className="profile-detail-input" type="text" placeholder="Description" onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description} />}
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Video</label>
              <DropzoneArea onChange={(e) => this.onChnageVideo(e)} maxFileSize={300000000} />
            </div>
            {/* <div className="content-center block-content-class button-text-group-class"> */}
            <div className={JSON.parse(localStorage.getItem('user-type')) ? "content-center block-content-class button-text-group-class-mentor" : "content-center block-content-class button-text-group-class"}>
              <Button onClick={() => this.actionSave()}>Upload</Button>
            </div>
          </ModalBody>
        </Modal>
        {this.state.loading && <LoadingModal open={true} />}
      </div>
    );
  }
}