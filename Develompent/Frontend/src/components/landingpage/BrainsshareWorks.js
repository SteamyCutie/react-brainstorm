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
        <Row className="img-brains-works">
          <Col>
          <img
            className="img-brains-works"
            src={FindMentorImage}
            placeholder="Mentor Active Image"
          />
          </Col>
          <Col>
          <div>
            <h3>Find a mentor</h3>
          </div>
          </Col>
        </Row>
        <Row className="img-brains-works">
          <img
            className="img-brains-works"
            src={BookSessionImage}
            placeholder="Mentor Active Image"
          />
          <h3>Book a session</h3>
        </Row>
        <Row className="img-brains-works">
          <img
            className="img-brains-works"
            src={VideoSessionImage}
            placeholder="Mentor Active Image"
          />
          <br />
          <h3>Video session</h3>
        </Row>
      </div>
    </Col>
  </div>
);

export default BrainsshareWorks;
