import React from "react";
import PropTypes from "prop-types";
import { DropdownItem, Collapse, NavItem, NavLink } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"
import ReivewImage from "../../images/Review.jpg"

class SmallCard3 extends React.Component {
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

  }

  render() {
    const {name, day, time, tag_name, avatar_url} = this.props
    return (
      <div className="small-card3">
        <div className="small-card3-desc">
          <div style={{display: "flex", float: "left"}}>
            <img src={ReivewImage} className="small-card3-avatar" alt="avatar" />
            {/* <img src={avatar_url} className="small-card3-avatar" alt="avatar" /> */}
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

SmallCard3.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCard3.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCard3;
