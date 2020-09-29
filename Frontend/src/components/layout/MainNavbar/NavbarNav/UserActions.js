import React from "react";
import { Link } from "react-router-dom";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { getuserinfo } from '../../../../api/api';
import defaultAvatar from "../../../../images/avatar.jpg"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "shards-react";

export default class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: '',
      open: false
    };

    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    this.getUserInformation();
    // this.setState({avatar: localStorage.getItem('avatar')});
  }

  getUserInformation = async() => {
    try {
      const result = await getuserinfo({email: localStorage.getItem('email')});
      if (result.data.result === "success") {
        this.setState({avatar: result.data.data.avatar});
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.messasge);
          this.removeSession();
          window.location.href = "/";
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
          this.removeSession();
          window.location.href = "/";
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
    } catch(err) {
      this.showFail("Something Went wrong");
    };
  }

  toggle() {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  }

  logout() {
    localStorage.removeItem('email');
    window.location.href = "/";
  }

  removeSession() {
    localStorage.clear();
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
    const { avatar, open } = this.state;
    return (
      <>
        <ReactNotification />
        <Dropdown open={open} toggle={this.toggle}>
          <DropdownToggle>
            {avatar && <img className="user-avatar rounded-circle mr-2" src={avatar} alt="User Avatar" style={{height: '2.5rem'}} />}
            {!avatar && <img className="user-avatar rounded-circle mr-2" src={defaultAvatar} alt="User Avatar" style={{height: '2.5rem'}} />}
            {" "}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem tag={Link} to="profile">
              <i className="material-icons">&#xE7FD;</i> Profile
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem className="text-danger" onClick={() => this.logout()}>
              <i className="material-icons text-danger">&#xE879;</i> Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </>
    );
  }
}
