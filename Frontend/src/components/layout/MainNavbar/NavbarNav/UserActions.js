import React from "react";
import { Link } from "react-router-dom";
import { getuserinfo } from '../../../../api/api';
import avatar from "../../../../images/avatar.jpg"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
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
  }

  getUserInformation = async() => {
    try {
      
      const result = await getuserinfo({email: localStorage.getItem('email')});
      if (result.data.result == "success") {
        this.setState({avatar: result.data.data.avatar});
      } else {
        this.showFail();
      }
    } catch(err) {
      
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

  render() {
    return (
      <Dropdown open={this.state.open} toggle={this.toggle}>
        <DropdownToggle>
          {this.state.avatar && <img className="user-avatar rounded-circle mr-2" src={this.state.avatar} alt="User Avatar" style={{height: '2.5rem'}} />}
          {!this.state.avatar && <img className="user-avatar rounded-circle mr-2" src={avatar} alt="User Avatar" style={{height: '2.5rem'}} />}
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
    );
  }
}
