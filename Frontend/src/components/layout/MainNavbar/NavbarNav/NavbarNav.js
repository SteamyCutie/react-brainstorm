import React from "react";
import { Nav, NavbarBrand, Navbar } from "shards-react";
import PropTypes from "prop-types";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import UserType from "./UserType";

export default class NavbarNav extends React.Component {
  constructor(props) {
    super(props);
  }

  toggleType() {
    const { toggleType } = this.props;
    toggleType();
  }

  render() {
    const { filterType } = this.props;
    return (
      <Nav navbar className="flex-row">
        <UserType filterType={filterType} toggleType={() => this.toggleType()} />
        <Notifications />
        <UserActions />
      </Nav>
    );
  }
}

