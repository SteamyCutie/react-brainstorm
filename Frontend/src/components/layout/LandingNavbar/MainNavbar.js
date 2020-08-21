import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar, Button } from "shards-react";

import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";
// import NavbarToggle from "./NavbarToggle";

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
          <Button theme="light" className="mb-2 mr-3 btn-landingpage white-background">
            Become a mentor
          </Button>
          <Button theme="light" className="mb-2 mr-3 btn-landingpage white-background">
            Find a mentor
          </Button>
          <Button theme="light" className="mb-2 mr-3 btn-landingpage white-background">
            Sign up
          </Button>
          <Button outline theme="primary" className="mb-2 mr-3 btn-landingpage btn-custom">
            Sign in
          </Button>
          {/* <NavbarNav /> */}
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
