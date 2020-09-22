import React from "react";
import { Container, Row } from "shards-react";

import BrainsshareWorks from "../components/landingpage/BrainsshareWorks"
import Discover from "../components/landingpage/Discover"
import FeaturedMentors from "../components/landingpage/FeaturedMentors"
import GetFastResults from "../components/landingpage/GetFastResults"
import ShareKnowledge from "../components/landingpage/ShareKnowledge"

export default class landingpage extends React.Component{
  render() {
    
    return (
      <Container fluid className="main-content-container pb-4">
        <Row>
          <ShareKnowledge />
        </Row>
        <Row>
          <BrainsshareWorks />
        </Row>
        <Row>
          <Discover />
        </Row>
        <Row>
          <FeaturedMentors />
        </Row>
        <Row>
          <GetFastResults />
        </Row>
      </Container>
    );
  }
}

