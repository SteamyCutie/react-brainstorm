import React from "react";
import { ButtonGroup, Button, Row, Col } from "shards-react";

import FindMentorImage from '../../images/User.svg'
import VideoSessionImage from '../../images/Book.svg'
import BookSessionImage from '../../images/Video.svg'
import "../../assets/landingpage.css"

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
            <div className="center blue-background-one-class animation-one-class">
              <div className="center blue-background-two-class">
                <img
                  src={FindMentorImage}
                  placeholder="Mentor Active Image"
                />
              </div>
            </div>
            <div className="blue-dotline-class animation-two-class"> 
            </div>
            <div className="center animation-one-class">
              <h3 className="brains-works-title">
                Find a mentor
              </h3>
            </div>
            <div className="center animation-one-class">
              <h5 className="brains-works-content">
                Lorem ipsum dolor sit amet, sapien ac tempor
              </h5>
            </div>
          </Col>
        </Row>
        <Row className="brains-works-part">
         <Col>
           <div className="center blue-background-one-class animation-three-class">
              <div className="center blue-background-two-class">
                <img
                  src={BookSessionImage}
                  placeholder="Mentor Active Image"
                />
              </div>
            </div>
            <div className="blue-dotline-class animation-four-class"> 
            </div>
            <div className="center animation-three-class">
              <h3 className="brains-works-title">
                Book a session
              </h3>
            </div>
            <div className="center animation-three-class">
              <h5 className="brains-works-content">
                Lorem ipsum dolor sit amet, sapien ac tempor
              </h5>
            </div>
          </Col>
        </Row>  
        <Row className="brains-works-part">
          <Col>
            <div className="center blue-background-one-class animation-five-class">
              <div className="center blue-background-two-class">
                <img
                  src={VideoSessionImage}
                  placeholder="Mentor Active Image"
                />
              </div>
            </div>
            <div className="center animation-five-class">
              <h3 className="brains-works-title">
                Video Session
              </h3>
            </div>
            <div className="center animation-five-class">
              <h5 className="brains-works-content">
                Lorem ipsum dolor sit amet, sapien ac tempor
              </h5>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  </div>
);

export default BrainsshareWorks;
