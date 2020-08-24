import React from "react";
import { ButtonGroup, Button } from "shards-react";
import PropTypes from "prop-types";

import "../../assets/landingpage.css"

const CarouselComponent = ({compData}) => (
  <div className="123">
    {compData}
  </div>
);

CarouselComponent.propTypes = {
  compData: PropTypes.string
};

CarouselComponent.defaultProps = {
};

export default CarouselComponent;
