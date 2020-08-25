import React from "react";
import { ButtonGroup, Button, Row, Col } from "shards-react";
import ScrollAnimation from 'react-animate-on-scroll';
import "animate.css/animate.min.css";

import MentorActiveImage from '../../images/fastResultImage.jpg'
import "../../assets/landingpage.css"

const ShareKnowledge = () => (
  <div className="get-fast-results">
    <ScrollAnimation animateIn='ltor'
      delay={2000}
      duration={2}
      initiallyVisible={false}
      animateOnce={true}>
      <div className="get-fast-results-desc">
        <h1 className="desc-title-fast-results">Get fast results with professional online mentor.</h1>
        <Button theme="primary" className="mb-2 mr-3 btn-fast-results">
          Find a mentor
        </Button>
      </div>
    </ScrollAnimation>
    <div className="img-get-fast-results-wrap">
      <ScrollAnimation animateIn='bigger'
        delay={2000}
        duration={2}
        className="img-get-fast-results"
        initiallyVisible={false}
        animateOnce={true}>
        <img
          className="img-get-fast-results"
          src={MentorActiveImage}
          placeholder="Mentor Active Image"
        />
      </ScrollAnimation>
    </div>
  </div>
);

export default ShareKnowledge;
