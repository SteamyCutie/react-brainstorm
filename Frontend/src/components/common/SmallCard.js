import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "shards-react";

class SmallCard extends React.Component {

  componentWillMount() {
  }

  render() {
    const { label, value } = this.props;
    return (
      <Card small className="small-card-class no-box-shadow" >
        <CardBody >
          <div >
            <div className="small-card-content-class">
              <h6 className="small-card-value-class">{value}</h6>
              <span className="small-card-label-class">{label}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

SmallCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCard.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCard;
