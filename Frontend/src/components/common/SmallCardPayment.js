import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Button } from "shards-react";

import MoreButtonImage from "../../images/more.svg"

class SmallCardPayment extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { title, image, expireDate, isPrimary } = this.props;
    return (
      <Card small className="small-card-payment" >
        <CardBody className="no-padding">
          <div className="items-container">
            <div className="no-padding">
                <img src={image} className="small-card-payment-logo" alt="card"/>
            </div>
            <div className="small-card-payment-desc">
                <h4 className="small-card-payment-title no-margin">{title}</h4>
                <h6 className="small-card-payment-expiredate no-margin">Expires: {expireDate}</h6>
            </div>
            <div className="no-padding">
              {
                isPrimary ?
                  <div className="small-card-payment-private">
                    Primary
                  </div>
                :
                null
              }
              <Button className="btn-payment-detail no-padding">
                <img src={MoreButtonImage} alt="more"/>
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

SmallCardPayment.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCardPayment.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCardPayment;
