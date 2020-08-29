import React from "react";
import PropTypes from "prop-types";
import { Button } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"
import ReivewImage from "../../images/Review.jpg"

import avatar1 from "../../images/forum-avatar1.jpg"
import avatar2 from "../../images/forum-avatar2.jpg"
import avatar3 from "../../images/forum-avatar3.jpg"
import avatar4 from "../../images/forum-avatar4.jpg"

class SmallCardForum extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="small-card-forum">
        <div className="small-card-forum-desc">
          <h6 className="forum-titile">Algebra 101</h6>
          <Button className="btn-video-desc-more no-padding">
            <img src={MoreButtonImage} />
          </Button>
        </div>
        <div style={{display: "flex"}}>
          <p className="brainsshare-tag">Algebra</p>
          <p className="brainsshare-tag">Mathematics</p>
        </div>
        <div className="small-card-forum-date-time">
          <div style={{display: "flex", marginBottom: "5px", marginRight: "10px"}}>
            <img src={Calendar} alt="Calendar" />
            <h6 style={{fontSize: "16px", paddingLeft: "10px"}} className="no-margin">
              08/14/20
            </h6>
          </div>
          <div style={{display: "flex", marginBottom: "5px", marginRight: "10px"}}>
            <img src={Clock} alt="Clock" />
            <h6 style={{fontSize: "16px", paddingLeft: "10px"}} className="no-margin">
              11:30 am
            </h6>
          </div>
        </div>
        <div className="forum-invited-student">
          <div style={{display: "flex"}}>
            <img src={avatar1} alt="avatar" className="forum-student-avatar"/>
            <img src={avatar2} alt="avatar" className="forum-student-avatar" />
            <img src={avatar3} alt="avatar" className="forum-student-avatar"/>
            <img src={avatar4} alt="avatar" className="forum-student-avatar"/>
          </div>
          <h6 className="forum-student-number no-margin">4 invited</h6>
        </div>
      </div>
    );
  }
}

SmallCardForum.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCardForum.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCardForum;
