import React from "react";
import PropTypes from "prop-types";
import { Col, Button } from "shards-react";

const WalletHeader = ({ title, subtitle, className, flag, ...attrs }) => {
  return (
    <Col xs="12" sm="12" className="wallet-page-header-class">
      <h3>{title}</h3>
      {flag && <Button className="btn-add-payment">Add payment method</Button>}
    </Col>
  )
};

WalletHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  flag: PropTypes.bool
};

export default WalletHeader;
