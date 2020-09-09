import React from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Collapse, NavItem, NavLink } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"
import ReivewImage from "../../images/Review.jpg"

import avatar1 from "../../images/forum-avatar1.jpg"

class SmallCardForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
    this.toggleActions = this.toggleActions.bind(this);
  }

  componentDidMount() {
  }

  toggleActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  edit() {
    console.log("Go a Way!");
  }

  render() {
    const {title, description, avatar, invited, tags, tag_name, day, time} = this.props.item
    return (
      <div className="small-card-forum">
        <div className="small-card-forum-desc">
          <h6 className="forum-titile">{title}</h6>
          <NavItem className="dropdown notifications notification-class">
            <NavLink
              className="nav-link-icon text-center"
              onClick={this.toggleActions}
            >
              <div className="nav-link-icon__wrapper">
                <img
                  className="user-avatar mr-2"
                  src={MoreButtonImage}
                  alt="User Avatar"
                />{" "}
              </div>
            </NavLink>
            <Collapse
              open={this.state.visible}
              className="dropdown-menu dropdown-menu-small"
            >
              <DropdownItem  onClick={() => this.edit()}>
                Edit
              </DropdownItem>
            </Collapse>
          </NavItem>
        </div>
        <div style={{display: "flex"}}>
        {tag_name.map((item, idx) => 
          <p className="brainsshare-tag">{item}</p>
        )}
        </div>
        <div className="small-card-forum-date-time">
          <div style={{display: "flex", marginBottom: "5px", marginRight: "10px"}}>
            <img src={Calendar} alt="Calendar" />
            <h6 style={{fontSize: "16px", paddingLeft: "10px"}} className="no-margin">
              {day}
            </h6>
          </div>
          <div style={{display: "flex", marginBottom: "5px", marginRight: "10px"}}>
            <img src={Clock} alt="Clock" />
            <h6 style={{fontSize: "16px", paddingLeft: "10px"}} className="no-margin">
              {time}
            </h6>
          </div>
        </div>
        <div className="forum-invited-student">
          <div style={{display: "flex"}}>
          {avatar.map((item, idx) => 
            <img src={avatar1} alt="avatar" className="forum-student-avatar"/>
          )}
          </div>
          <h6 className="forum-student-number no-margin">{invited.length} invited</h6>
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
