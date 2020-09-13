import React from "react";
import { Button, Row, } from "shards-react";

import StarIcon from "../../images/star_icon.svg";
import PlayIcon from "../../images/Play_icon.svg";
import Online from "../../images/Online.svg";
import Lightening from "../../images/Lightening.svg";
import Clock from "../../images/Clock.svg";
import defaultavatar from "../../images/avatar.jpg"

class MentorDetailCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teaches: [
        "Algebra",
        "Mathematics",
      ],
    }
  }

  componentDidMount() {
  }

  render() {
    const {name, score, avatar, tag_name, online, description, hourly_price} = this.props.mentorData;
  
    return (
      <div className="mentor-detail-card">
        <div style={{position: "relative"}} className="mentor-detail-avatar">
            {avatar && <img src={avatar} alt={name} className="mentor-detail-avatar-img" />}
            {!avatar && <img src={defaultavatar} alt={name} className="mentor-detail-avatar-img" />}
          {
            online && <img src={Online} alt="Online" className="mentor-detail-avatar-status" />
          }
        </div>
        <div className="mentor-detail-desc">
          <Row className="metor-detail-name-score">
            <div className="mentor-detail-name">{name}</div>
            <div><img src={StarIcon} alt="star-icon" className="mentor-detail-score"/>{score}</div>
          </Row>
          <Row className="mentor-detail-subject-tag">
            <h5 className="tag-title mentor-detail-subject-title">Teaches: </h5>
            {tag_name.map((teach, idk) => (
              <p key={idk} className="brainsshare-tag">{teach}</p>
            ))
            }
          </Row>
          <div className="mentor-detail-myself">
            <p>{description}</p>
            <a className="read-more">Read more</a>
          </div>
          <div className="mentor-detail-video">
            <img src={PlayIcon} alt="play-icon"/>
              Video presentation
            </div>
        </div>
        <div className="mentor-deatail-rate-buttons">
          <Row className="center">
            <p>
              $ {hourly_price} / 60 min
            </p>
          </Row>
          <Row className="center">
            <Button className="btn-mentor-detail-instant">
              <img src={Lightening} alt="Lightening" />
              Available now
            </Button>
          </Row>
          <Row className="center">
            <Button className="btn-mentor-detail-book">
              <img src={Clock} alt="Clock" />
              Book a session
            </Button>
          </Row>
          <Row className="center">
            <Button className="btn-mentor-detail-book">
              <img src={Clock} alt="Clock" />
              Recommand
            </Button>
          </Row>
        </div>
      </div>
    );
  }
}

export default MentorDetailCard;
