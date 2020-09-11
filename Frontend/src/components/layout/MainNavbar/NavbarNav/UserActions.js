import React from "react";
import { Link } from "react-router-dom";
import { getuserinfo } from '../../../../api/api';
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
      visible: false
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
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


  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  logout() {
    localStorage.removeItem('email');
    window.location.href = "/";
  }

  render() {
    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
        <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
          <img
            className="user-avatar rounded-circle mr-2"
            src={this.state.avatar}
            alt="User Avatar"
            style={{height: '2.5rem'}}
          />{" "}
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={this.state.visible}>
          <DropdownItem tag={Link} to="profile">
            <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem className="text-danger" onClick={() => this.logout()}>
            <i className="material-icons text-danger">&#xE879;</i> Logout
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}
