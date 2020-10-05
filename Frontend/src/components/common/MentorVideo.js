import React from "react";
import PropTypes from "prop-types";
import { Player } from 'video-react';
import BookmarkBorder from '@material-ui/icons/BookmarkBorder';
import OutlinedFlag from '@material-ui/icons/OutlinedFlag';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "shards-react";
import LoadingModal from "../../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import "video-react/dist/video-react.css";
import { addlibrary, addreport, signout } from '../../api/api';
import background from "../../images/background.jpeg"
import MoreButtonImage from "../../images/more.svg"

class MentorVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      open: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
  }

  toggle() {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  }

  actionSave = async(mentor_id, media_url) => {
    let param = {
      mentor_id: mentor_id,
      media_url: media_url,
      student_id: parseInt(localStorage.getItem('user_id'))
    };
    try {
      this.setState({loading: true});
      const result = await addlibrary(param);
      if (result.data.result === "success") {
        this.showSuccess("Add Library Successful");
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
          this.signout();
        } else {
          this.showFail(result.data.message);
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  actionReport = async(mentor_id, media_url) => {
    let param = {
      mentor_id: mentor_id,
      media_url: media_url,
      student_id: parseInt(localStorage.getItem('user_id'))
    };
    try {
      this.setState({loading: true});
      const result = await addreport(param);
      if (result.data.result === "success") {
        this.showSuccess("Post Library Successful");
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
          this.signout();
        } else {
          this.showFail(result.data.message);
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  signout = async() => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        this.removeSession();
      } else if (result.data.result === "warning") {

      } else {
        if (result.data.message === "Token is Expired") {
          
        } else if (result.data.message === "Token is Invalid") {
          
        } else if (result.data.message === "Authorization Token not found") {
          
        } else {
        }
      }
    } catch(error) {

    }
  }

  removeSession() {
    localStorage.clear();
    window.location.href = "/";
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

  showWarning(text) {
    store.addNotification({
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
    const { description, media_url, day, time, id, user_id } = this.props.item;
    const { open, loading } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <div className="mentor-desc-video">
          <div className="mentor-desc-video-header">
            <h6 className="video-upload-time no-margin">{day} at {time}</h6>
            <Dropdown open={open} toggle={this.toggle} className="mentor-video-style">
              <DropdownToggle>
                <div className="nav-link-icon__wrapper">
                  <img
                    className="user-avatar mr-2"
                    src={MoreButtonImage}
                    alt="User Avatar"
                  />{" "}
                </div>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => this.actionSave(user_id, media_url)}>
                  <BookmarkBorder></BookmarkBorder>Save
                </DropdownItem>
                <DropdownItem onClick={() => this.actionReport(user_id, media_url)}>
                  <OutlinedFlag></OutlinedFlag>Report
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div>
            <h6 className="mentor-desc-video-detail no-margin">
              {description}
            </h6>
          </div>
          <div>
            <Player
                playsInline
                poster={background}
                src={media_url}
              />
          </div>
        </div>
      </>
    );
  }
}

MentorVideo.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

MentorVideo.defaultProps = {
  value: 0,
  label: "Label",
};

export default MentorVideo;
