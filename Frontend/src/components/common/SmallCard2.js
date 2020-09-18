import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Row, Col } from "shards-react";

class SmallCard2 extends React.Component {
  
  componentWillMount() {
  }

  render() {
    const { title, content, image } = this.props;
    return (
      <Card small className="small-card2" >
        <CardBody className="no-padding">
          <Row>
            <Col xl="3" sm="3" className="small-card2-icon">
                <img src={image} alt="category icon"/>
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

SmallCard2.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCard2.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCard2;
