import React from "react";
import { Nav } from "shards-react";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import UserType from "./UserType";

export default class NavbarNav extends React.Component {

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

