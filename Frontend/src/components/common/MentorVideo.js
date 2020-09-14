import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Collapse, NavItem, NavLink } from "shards-react";

import MoreButtonImage from "../../images/more.svg"

class MentorVideo extends React.Component {
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
    const {title, description, media_url, media_type, day, time} = this.props.item;
    return (
      <div className="mentor-desc-video">
        <div className="mentor-desc-video-header">
          <h6 className="video-upload-time no-margin">{day} at {time}</h6>
          
          {/* <NavItem className="dropdown notifications notification-class">
            <NavLink
              className="nav-link-icon text-center"
              onClick={this.toggleActions}
              style={{position: 'absolute', right: 0, top: 0}}
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
              style={{position: 'absolute', right: 0, top: 30}}
            >
              <DropdownItem  onClick={() => this.edit()}>
                Edit
              </DropdownItem>
            </Collapse>
          </NavItem> */}
        </div>
        <div>
          <h6 className="mentor-desc-video-detail no-margin">
            {description}
          </h6>
        </div>
        <div>
          <video className="mentor-video-tag" controls>
            <source src={media_url} type={media_type} />
          </video>
        </div>
      </div>
    );
  }
}

MentorVideo.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

MentorVideo.defaultProps = {
  value: 0,
  label: "Label",
};

export default MentorVideo;
