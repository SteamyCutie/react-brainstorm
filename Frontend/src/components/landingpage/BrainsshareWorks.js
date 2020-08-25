import React from "react";
import { ButtonGroup, Button, Row, Col } from "shards-react";
import ScrollAnimation from 'react-animate-on-scroll';

import FindMentorImage from '../../images/User.svg'
import VideoSessionImage from '../../images/Book.svg'
import BookSessionImage from '../../images/Video.svg'
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
        <div className="center">
          <Row className="brains-works-part">
            <Col>
              <ScrollAnimation animateIn='animation-class'
                delay={0}
                duration={1.5}
                initiallyVisible={false}
                animateOnce={true}>
                <div className="center blue-background-one-class">
                  <div className="center blue-background-two-class">
                    <img
                      src={FindMentorImage}
                      placeholder="Mentor Active Image"
                    />
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animateIn='animation-class'
                delay={1500}
                duration={1}
                initiallyVisible={false}
                animateOnce={true}>
                <div className="blue-dotline-class"> 
                </div>
              </ScrollAnimation>
              <ScrollAnimation animateIn='animation-class'
                delay={0}
                duration={1.5}
                initiallyVisible={false}
                animateOnce={true}>
                <div className="center">
                  <h3 className="brains-works-title">
                    Find a mentor
                  </h3>
                </div>
                <div className="center">
                  <h5 className="brains-works-content">
                    Lorem ipsum dolor sit amet, sapien ac tempor
                  </h5>
                </div>
              </ScrollAnimation>
            </Col>
          </Row>
          <Row className="brains-works-part">
            <Col>
              <ScrollAnimation animateIn='animation-class'
                delay={2500}
                duration={1.5}
                initiallyVisible={false}
                animateOnce={true}>
                <div className="center blue-background-one-class">
                  <div className="center blue-background-two-class">
                    <img
                      src={BookSessionImage}
                      placeholder="Mentor Active Image"
                    />
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation animateIn='animation-class'
                delay={4000}
                duration={1}
                initiallyVisible={false}
                animateOnce={true}>
                <div className="blue-dotline-class"> 
                </div>
              </ScrollAnimation>
              <ScrollAnimation animateIn='animation-class'
                delay={2500}
                duration={1.5}
                initiallyVisible={false}
                animateOnce={true}>
                <div className="center">
                  <h3 className="brains-works-title">
                    Book a session
                  </h3>
                </div>
                <div className="center">
                  <h5 className="brains-works-content">
                    Lorem ipsum dolor sit amet, sapien ac tempor
                  </h5>
                </div>
              </ScrollAnimation>
            </Col>
          </Row>  
          <Row className="brains-works-part">
            <Col>
              <ScrollAnimation animateIn='animation-class'
                delay={5000}
                duration={1.5}
                initiallyVisible={false}
                animateOnce={true}>
                <div className="center blue-background-one-class">
                  <div className="center blue-background-two-class">
                    <img
                      src={VideoSessionImage}
                      placeholder="Mentor Active Image"
                    />
                  </div>
                </div>
                <div className="center">
                  <h3 className="brains-works-title">
                    Video Session
                  </h3>
                </div>
                <div className="center">
                  <h5 className="brains-works-content">
                    Lorem ipsum dolor sit amet, sapien ac tempor
                  </h5>
                </div>
              </ScrollAnimation>
            </Col>
          </Row>
        </div>
    </Col>
  </div>
);

export default BrainsshareWorks;
