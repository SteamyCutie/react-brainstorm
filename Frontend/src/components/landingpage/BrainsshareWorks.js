import React from "react";
import { ButtonGroup, Button, Row, Col } from "shards-react";

import FindMentorImage from '../../images/FindMentor.svg'
import VideoSessionImage from '../../images/VideoSession.svg'
import BookSessionImage from '../../images/BookSession.svg'
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
            <Row className="center">
              <img
                src={FindMentorImage}
                placeholder="Mentor Active Image"
              />
            </Row>
            <Row className="center">
              <h3 className="brains-works-title">
                Find a mentor
              </h3>
            </Row>
            <Row className="center">
              <h5 className="brains-works-content">
                Lorem ipsum dolor sit amet, sapien ac tempor
              </h5>
            </Row>
          </Col>
        </Row>
        <Row className="brains-works-part">
         <Col>
            <Row className="center">
              <img
                src={BookSessionImage}
                placeholder="Mentor Active Image"
              />
            </Row>
            <Row className="center">
              <h3 className="brains-works-title">
                Book a session
              </h3>
            </Row>
            <Row className="center">
              <h5 className="brains-works-content">
                Lorem ipsum dolor sit amet, sapien ac tempor
              </h5>
            </Row>
          </Col>
        </Row>  
        <Row className="brains-works-part">
          <Col>
            <Row className="center">
              <img
                src={VideoSessionImage}
                placeholder="Mentor Active Image"
              />
            </Row>
            <Row className="center">
              <h3 className="brains-works-title">
                Video Session
              </h3>
            </Row>
            <Row className="center">
              <h5 className="brains-works-content">
                Lorem ipsum dolor sit amet, sapien ac tempor
              </h5>
            </Row>
          </Col>
        </Row>
      </div>
    </Col>
  </div>
);

export default BrainsshareWorks;
