import React from "react";
import PropTypes from "prop-types";
import { Container} from "shards-react";

const ExtraPageLayout = ({ children}) => (
  <Container fluid>
        {children}
  </Container>
);

ExtraPageLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

ExtraPageLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default ExtraPageLayout;
