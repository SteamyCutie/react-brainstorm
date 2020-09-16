import React from "react";
import { Button, Row, } from "shards-react";

import VideoCall from "../common/VideoCall"
import MentorReview from "../common/MentorReview";

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
      more: false,
      ModalOpenReview: false,
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
    }
  }

  componentDidMount() {
  }

  handleAvailableNow() {
    console.log(this.props.mentorData.email, '+++++ ======');
    this.props.call(this.props.mentorData.email);
  }

  toggle_videocall() {
    this.setState({
      videoCallModal: !this.state.videoCallModal
    });
    // if(!this.state.videoCallModal) {
    //   this.videoCallModal.current.clearValidationErrors();
    // }
  }

  toggle_modal() {
    this.setState({
      videoCallModal: !this.state.videoCallModal,
    });
    // if(!this.state.videoCallModal) {
    //   this.videoCallModal.current.clearValidationErrors();
    // }
  }

  handleBookCall() {
    this.setState({
      modal_toggle: !this.state.modal_toggle
    })
  }

  modal_toggle() {

  }

  toggle_openmodalreview() {
    this.setState({
      ModalOpenReview: !this.state.ModalOpenReview
    });
  }

  toggle_modalreview() {
    this.setState({
      ModalOpenReview: !this.state.ModalOpenReview,
    });
  }

  readMore() {
    this.setState({more: true});
  }

  readLess() {
    this.setState({more: false});
  }

  render() {
    const {id, name, score, avatar, tag_name, online, description, hourly_price, instant_call, video_url} = this.props.mentorData;
    const {ModalOpenReview} = this.state;
    return (
      <div className="mentor-detail-card">
        <MentorReview mentorid={id} open={ModalOpenReview} toggle={() => this.toggle_openmodalreview()} toggle_modal={() => this.toggle_modalreview()}></MentorReview>
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
            {tag_name.map((teach, idx) => {
              if (idx < 5)
                return <p key={idx} className="brainsshare-tag" title={teach}>{teach}</p>;
              else if (idx == 5)
                return <p key={idx} href="#!">{tag_name.length - 5} more</p>
              else 
                return <></>;
            })}
          </Row>
          <div className="mentor-detail-myself">
            {this.state.more ? <p>{description}</p> : <p>{description.slice(0,200)}...</p>}
            {this.state.more ? <a href="#!" className="read-more" onClick={() => this.readLess()}>Read less</a> : <a href="#!" className="read-more" onClick={() => this.readMore()}>Read more</a>}
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
          <Row className="center">
            <Button className="btn-mentor-detail-book" onClick={() => this.toggle_openmodalreview()}>
              <img src={Clock} alt="Clock" />
              Review Mentor
            </Button>
          </Row>
        </div>
        {this.state.call && 
          // this.state.call && 
          // this.state.videoCallModal && 
          // <Redirect to={{pathname: '/call'}} />
          <VideoCall ref={this.videoCallModal} open={!this.state.videoCallModal} toggle={() => this.toggle_videocall()} toggle_modal={() => this.toggle_modal()} 
          from={this.props.from} callState={this.props.callState} ws={this.props.ws} setWebRtcPeer={this.props.setWebRtcPeer} stop={this.props.stop}/>
          // <VideoCall />
        }
        {/* <Modal isOpen={this.state.modal_isOpen} toggle={this.modal_toggle()} backdrop="static">
          <ModalHeader toggle={toggle}>Modal title</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal> */}
      </div>
    );
  }
}

export default MentorDetailCard;
