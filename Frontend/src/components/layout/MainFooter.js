import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "shards-react";

import logo from "../../images/logo.svg"
import twitterIcon from "../../images/icon-twitter.svg"
import facebookIcon from "../../images/icon-facebook.svg"
import youtubeIcon from "../../images/icon-youtube.svg"

const MainFooter = () => (
  <footer className="main-footer p-2 px-3 bg-white">
      <Row className="footer-main-part">
        <Col>
          <img
            className="footer-logo"
            src={logo}
            alt="logo"
          />

        </Col>
        <Col>
          <Row><a className="footer-link" href="/#">Become a mentor</a></Row>
          <Row><a className="footer-link" href="/#">Find a mentor</a></Row>
          <Row><a className="footer-link" href="/#">Sign in</a></Row>
          <Row><a className="footer-link" href="/#">Sign up</a></Row>
        </Col>
        <Col>
          <Row><a className="footer-link" href="/#">User Regulations</a></Row>
          <Row><a className="footer-link" href="/#">Mentor's Regulations</a></Row>
          <Row><a className="footer-link" href="/#">Privacy Policy</a></Row>
        </Col>
        <Col className="external-site-icon">
          <a href="http://www.facebook.com"><img src={facebookIcon} className="footer-icon" alt="facebook"/></a>
          <a href="http://www.twitter.com"><img src={twitterIcon} className="footer-icon" alt="twitter"/></a>
          <a href="http://www.youtube.com"><img src={youtubeIcon} className="footer-icon" alt="youtube"/></a>
        </Col>
      </Row>
      <Row className="copy-right-txt center">
        Copyright © 2020 Brainshare
      </Row>
  </footer>
);

MainFooter.propTypes = {
  /**
   * Whether the content is contained, or not.
   */
  contained: PropTypes.bool,
  /**
   * The menu items array.
   */
  menuItems: PropTypes.array,
  /**
   * The copyright info.
   */
  copyright: PropTypes.string
};

MainFooter.defaultProps = {
  contained: false,
  copyright: "Copyright © 2018 DesignRevision",
  menuItems: [
    {
      title: "Home",
      to: "#"
    },
    {
      title: "Services",
      to: "#"
    },
    {
      title: "About",
      to: "#"
    },
    {
      title: "Products",
      to: "#"
    },
    {
      title: "Blog",
      to: "#"
    }
  ]
};

export default MainFooter;
