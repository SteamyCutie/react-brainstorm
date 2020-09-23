import React from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"

import avatar2 from "../../images/avatar.jpg"
import InvitedStudent from "./InvitedStudent";

class SmallCardForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      forumInfos: [],
      ModalInviteOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
  }

  toggle() {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  }

  toggle_invite() {
    this.setState({
      ModalInviteOpen: !this.state.ModalInviteOpen
    });
  }

  render() {
    const {title, description, avatar, invited, tags, tag_name, day, from_time, to_time, id, student_info} = this.props.item;
    const {toggle_editliveforum, toggle_confirm} = this.props;
    const { ModalInviteOpen } = this.state;
    return (
      <div className="small-card-forum">
        <InvitedStudent open={ModalInviteOpen} id={id} students={student_info} toggle={() => this.toggle_invite()}></InvitedStudent>
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
              <DropdownItem onClick={() => toggle_editliveforum(id)}>
                Invite students
              </DropdownItem>
              <DropdownItem onClick={() => toggle_editliveforum(id)}>
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => toggle_confirm(id)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div style={{display: "flex"}}>
        {tag_name.map((item, idx) => {
          if (idx < 3)
            return <p key={idx} className="brainsshare-tag" title={item}>{item}</p>;
          else if (idx === 3)
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
            <a href="#!" onClick={() => this.toggle_invite()}>
              {student_info.map((item, idx) => {
                if (idx < 3)
                  return <img key={idx} src={item.avatar} alt="avatar" className="forum-student-avatar"/>;
                else 
                  return <></>;
              })}
              </a>
          </div>
          <h6 className="forum-student-number no-margin">{student_info.length} invited</h6>
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
