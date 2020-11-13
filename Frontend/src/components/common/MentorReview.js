import React from "react";
import { Modal, ModalBody, Button, FormTextarea } from "shards-react";
import LoadingModal from "./LoadingModal";
import Rating from '@material-ui/lab/Rating';
import { setreview, signout } from '../../api/api';
import Close from '../../images/Close.svg';
import { ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';

class MentorReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      reviewinfo: {
        review: "",
        mark: 0,
        email: localStorage.getItem('email'),
        mentor_id: '',
        session_id: 1
      },
      requiremessage: {
        dreview: '',
      },
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    console.log(this.props.session, "#34");
  }

  toggle() {
    const { toggle } = this.props;
    toggle();
  }

  onChangeReview = (e) => {
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
    const { reviewinfo } = this.state;
    let temp = reviewinfo;
    temp.review = e.target.value;
    this.setState({ reviewinfo: temp });
  }

  onChangeMark = (e, val) => {
    if (val == null)
      val = 0;
    const { reviewinfo } = this.state;
    let temp = reviewinfo;
    temp.mark = val;
    this.setState({ reviewinfo: temp });
  }

  actionSave = async (mentorid) => {
    const { reviewinfo } = this.state;
    reviewinfo.mentor_id = mentorid;
    reviewinfo.session_id = this.props.session.id;
    reviewinfo.conference_time = this.props.sessionTime;
    reviewinfo.email = localStorage.getItem('email');
    const { requiremessage } = this.state;
    let temp = requiremessage;
    temp.dreview = '';
    this.setState({
      requiremessage: temp
    });
    try {
      this.setState({ loading: true });
      const result = await setreview(reviewinfo);
      if (result.data.result === "success") {
        this.toggle();
        ToastsStore.success("Review Success");
        this.props.history.push('/trending');
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.type === 'require') {
          const { requiremessage } = this.state;
          let temp = requiremessage;
          if (result.data.message.review) {
            temp.dreview = result.data.message.review[0];
          }
          this.setState({
            requiremessage: temp
          });
        } else {
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

  render() {
    const { open, sessionTime } = this.props;
    const { user_id, name } = this.props.session;
    const { requiremessage, reviewinfo, loading } = this.state;
    return (
      <div>
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Review mentor {name}</h1>
            <h1 className="content-center modal-header-class">{sessionTime}</h1>
            <Rating name="size-large" defaultValue={0} size="large" onChange={(e, newValue) => this.onChangeMark(e, newValue)} />
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail" className="profile-detail-important">Review</label>
              {requiremessage.dreview !== '' && <span className="require-message">{requiremessage.dreview}</span>}
              {requiremessage.dreview !== '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Review" autoFocus="1" invalid onChange={(e) => this.onChangeReview(e)} value={reviewinfo.review} />}
              {requiremessage.dreview === '' && <FormTextarea className="profile-detail-desc profile-detail-input" placeholder="Review" autoFocus="1" onChange={(e) => this.onChangeReview(e)} value={reviewinfo.review} />}
            </div>
            <div className="content-center block-content-class button-text-group-class">
              <Button onClick={() => this.actionSave(user_id)}>Save</Button>
            </div>
          </ModalBody>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}

export default withRouter(MentorReview);