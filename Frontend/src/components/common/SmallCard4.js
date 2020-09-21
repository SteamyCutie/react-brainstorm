import React from "react";
import PropTypes from "prop-types";
import { DropdownItem, Collapse, NavItem, NavLink } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"
import ReivewImage from "../../images/Review.jpg"

class SmallCard4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
    this.toggleActions = this.toggleActions.bind(this);
  }

  componentWillMount() {
  }

  toggleActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  edit() {

  }

  render() {
    const {name, day, time, tag_name, avatar_url} = this.props.data
    return (
      <div className="small-card3">
        <div className="small-card3-desc">
          <div style={{display: "flex", float: "left"}}>
            <img src={ReivewImage} className="small-card3-avatar" alt="avatar" />
            {/* <img src={ReivewImage} className="small-card3-avatar" alt="avatar" /> */}
            <div>
              <h6 className="small-card3-name">{name}</h6>
              <div style={{display: "flex"}}>
                {tag_name.map((tag, idx) => {
                  return(
                    <p className="brainsshare-tag" id={idx}>{tag}</p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="small-card3-date-time">
          <div style={{display: "flex", marginBottom: "5px"}}>
            <img src={Calendar} alt="Calendar" />
            <h6 style={{fontSize: "16px", paddingLeft: "10px"}} className="no-margin">
              {day}
            </h6>
          </div>
          <div style={{display: "flex", marginBottom: "5px"}}>
            <img src={Clock} alt="Clock" />
            <h6 style={{fontSize: "16px", paddingLeft: "10px"}} className="no-margin">
              {time}
            </h6>
          </div>
        </div>
      </div>
    );
  }
}

SmallCard4.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCard4.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCard4;
