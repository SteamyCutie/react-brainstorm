import React from "react";
import { Button, Row, } from "shards-react";
import StarIcon from "../../images/star_icon.svg";
import PlayIcon from "../../images/Play_icon.svg";
import Lightening from "../../images/Lightening.svg";
import Clock from "../../images/Clock.svg";
import defaultavatar from "../../images/avatar.jpg";
import { withRouter } from 'react-router-dom';

class SearchMentorDetailCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      more: false,
      ModalOpenReview: false,
      teaches: [],
    }
  }

  componentWillMount() {
  }
  modal_toggle() {

  }

  toggle_signin() {
    const { toggle_signin } = this.props;
    toggle_signin();
  }

  readMore() {
    this.setState({more: true});
  }

  readLess() {
    this.setState({more: false});
  }

  render() {
    const {name, avatar, tag_name, status, description, hourly_price, instant_call, video_url, average_mark} = this.props.mentorData;

    return (
      <div className="mentor-detail-card">
        {/* <MentorReview mentorid={id} mentorname={name} open={ModalOpenReview} toggle={() => this.toggle_openmodalreview()}></MentorReview> */}
        <div style={{position: "relative"}} className="mentor-detail-avatar">
          {avatar && <img src={avatar} alt={name} className="mentor-detail-avatar-img" />}
          {!avatar && <img src={defaultavatar} alt={name} className="mentor-detail-avatar-img" />}
          {
            status === 1 && <div className="carousel-component-online-class"></div>
          }
        </div>
        <div className="mentor-detail-desc">
          <Row className="metor-detail-name-score">
            <div className="mentor-detail-name">{name}</div>
            <div><img src={StarIcon} alt="star-icon" className="mentor-detail-score"/>{average_mark}</div>
          </Row>
          <Row className="mentor-detail-subject-tag">
            <h5 className="tag-title mentor-detail-subject-title">Teaches: </h5>
            {tag_name && tag_name.map((teach, idx) => {
              if (idx < 3)
                return <p key={idx} className="brainsshare-tag" title={teach}>{teach}</p>;
              else if (idx === 3)
                return <p key={idx}>{tag_name.length - 3} more</p>
              else 
                return <></>;
            })}
          </Row>
          <div className="mentor-detail-myself">
            {!this.state.more && (description.length > 200 ? <p>{description.slice(0,200)}...</p> : <p>{description}</p>)}
            {this.state.more && <p>{description}</p>}
            {description.length > 200 && (this.state.more ? <label className="read-more" onClick={() => this.readLess()}>Read less</label> : <label className="read-more" onClick={() => this.readMore()}>Read more</label>)}
          </div>
          <div className="mentor-detail-video">
              <a href={video_url} target="_blank" rel="noopener noreferrer" ><img src={PlayIcon} alt="play-icon"/>Video presentation</a>
            </div>
        </div>
        <div className="mentor-deatail-rate-buttons">
          <Row className="center">
            <p>
              $ {hourly_price} / 60 min
            </p>
          </Row>
          <Row className="center">
            {instant_call ? <Button className="btn-mentor-detail-instant" onClick={() => this.toggle_signin()}>
              <img src={Lightening} alt="Lightening"/>
              Available now
            </Button> : <></>}
          </Row>
          <Row className="center">
            <Button style={{marginBottom: 10}} className="btn-mentor-detail-book" onClick={() => this.toggle_signin()}>
              <img src={Clock} alt="Clock" />
              Book a session
            </Button>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(SearchMentorDetailCard);
