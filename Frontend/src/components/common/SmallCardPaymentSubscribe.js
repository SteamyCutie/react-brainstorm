import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, FormRadio } from "shards-react";

import MoreButtonImage from "../../images/more.svg"

class SmallCardPaymentSubscribe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCard: null
    };

    this.changeCard = this.changeCard.bind(this);
  }

  componentDidMount() {
  }

  changeCard(type) {
    console.log(type);
    this.setState({
      selectedCard: type
    });
  }

  render() {
    const { title, image, expireDate, isPrimary, type } = this.props;
    return (
      <Card small className="small-card-payment" >
        <CardBody className="no-padding">
          <div className="items-container">
            <div  style={{marginTop: "15px", paddingLeft: "10px"}}>
              <FormRadio name="fruit" checked={this.state.selectedCard == type} onChange={() => { this.changeCard(type) }}></FormRadio>
            </div>
            <div className="no-padding">
                <img src={image} className="small-card-payment-logo" alt="card"/>
            </div>
            <div className="small-card-payment-desc">
                <h4 className="small-card-payment-title no-margin">{title}</h4>
                <h6 className="small-card-payment-expiredate no-margin">Expires: {expireDate}</h6>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

SmallCardPaymentSubscribe.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCardPaymentSubscribe.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCardPaymentSubscribe;
