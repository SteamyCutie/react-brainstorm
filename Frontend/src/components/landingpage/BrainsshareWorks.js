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
        <div className="brains-works-container">
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
                Search by Name or Category for an Experienced Professional, Expert, Teacher, Professor to mentor and depart their wealth of experience and knowledge for your aid.
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
                With a quick search, participants can review mentor candidates, and with one click, select a mentor, schedule a tutorial session for a future date,  or call immediately for help solving an urgent issue 
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
                With virtual live chat tutorial, you can arrange one on one session or group lessons with an experienced, knowledgeable mentor... If you are in need of a knowledgeable guide, for homework, self help Or DIY, an experienced mentor will be effective in maximizing your productivity and can be an effective aid in successful task completion.
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
