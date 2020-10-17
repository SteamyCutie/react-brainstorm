import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "shards-react";
import MoreButtonImage from "../../images/more.svg"
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"
import default_avatar from "../../images/avatar.jpg"

class SmallCard3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false,};
    
    this.toggle = this.toggle.bind(this);
    this.mentorName = '';
    this.name = '';
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.mentorName = "Alex Dvornikov"; // this.mentorName = this.props.data.mentor_name;
    this.name = this.props.data.title;
    this.room_id = this.props.data.room_id;
    
    localStorage.setItem("session_name", this.name);
    localStorage.setItem("session_mentor", this.mentorName);
    localStorage.setItem("room_id", this.room_id);
  }

  edit() {

  }

  toggle() {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  }

  toggle_startSession() {
    // window.open("/room-call");

  }

  render() {
    const {name, day, from_time, to_time, tag_name, avatar, room_id} = this.props.data
    const { joinSession } = this.props;
    return (
      <div className="small-card3">
        <div className="small-card3-desc">
          <div style={{display: "flex", float: "left"}}>
            {avatar ? <img src={avatar} className="small-card3-avatar" alt="avatar" /> : <img src={default_avatar} className="small-card3-avatar" alt="avatar" />}
            <div>
              <h6 className="small-card3-name">{name}</h6>
              <div style={{display: "flex"}}>
                {tag_name.map((tag, idx) => {
                  if (idx < 2)
                    return <p className="brainsshare-tag" key={idx} title={tag}>{tag}</p>;
                  else if (idx === 2)
                    return <p key={idx}>{tag_name.length - 2} more</p>
                  else
                    return <></>;
                })}
              </div>
            </div>
          </div>
          <Dropdown open={this.state.open} toggle={this.toggle} className="more-drop-down">
            <DropdownToggle>
              <div className="nav-link-icon__wrapper">
                <img
                  className="user-avatar mr-2"
                  src={MoreButtonImage}
                  alt="User Avatar"
                />{" "}
              </div>
            </DropdownToggle>
            <DropdownMenu >
              <DropdownItem onClick={() => joinSession(room_id)}>
                Join Forum
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
              {from_time}~{to_time}
            </h6>
          </div>
        </div>
      </div>
    );
  }
}

export default SmallCard3;
