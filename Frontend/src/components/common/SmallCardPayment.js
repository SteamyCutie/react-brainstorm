import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Row, Col } from "shards-react";

class SmallCardPayment extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { title, content, image } = this.props;
    return (
      <Card small className="small-card2" >
        <CardBody className="no-padding">
          <Row>
            <Col xl="3" sm="3" className="small-card2-icon">
                <img src={image} />
            </Col>
            <Col xl="9" sm="9" className="small-card2-desc">
                <h4 className="small-card2-title no-margin">{title}</h4>
                <h6 className="small-card2-content no-margin">{content}</h6>
            </Col>
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
