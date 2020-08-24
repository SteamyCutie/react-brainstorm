import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar, NavbarBrand } from "shards-react";

import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarToggle from "./NavbarToggle";

const MainNavbar = ({ layout, stickyTop }) => {
  const classes = classNames(
    "main-navbar",
    "bg-white",
    "main-nav-bar-class",
    stickyTop && "sticky-top"
  );

  return (
    <div className={classes}>
      <Container className="p-0 fix-position">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
          <NavbarSearch />
          <div className="sidebar-main-navbar-class">
            <Navbar
              className="align-items-stretch bg-white flex-md-nowrap border-bottom p-0"
              type="light"
            >
              <NavbarBrand
                className="w-100 mr-0"
                href="#"
                style={{ lineHeight: "25px" }}
              >
                <div className="d-table m-auto">
                  <img
                    id="main-logo"
                    className="d-inline-block align-top mr-1"
                    style={{ marginLeft: "30px" }}
                    src={require("../../../images/logo.svg")}
                    alt="Shards Dashboard"
                  />
                </div>
              </NavbarBrand>
            </Navbar>
          </div>
          <NavbarNav />
          <NavbarToggle />
        </Navbar>
      </Container>
    </div>
  );
};

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

MainNavbar.defaultProps = {
  stickyTop: true
};

export default MainNavbar;
