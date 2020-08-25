import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar, Button, DropdownToggle, DropdownMenu, DropdownItem, Dropdown } from "shards-react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { createBrowserHistory as history} from 'history';
import NavbarSearch from "./NavbarSearch";
import NavbarDropdown from "./NavbarDropdown";

import projectLogo from '../../../images/logo.svg'

const MainNavbar = ({ layout, stickyTop }) => {
  const classes = classNames(
    "main-navbar",
    "bg-white",
    stickyTop && "sticky-top"
  );

  return (
    <div className={classes}>
      <Container className="p-0 fix-position">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
          <img
            alt="Project logo"
            src={projectLogo}
            className="logo-image"
          />
          <NavbarSearch />
          <div className="btn-group-header">
            <Button theme="light" className="mb-2 white-background btn-landingpage" style={{boxShadow: "none !important" }}>
              Become a mentor
            </Button>
            <Button theme="light" className="mb-2 btn-landingpage white-background">
              Find a mentor
            </Button>
            <Button theme="light" className="mb-2 btn-landingpage white-background">
              Sign up
            </Button>
            <Link to="/wallet">
              <Button outline theme="primary" className="mb-2 btn-landingpage btn-custom">
                Sign in
              </Button>
            </Link>
          </div>
          <div className="btn-dropdown-header">
            <NavbarDropdown />
          </div>
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
