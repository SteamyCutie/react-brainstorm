import React from "react";
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"
import default_avatar from "../../images/avatar.jpg"

class SmallCard3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false,};
    
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
  }

  edit() {

  }

  toggle() {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  }

  render() {
    const {name, day, from_time, to_time, tag_name, avatar} = this.props.data
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
                    return <p key={idx} href="#!">{tag_name.length - 2} more</p>
                  else
                    return <></>;
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
              {from_time}~{to_time}
            </h6>
          </div>
        </div>
      </div>
    );
  }
}

export default SmallCard3;
