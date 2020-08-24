import React from "react";
import { ButtonGroup, Button } from "shards-react";

import MentorActive from '../../images/Mentor_ active session full screen 1.jpg'

const ShareKnowledge = () => (
  <div className="share-knowledge">
    <Row>
      <Col xl="5">
        <div className="share-knowledge-desc">
          <h1 className="desc-title">Share your knowledge</h1>
          <h5>Language learning and Private Lessons online</h5>
          <Button theme="primary" className="mb-2 mr-3 btn-find-mentor">
            Find a mentor
          </Button>
        </div>
      </Col>
      <Col xl="7" className="img-share-knowledge">
        <img
          className="img-mentor-active"
          src={MentorActiveImage}
          placeholder="Mentor Active Image"
        />
      </Col>
    </Row>
  </div>
);

export default ShareKnowledge;
