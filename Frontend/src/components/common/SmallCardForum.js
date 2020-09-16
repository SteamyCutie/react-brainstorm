import React from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"
import ReivewImage from "../../images/Review.jpg"

import avatar1 from "../../images/forum-avatar1.jpg"
import avatar2 from "../../images/avatar.jpg"
import EditLiveForum from "./EditLiveForum";

class SmallCardForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      forumInfos: [],
      ModalOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
  }

  toggle() {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  }

  toggle_editliveforum() {
    this.setState({
      ModalOpen: !this.state.ModalOpen
    });
  }

  toggle_modal() {
    this.setState({
      ModalOpen: !this.state.ModalOpen,
    });
  }

  render() {
    const {title, description, avatar, invited, tags, tag_name, day, from_time, to_time, id} = this.props.item;
    const { ModalOpen } = this.state;
    return (
      <div className="small-card-forum">
        <EditLiveForum open={ModalOpen} id={id} toggle={() => this.toggle_editliveforum()} toggle_modal={() => this.toggle_modal()}></EditLiveForum>
        <div className="small-card-forum-desc">
          <h6 className="forum-titile">{title}</h6>
          <Dropdown open={this.state.open} toggle={this.toggle}>
            <DropdownToggle>
              <div className="nav-link-icon__wrapper">
                <img
                  className="user-avatar mr-2"
                  src={MoreButtonImage}
                  alt="User Avatar"
                />{" "}
              </div>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem  onClick={() => this.toggle_editliveforum()}>
                Edit
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div style={{display: "flex"}}>
        {tag_name.map((item, idx) => {
          if (idx < 3)
            return <p key={idx} className="brainsshare-tag" title={item}>{item}</p>;
          else if (idx == 3)
            return <p key={idx} href="#!">{tag_name.length - 3} more</p>
          else 
            return <></>;
        })}
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
              {from_time}~{to_time}
            </h6>
          </div>
        </div>
        <div className="forum-invited-student">
          <div style={{display: "flex"}}>
          {/* {avatar.map((item, idx) => 
            <img key={idx} src={avatar2} alt="avatar" className="forum-student-avatar"/>
          )} */}
          <img src={avatar2} alt="avatar" className="forum-student-avatar"/>
          </div>
          <h6 className="forum-student-number no-margin">0 invited</h6>
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
