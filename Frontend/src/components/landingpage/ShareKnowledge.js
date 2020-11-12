import React from "react";
import { Button, Row, Col } from "shards-react";
import ScrollAnimation from 'react-animate-on-scroll';

import MentorActiveImage from '../../images/Mentor_ active session full screen 1.jpg'
import "../../assets/landingpage.css"
import "animate.css/animate.min.css";
import { withRouter } from 'react-router-dom';

class ShareKnowledge extends React.Component{

  constructor(props) {
    super(props);
    this.state = {}
  }

  findMentor= () => {
    this.props.history.push('/findmentor');
  };

  render() {
    return (
    <div className="share-knowledge">
      <ScrollAnimation animateIn='animation-class'
        delay={1000}
        duration={2}
        initiallyVisible={false}
        animateOnce={true}>
        <Row>
          <Col xl="6">
            <div className="share-knowledge-desc share-animation-ltor">
              <h1 className="desc-title">Share your knowledge</h1>
              <h5>Find an infinite wealth of konwledge, through mentoring and sharing.</h5>
              <h5 style={{fontStyle: "italic"}}>The more we share, the more you gain.</h5>
              <Button theme="primary" className="mb-2 mr-3 btn-find-mentor" onClick={() => this.findMentor()}>
                Find a mentor
              </Button>
            </div>
          </Col>
          <Col xl="6" className="img-share-knowledge share-animation-rtol">
            <img
              className="img-mentor-active"
              src={MentorActiveImage}
              alt="Mentor Active"
            />
          </Col>
        </Row>
      </ScrollAnimation>
    </div>
    )
  }
};

export default withRouter(ShareKnowledge);