import React from "react";
import { ButtonGroup, Button, Row, Col } from "shards-react";

import MentorActiveImage from '../../images/fastResultImage.jpg'
import "../../assets/landingpage.css"

const ShareKnowledge = () => (
  <div className="get-fast-results">
    <div className="get-fast-results-desc">
      <h1 className="desc-title-fast-results">Get fast results with professional online mentor.</h1>
      <Button theme="primary" className="mb-2 mr-3 btn-fast-results">
        Find a mentor
      </Button>
    </div>
    <div className="img-get-fast-results-wrap">
      <img
        className="img-get-fast-results"
        src={MentorActiveImage}
        placeholder="Mentor Active Image"
      />
    </div>
  </div>
);

export default ShareKnowledge;
