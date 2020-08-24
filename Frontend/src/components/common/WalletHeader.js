import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Col, Button } from "shards-react";

const WalletHeader = ({ title, subtitle, className, ...attrs }) => {
  const classes = classNames(
    className,
    "text-center",
    "text-md-left",
    "mb-sm-0"
  );

  return (
    <Col xs="12" sm="12" className="wallet-page-header-class">
      <h3>{title}</h3>
      <Button>Add payment method</Button>
    </Col>
  )
};

WalletHeader.propTypes = {
  /**
   * The page title.
   */
  title: PropTypes.string,
  /**
   * The page subtitle.
   */
  subtitle: PropTypes.string
};

export default WalletHeader;
