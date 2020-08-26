import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import WalletHeader from "./../components/common/WalletHeader";
import SmallCard2 from "./../components/common/SmallCard2";
import MentorDetailCard from "./../components/common/MentorDetailCard"
import CustomDataTable from "./../components/common/CustomDataTable";
import { Badge } from "shards-react";

const Recommended = ({ smallCards, tHistory, columns, mentorData }) => (
  <Container fluid className="main-content-container px-4 main-content-container-class">
    <Row noGutters className="page-header py-4">
      <Col xs="12" sm="12" className="page-title">
        <h3>Recommended mentors for you</h3>
      </Col>
    </Row>

    <Row className="no-padding">
      <Col lg="12" md="12" sm="12">
        {mentorData.map((data, idx) =>(
          <MentorDetailCard mentorData={data} key={idx}/>
        ))}
      </Col>
    </Row>
  </Container>
);

Recommended.propTypes = {
  smallCards: PropTypes.array,
  tHistory: PropTypes.array,
  columns: PropTypes.array,
  mentorData: PropTypes.array,
};

Recommended.defaultProps = {
  mentorData: [
    {
      name: "Kianna Press",
      score: 4.8,
      image: require("../images/Rectangle_Kianna_big.png"),
      teaches: [
        "Algebra",
        "Mathematics",
      ],
      online: true,
      description: "I'm currently doing my PhD in statistical Physics. I can help you with conceptual and mathematical aspects of classical mechanics, quantum mechanics, statistical mechanics, electrodynamics, mathematical methods for every students and subjects.",
      rate: 25,
      time: 60,
    },
    {
      name: "Rayna Korsgaard",
      score: 4.8,
      image: require("../images/Rectangle_Rayna_big.png"),
      teaches: [
        "Algebra",
        "Mathematics",
      ],
      online: false,
      description: "I'm currently doing my PhD in statistical Physics. I can help you with conceptual and mathematical aspects of classical mechanics, quantum mechanics, statistical mechanics, electrodynamics, mathematical methods for every students and subjects.",
      rate: 35,
      time: 60,
    },
    {
      name: "Malcom Wiliam",
      score: 5.0,
      image: require("../images/Rectangle_K.png"),
      teaches: [
        "Physics",
        "Mathematics",
      ],
      online: true,
      description: "I'm currently doing my PhD in statistical Physics. I can help you with conceptual and mathematical aspects of classical mechanics, quantum mechanics, statistical mechanics, electrodynamics, mathematical methods for every students and subjects.",
      rate: 35,
      time: 60,
    },
    {
      name: "Rayna Korsgaard",
      score: 4.8,
      image: require("../images/Rectangle_Rayna_big.png"),
      teaches: [
        "Algebra",
        "Mathematics",
      ],
      online: false,
      description: "I'm currently doing my PhD in statistical Physics. I can help you with conceptual and mathematical aspects of classical mechanics, quantum mechanics, statistical mechanics, electrodynamics, mathematical methods for every students and subjects.",
      rate: 35,
      time: 60,
    },
    {
      name: "Rayna Korsgaard",
      score: 4.8,
      image: require("../images/Rectangle_Rayna_big.png"),
      teaches: [
        "Algebra",
        "Mathematics",
      ],
      online: false,
      description: "I'm currently doing my PhD in statistical Physics. I can help you with conceptual and mathematical aspects of classical mechanics, quantum mechanics, statistical mechanics, electrodynamics, mathematical methods for every students and subjects.",
      rate: 35,
      time: 60,
    }
  ]
};

export default Recommended;