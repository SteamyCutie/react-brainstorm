import React from "react";
import PropTypes from "prop-types";

import StarIcon from "../../images/star_icon.svg";

class Review extends React.Component {

  componentWillMount() {
  }

  render() {
    const {item} = this.props;
    return (
      <div className="subscription-review">
        <div className="subscription-review-desc">
          <div style={{display: "flex", float: "left"}}>
            <img src={item.student.avatar} className="subscription-review-avatar" alt="avatar" />
            <div>
              <h6 className="subscription-review-name">{item.student.name}</h6>
              <h6 className="subscription-review-date">{item.review.day_diff} day ago</h6>
            </div>
          </div>
          <div className="review-score" style={{float: "right"}}>
            <img src={StarIcon} alt="star-icon" className="mentor-detail-score"/>
            <h6 style={{paddingTop: "10px", fontSize: "20px", fontWeight: "bold", color: "#333333"}}>{item.review.mark}</h6>
          </div>
        </div>
        <div className="review-text">
          {item.review.review}
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
