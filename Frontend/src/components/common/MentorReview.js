import React from "react";
import { Modal, ModalBody, Button, FormInput,  FormCheckbox, DatePicker, FormTextarea, FormSelect } from "shards-react";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import LoadingModal from "./LoadingModal";
import { store } from 'react-notifications-component';
import Rating from '@material-ui/lab/Rating';
import { createforum, gettags } from '../../api/api';

import Close from '../../images/Close.svg'

export default class MentorReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      reviewinfo: {
        review: "",
        mark: 0,
        email: localStorage.getItem('email'),
        mentor_id: ''
      },
      requiremessage: {
        dreview: '',
      },
    };
  }

  componentWillMount() {
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();
  }

  onChangeReview = (e) => {
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
    const {reviewinfo} = this.state;
    let temp = reviewinfo;
    temp.review = e.target.value;
    this.setState({reviewinfo: temp});
  }

  onChangeMark = (e, val) => {
    if (val == null)
      val = 0;
    const {reviewinfo} = this.state;
    let temp = reviewinfo;
    temp.mark = val;
    this.setState({reviewinfo: temp});
  }

  actionSave = async(mentorid) => {
    const {reviewinfo} = this.state;
    reviewinfo.mentor_id = mentorid;
    // const {requiremessage} = this.state;
    // let temp = requiremessage;
    // temp.dreview = '';
    // this.setState({
    //   requiremessage: temp
    // });
    // try {
    //   this.setState({loading: true});
    //   const result = await createforum(this.state.foruminfo);
    //   if (result.data.result === "success") {
    //     this.toggle();
    //     this.showSuccess("Review Success");
    //     window.location.href = "/scheduleLiveForum";
    //   } else {
    //     if (result.data.type === 'require') {
    //       const {requiremessage} = this.state;
    //       let temp = requiremessage;
    //       if (result.data.message.title) {
    //         temp.dtitle = result.data.message.title[0];
    //       }
    //       if (result.data.message.description) {
    //         temp.ddescription = result.data.message.description[0];
    //       }
    //       this.setState({
    //         requiremessage: temp
    //       });
    //     } else {
    //       if (result.data.message === "Token is Expired") {
    //         this.removeSession();
    //         window.location.href = "/";
    //       }
    //     }
    //   }
    //   this.setState({loading: false});
    // } catch(err) {
    //   this.setState({loading: false});
    //   this.showFail("Something Went wrong");
    // };
  }

  removeSession() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('user-type');
    localStorage.removeItem('ws');
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
    const { open, mentorid } = this.props;
    return (
      <div>
        <ReactNotification />
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
          <h1 className="content-center modal-header-class">Review Mentor</h1>
          <div className="content-center block-content-class modal-input-group-class">
            <label htmlFor="feEmail" className="profile-detail-important">Review</label>
            {this.state.requiremessage.dreview !== '' && <span className="require-message">{this.state.requiremessage.dreview}</span>}
            {this.state.requiremessage.dreview !== '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Review" autoFocus="1" invalid onChange={(e) => this.onChangeReview(e)} value={this.state.reviewinfo.review}/>}
            {this.state.requiremessage.dreview === '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Review" autoFocus="1" onChange={(e) => this.onChangeReview(e)} value={this.state.reviewinfo.review}/>}
          </div>
          <Rating name="size-large" defaultValue={0} size="large" onChange={(e, newValue) => this.onChangeMark(e, newValue)}/>
          <div className="content-center block-content-class button-text-group-class">
            <Button onClick={() => this.actionSave(mentorid)}>Save</Button>
          </div>
          </ModalBody>
        </Modal>
        {this.state.loading && <LoadingModal open={true} />}
      </div>
    );
  }
}