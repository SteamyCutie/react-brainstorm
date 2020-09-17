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

    this.videoCallModal = React.createRef();

    this.state = {
      teaches: [
        "Algebra",
        "Mathematics",
      ],
      call: false,
      registerState: 0,
      callState: 0,
      videoCallModal: 0,
      from: '',
      modal_isOpen: 0,
      isCallingNow: 0,
      isConnectingNow: 0,
      incomingCallToggle: 0,
      outcomingCallToggle: 0,
    }
  }

  componentDidMount() {
  }

  handleAvailableNow() {
    this.toggle_outcomingCall_modal();console.log(this.props.mentorData.email);
    this.props.sendUser(this.props.mentorData.email);
  }

  toggle_videocall() {
    this.setState({
      videoCallModal: !this.state.videoCallModal
    });
  }

  toggle_modal() {
    this.setState({
      videoCallModal: !this.state.videoCallModal,
    });
  }

  handleBookCall() {
    this.setState({
      modal_toggle: !this.state.modal_toggle
    })
  }

  modal_toggle() {

  }

  toggle_incomingCall() {
    this.setState({
      incomingCallToggle: !this.state.incomingCallToggle,
    })
  }

  toggle_outcomingCall_modal() {
    this.setState({
      outcomingCallToggle: !this.state.outcomingCallToggle,
    })
    if(this.state.outcomingCallToggle) {

    } else {
      
    }
  }

  handleDecline() {
    this.props.onDecline();
  }

  render() {
    const {name, score, avatar, tag_name, online, description, hourly_price, instant_call, video_url} = this.props.mentorData;

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
              <p key={idk} className="brainsshare-tag" title={teach}>{teach}</p>
            ))
            }
          </Row>
          <div className="mentor-detail-myself">
            <p>{description}</p>
            <a className="read-more">Read more</a>
          </div>
          <div className="mentor-detail-video">
              <a href={video_url} target="_blank"><img src={PlayIcon} alt="play-icon"/>Video presentation</a>
            </div>
        </div>
        <div className="mentor-deatail-rate-buttons">
          <Row className="center">
            <p>
              $ {hourly_price} / 60 min
            </p>
          </Row>
          <Row className="center">
            {instant_call ? <Button className="btn-mentor-detail-instant" onClick={() => this.handleAvailableNow()}>
              <img src={Lightening} alt="Lightening"/>
              Available now
            </Button> : <Button disabled className="btn-mentor-detail-instant">
              <img src={Lightening} alt="Lightening" />
              Available now
            </Button>}
          </Row>
          <Row className="center">
            <Button className="btn-mentor-detail-book" onClick={() => this.handleBookCall()}>
              <img src={Clock} alt="Clock" />
              Book a session
            </Button>
          </Row>
        </div>
      </div>
    );
  }
}

export default MentorDetailCard;
