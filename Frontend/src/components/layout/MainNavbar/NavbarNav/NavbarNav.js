import React from "react";
import { Nav, NavbarBrand, Navbar } from "shards-react";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import UserType from "./UserType";

export default () => (
  <Nav navbar className="flex-row">
    {/* <UserType /> */}
    <Notifications />
    <UserActions />
  </Nav>
);
