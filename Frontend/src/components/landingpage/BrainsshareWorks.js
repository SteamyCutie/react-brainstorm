import React from "react";
import { Row, Col } from "shards-react";
import ScrollAnimation from 'react-animate-on-scroll';

import FindMentorImage from '../../images/User.svg'
import VideoSessionImage from '../../images/Video.svg'
import BookSessionImage from '../../images/Book.svg'
import "../../assets/landingpage.css"
import "animate.css/animate.min.css";

const BrainsshareWorks = () => (
  <div className="brains-share">
    <Col>
      <div className="center">
        <h1 className="desc-title-works">How Brainsshare Works</h1>
      </div>
    </Col>
    <Col>
      <ScrollAnimation animateIn='animation-class'
        delay={0}
        duration={4}
        initiallyVisible={false}
        animateOnce={true}>
        <div className="center">
          <Row className="brains-works-part">
            <Col>
              <div className="center blue-background-one-class animation-one-class dis-none">
                <div className="center blue-background-two-class">
                  <img
                    src={FindMentorImage}
                    alt="Mentor Active"
                  />
                </div>
              </div>
              <div className="center animation-one-class dis-none">
                <h3 className="brains-works-title">
                  Find a mentor
                </h3>
              </div>
              <div className="center animation-one-class dis-none">
                <h5 className="brains-works-content">
                  Lorem ipsum dolor sit amet, sapien ac tempor
                </h5>
              </div>
              <div className="blue-dotline-class animation-two-class dis-none"> 
              </div>
            </Col>
          </Row>
          <Row className="brains-works-part">
            <Col>
              <div className="center blue-background-one-class animation-three-class dis-none">
                <div className="center blue-background-two-class">
                  <img
                    src={BookSessionImage}
                    alt="Mentor Active"
                  />
                </div>
              </div>
              <div className="center animation-three-class dis-none">
                <h3 className="brains-works-title">
                  Book a session
                </h3>
              </div>
              <div className="center animation-three-class dis-none">
                <h5 className="brains-works-content">
                  Lorem ipsum dolor sit amet, sapien ac tempor
                </h5>
              </div>
              <div className="blue-dotline-class animation-four-class dis-none"> 
              </div>
            </Col>
          </Row>  
          <Row className="brains-works-part">
            <Col>
              <div className="center blue-background-one-class animation-five-class dis-none">
                <div className="center blue-background-two-class">
                  <img
                    src={VideoSessionImage}
                    alt="Mentor Active"
                  />
                </div>
              </div>
              <div className="center animation-five-class dis-none">
                <h3 className="brains-works-title">
                  Video Session
                </h3>
              </div>
              <div className="center animation-five-class dis-none">
                <h5 className="brains-works-content">
                  Lorem ipsum dolor sit amet, sapien ac tempor
                </h5>
              </div>
            </Col>
          </Row>
        </div>
      </ScrollAnimation>
    </Col>
  </div>
);

export default BrainsshareWorks;
