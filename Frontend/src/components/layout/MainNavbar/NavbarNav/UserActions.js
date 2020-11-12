import React from "react";
import { Link } from "react-router-dom";
import { getuserinfo, signout } from '../../../../api/api';
import defaultAvatar from "../../../../images/avatar.jpg";
import { ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "shards-react";

class UserActions extends React.Component {
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

  getUserInformation = async () => {
    try {
      const result = await getuserinfo({ email: localStorage.getItem('email') });
      if (result.data.result === "success") {
        this.setState({ avatar: result.data.data.avatar });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.messasge);
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
    } catch (err) {
      ToastsStore.error("Something Went wrong");
    };
  }

  toggle() {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
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
    this.props.history.push('/');
  }

  render() {
    const { avatar, open } = this.state;
    return (
      <>
        <Dropdown open={open} toggle={this.toggle}>
          <DropdownToggle>
            {avatar && <img className="user-avatar rounded-circle mr-2" src={avatar} alt="User Avatar" style={{ height: '2.5rem' }} />}
            {!avatar && <img className="user-avatar rounded-circle mr-2" src={defaultAvatar} alt="User Avatar" style={{ height: '2.5rem' }} />}
            {" "}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem tag={Link} to="profile">
              <i className="material-icons">&#xE7FD;</i> Profile
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem className="text-danger" onClick={() => this.signout()}>
              <i className="material-icons text-danger">&#xE879;</i> Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </>
    );
  }
}

export default withRouter(UserActions);