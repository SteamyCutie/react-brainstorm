import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Collapse, NavItem, NavLink } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Video from "../../video/video.mp4"

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
    const {title, description, media_url, media_type, day, time} = this.props.item
    return (
      <div className="mentor-desc-video">
        <div className="mentor-desc-video-header">
          <h6 className="video-upload-time no-margin">{day} at {time}</h6>
          
          <NavItem tag={Dropdown} caret toggle={this.toggleActions}>
            <DropdownToggle caret tag={NavLink} className="text-nowrap px-3" style={{width: '100px', height: '50px', float: 'right', marginTop: '-10px'}}>
              <img
                className="user-avatar mr-2"
                src={MoreButtonImage}
                alt="User Avatar"
              />{" "}
            </DropdownToggle>
            <Collapse tag={DropdownMenu} right small open={this.state.visible} style={{position: 'absolute', top: '20px'}}>
              <DropdownItem  onClick={() => this.edit()}>
                Edit
              </DropdownItem>
            </Collapse>
          </NavItem>
        </div>
        <div>
          <h6 className="mentor-desc-video-detail no-margin">
            {description}
          </h6>
        </div>
        <div>
          <video className="mentor-video-tag" controls>
            <source src={Video} type={media_type} />
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
