import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card, CardBody } from "shards-react";
import { Link } from "react-router-dom";

import Review from "../components/common/Review"
import SubscribeModal from "../components/common/SubscribeModal"

import StarIcon from "../images/star_icon.svg";
import Lightening from "../images/Lightening.svg";
import PlayIcon from "../images/Play_icon.svg";
import Clock from "../images/Clock.svg";
import MentorAvatar from "../images/Rectangle_Kianna_big.png"
import SubscriperImg from "../images/Users.svg"

export default class Unsubscribe extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      subscriptionOpen: false,
      mentorData: {
        name: "Kianna Press",
        score: 4.8,
        reviewCount: 6,
        image: require("../images/Rectangle_Kianna_big.png"),
        teaches: [
          "Algebra",
          "Mathematics",
        ],
        online: true,
        description: "I'm currently doing my PhD in statistical Physics. I can help you with conceptual and mathematical aspects of classical mechanics, quantum mechanics, statistical mechanics, electrodynamics, mathematical methods for rem ipsum dolor sit amet, sollicitudin nec dapibus molestie risus eleifend augue, justo dui et est a pharetra, ut nullam gravida sed amet.",
        rate: 25,
        time: 60,
      } 
    }
  }

  toggle_unsubscribe() {
    this.setState({
      subscriptionOpen: !this.state.subscriptionOpen
    });
  }

  toggle_modal() {
    this.setState({
      subscriptionOpen: !this.state.subscriptionOpen,
    });
  }

  render() {
    const { mentorData } = this.state;

    return (
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
        <Card small className="specific-subsciption-card">
          <CardBody>
            <Row>
              <Link to="/subscriptions" className="hidden-underline">
                <Button className="btn-back-scriptions">
                  Back
                </Button>
              </Link>
            </Row>
            <Row>
              <Col xl="3" className="subscription-mentor-detail">
                <div>
                  <img src={MentorAvatar} style={{width: "206px"}}/>
                  <div style={{display: "flex", padding: "20px 0px"}}>
                    <img src={SubscriperImg} style={{width: "22px", marginRight: "10px"}}/>
                    <h6 className="no-margin" style={{paddingRight: "70px"}}>Subscribers</h6>
                    <h6 className="no-margin"style={{fontWeight: "bold"}}>24</h6>
                  </div>
                  <Button className="btn-subscription-unsubscribe" onClick={() => this.toggle_unsubscribe()}>
                    Subscription $50/month
                  </Button>
                </div>
              </Col>
              <Col xl="9" lg="12" className="subscription-mentor-videos no-padding-left">
                <div className="subscription-mentor-desc no-padding">
                  <div className="mentor-detail-desc">
                    <Row className="metor-detail-name-score">
                      <div className="mentor-detail-name" style={{fontSize: "30px"}}>{mentorData.name}</div>
                      <div style={{fontSize: "20px", fontWeight: "bold", display: "flex" }}>
                        <img src={StarIcon} alt="star-icon" className="mentor-detail-score"/>
                        <h6 style={{paddingTop: "10px", fontSize: "20px", fontWeight: "bold", color: "#333333"}}>{mentorData.score}</h6>
                        <h6 style={{paddingTop: "10px", fontSize: "18px", paddingLeft: "5px", color: "#333333"}}>({mentorData.reviewCount} reviews)</h6>
                      </div>
                    </Row>
                    <Row className="mentor-detail-subject-tag">
                      <h5 className="tag-title mentor-detail-subject-title">Teaches: </h5>
                      {
                        mentorData.teaches.map((teach, idk) => (
                          <p key={idk} className="brainsshare-tag">{teach}</p>
                        ))
                      }
                    </Row>
                    <div className="mentor-detail-myself">
                      <p>{mentorData.description}...</p>
                    </div>
                    <div className="mentor-detail-video">
                      <img src={PlayIcon} alt="play-icon"/>
                        Video presentation
                      </div>
                  </div>
                  <div className="mentor-deatail-rate-buttons">
                    <Row className="center">
                      <p>
                        $ {mentorData.rate} / 60 min
                      </p>
                    </Row>
                    <Row className="center">
                      <Button className="btn-mentor-detail-instant">
                        <img src={Lightening} alt="Lightening" />
                        Instant Call
                      </Button>
                    </Row>
                    <Row className="center">
                      <Button className="btn-mentor-detail-book">
                        <img src={Clock} alt="Clock" />
                        Book Call
                      </Button>
                    </Row>
                  </div>
                </div>
                <div style={{display: "flex", paddingLeft: "30px", paddingTop: "20px"}}>
                  <h6 style={{paddingTop: "10px", paddingRight: "20px", fontSize: "20px", fontWeight: "bold", color: "#333333"}}>Review</h6>
                  <img src={StarIcon} alt="star-icon" className="mentor-detail-score"/>
                  <h6 style={{paddingTop: "10px", fontSize: "20px", fontWeight: "bold", color: "#333333"}}>{mentorData.score}</h6>
                </div>
                <div className="reviews-container">
                  <Review />
                  <Review />
                  <Review />
                  <Review />
                  <Review />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <SubscribeModal open={this.state.subscriptionOpen} toggle={() => this.toggle_unsubscribe()} toggle_modal={() => this.toggle_modal()} />
      </Container>
    );
  }
}