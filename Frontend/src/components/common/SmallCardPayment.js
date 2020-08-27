import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Row, Col, Button } from "shards-react";

class SmallCardPayment extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { title, content, image, expireDate } = this.props;
    return (
      <Card small className="small-card-payment" >
        <CardBody className="no-padding">
          <Row>
            <Col xl="2" sm="2" className="no-padding">
                <img src={image} className="small-card-payment-logo" />
            </Col>
            <Col xl="10" sm="10" className="small-card-payment-desc">
                <h4 className="small-card-payment-title no-margin">{title}</h4>
                <h6 className="small-card-payment-expiredate no-margin">Expires: {expireDate}</h6>
            </Col>
            {/* <Col xl="2" sm="2" className="no-padding">
                <div className="small-card-payment-private">
                  Primary
                </div>
                <Button>
                  111
                </Button>
            </Col> */}
          </Row>
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
