import React from "react";
import PropTypes from "prop-types";
import { Col, Button } from "shards-react";

const WalletHeader = ({ title, subtitle, className, flag, click_add, ...attrs }) => {
  return (
    <Col xs="12" sm="12" className="wallet-page-header-class">
      <h3>{title}</h3>
      {/* {flag && <Button className="btn-add-payment-mentor" onClick={click_add()}>Add payment method</Button>} */}
      {flag && <Button className="btn-add-payment-mentor">Add payment method</Button>}
    </Col>
  )
};

WalletHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  flag: PropTypes.bool,
  // click_add: PropTypes.any
};

export default WalletHeader;
