import React from "react";
import { Modal, ModalBody, Button, FormInput,  FormCheckbox } from "shards-react";
import { createforum, gettags } from '../../api/api';

import Close from '../../images/Close.svg'

export default class CreateLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foruminfo: {
        title: "",
        description: "",
        email: "",
        tags: []
      },
      tags: []
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
        alert(result.data.message);
      }
    } catch(err) {
      alert(err);
    };
  }

  actionSave = async() => {
    try {
      const result = await createforum(this.state.foruminfo);
      if (result.data.result === "success") {
        
      } else {
        alert(result.data.message);
      }
    } catch(err) {
      alert(err);
    };
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
            <label htmlFor="feEmail">Title</label>
            <FormInput className="profile-detail-input" placeholder="Title" onChange={(e) => this.onChangeTitle(e)} value={this.state.foruminfo.title} />
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail">Description</label>
            <FormInput className="profile-detail-input" placeholder="Title" onChange={(e) => this.onChangeDescription(e)} value={this.state.foruminfo.description} />
          </div>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail">Tags</label>
            {this.state.tags.map((item, idx) => 
              <FormCheckbox className="mb-1" value={item.id} onChange={(e) => this.onChangeTags(e)}>{item.name}</FormCheckbox>
            )}
          </div>
          <div className="content-center block-content-class button-text-group-class">
            <Button onClick={() => this.actionSave()}>Save</Button>
          </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}