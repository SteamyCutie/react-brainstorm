import React from "react";
import { ButtonGroup, Button, Row, Col } from "shards-react";
import ScrollAnimation from 'react-animate-on-scroll';

import MentorActiveImage from '../../images/Mentor_ active session full screen 1.jpg'
import "../../assets/landingpage.css"
import "animate.css/animate.min.css";

const ShareKnowledge = () => (
  <div className="share-knowledge">
    <Row>
      <Col xl="5">
        <ScrollAnimation animateIn='ltor'
          delay={2000}
          duration={2}
          initiallyVisible={false}
          animateOnce={true}>
          <div className="share-knowledge-desc">
            <h1 className="desc-title">Share your knowledge</h1>
            <h5>Language learning and Private Lessons online</h5>
            <Button theme="primary" className="mb-2 mr-3 btn-find-mentor">
              Find a mentor
            </Button>
          </div>
        </ScrollAnimation>
      </Col>
      <Col xl="7" className="img-share-knowledge">
        <ScrollAnimation animateIn='rtol'
          delay={0}
          duration={4}
          initiallyVisible={false}
          animateOnce={true}>
          <img
            className="img-mentor-active"
            src={MentorActiveImage}
            placeholder="Mentor Active Image"
          />
        </ScrollAnimation>
      </Col>
    </Row>
  </div>
);

export default ShareKnowledge;
