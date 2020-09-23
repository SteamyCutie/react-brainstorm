import React from "react";
import { Button } from "shards-react";
import ScrollAnimation from 'react-animate-on-scroll';
import "animate.css/animate.min.css";

import MentorActiveImage from '../../images/fastResultImage.jpg'
import "../../assets/landingpage.css"

export default class GetFastResult extends React.Component{

  constructor(props) {
    super(props);
    this.state = {}
  }


  findMentor = () => {
    window.location.href = "/findmentor";
  }

  render() {
    return (
      <div className="get-fast-results">
        <ScrollAnimation animateIn='ltor'
          delay={0}
          duration={2}
          initiallyVisible={false}
          className="img-get-fast-results"
          animateOnce={true}>
          <div className="get-fast-results-desc">
            <h1 className="desc-title-fast-results">Get fast results with professional online mentor.</h1>
            <Button theme="primary" className="mb-2 mr-3 btn-fast-results" onClick={() => this.findMentor()}>
              Find a mentor
            </Button>
          </div>
        </ScrollAnimation>
        <div className="img-get-fast-results-wrap">
          <ScrollAnimation animateIn='bigger'
            delay={0}
            duration={2}
            className="img-get-fast-results"
            initiallyVisible={false}
            animateOnce={true}>
            <img
              className="img-get-fast-results"
              src={MentorActiveImage}
              alt="fast result"
            />
          </ScrollAnimation>
        </div>
      </div>
    )
  }
};