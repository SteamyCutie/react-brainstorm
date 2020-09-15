import React from "react";
import PropTypes from "prop-types";
import { DropdownItem, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Calendar from "../../images/calendar-blue.svg"
import Clock from "../../images/clock-blue.svg"
import ReivewImage from "../../images/Review.jpg"

class SmallCard3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false,};
    
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
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
            <img src={avatar} className="small-card3-avatar" alt="avatar" />
            <div>
              <h6 className="small-card3-name">{name}</h6>
              <div style={{display: "flex"}}>
                {tag_name.map((tag, idx) => {
                  if (idx < 2)
                    return <p className="brainsshare-tag" id={idx} title={tag}>{tag}</p>;
                  else if (idx == 2)
                    return <a href="javascript:void(0)">More</a>
                  else
                    return <></>;
                })}
              </div>
            </div>
          </div>
          {/* <Dropdown open={this.state.open} toggle={this.toggle}>
            <DropdownToggle style={{float: 'right'}}>
            <div className="nav-link-icon__wrapper">
                <img
                  className="user-avatar mr-2"
                  src={MoreButtonImage}
                  alt="User Avatar"
                />{" "}
              </div>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem  onClick={() => this.edit()}>
                Edit
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
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

SmallCard3.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCard3.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCard3;
