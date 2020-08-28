import React from "react";
import PropTypes from "prop-types";
import { Button } from "shards-react";

import ReivewImage from "../../images/Review.jpg"
import StarIcon from "../../images/star_icon.svg";

class Review extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="subscription-review">
        <div className="subscription-review-desc">
          <div style={{display: "flex", float: "left"}}>
            <img src={ReivewImage} className="subscription-review-avatar" alt="avatar" />
            <div>
              <h6 className="subscription-review-name">Kaylynn Curtis</h6>
              <h6 className="subscription-review-date">1 day ago</h6>
            </div>
          </div>
          <div className="review-score" style={{float: "right"}}>
            <img src={StarIcon} alt="star-icon" className="mentor-detail-score"/>
            <h6 style={{paddingTop: "10px", fontSize: "20px", fontWeight: "bold", color: "#333333"}}>4.8</h6>
          </div>
        </div>
        <div className="review-text">
            Lorem ipsum dolor sit amet, sollicitudin nec dapibus molestie risus eleifend augue, justo dui et est a pharetra, ut nullam gravida sed amet.
        </div>
      </div>
    );
  }
}

Review.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Review.defaultProps = {
  value: 0,
  label: "Label",
};

export default Review;
