import React from "react";
import PropTypes from "prop-types";
import { Button } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"
import ReivewImage from "../../images/Review.jpg"

class SmallCard3 extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="small-card3">
        <div className="small-card3-desc">
          {/* <h6 className="video-upload-time no-margin">08/09/20 at 12:04pm</h6> */}
          <div style={{display: "flex", float: "left"}}>
            <img src={ReivewImage} className="small-card3-avatar" alt="avatar" />
            <div>
              <h6 className="small-card3-name">Kaylynn Curtis</h6>
              <div style={{display: "flex"}}>
                <p className="brainsshare-tag">Algebra</p>
                <p className="brainsshare-tag">Mathematics</p>
              </div>
            </div>
          </div>
          <Button className="btn-video-desc-more no-padding">
            <img src={MoreButtonImage} />
          </Button>
        </div>
        <div className="small-card3-date-time">
          <div style={{display: "flex", marginBottom: "5px"}}>
            <img src={Calendar} alt="Calendar" />
            <h6 style={{fontSize: "16px", paddingLeft: "10px"}} className="no-margin">
              08/14/20
            </h6>
          </div>
          <div style={{display: "flex", marginBottom: "5px"}}>
            <img src={Clock} alt="Clock" />
            <h6 style={{fontSize: "16px", paddingLeft: "10px"}} className="no-margin">
              11:30 am
            </h6>
          </div>
        </div>
      </div>
    );
  }
}

SmallCard3.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCard3.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCard3;