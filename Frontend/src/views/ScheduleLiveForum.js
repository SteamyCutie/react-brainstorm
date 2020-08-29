import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import { Link } from "react-router-dom";
import SmallCardForum from "../components/common/SmallCardForum"

import MentorVideo from "../components/common/MentorVideo";

import MentorAvatar from "../images/Rectangle_Kianna_big.png"
import SubscriperImg from "../images/Users.svg"

const ScheduleLiveForum = ({ subscriptionList, columns }) => (
  <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
    <Card small className="schedule-forum-card">
      <CardHeader className="live-forum-header">
        <h5 className="live-forum-header-title no-margin">Schedule live forum</h5>
        <Button className="live-forum-header-button">Create live forum</Button>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xl="4" lg="4" sm="6">
            <SmallCardForum />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCardForum />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCardForum />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCardForum />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCardForum />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCardForum />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCardForum />
          </Col>
        </Row>
      </CardBody>
    </Card>    
  </Container>
);

ScheduleLiveForum.propTypes = {
  subscriptionList: PropTypes.array,
  columns: PropTypes.array,
};

ScheduleLiveForum.defaultProps = {
  subscriptionList: [
    {
      id: 1,
      avatar: require("../images/avatar1.jpg"),
      mentorName: "Kianna Press",
      pageName: "Algebra 101",
      planFee: 49.99,
      status: true,
      edit: true
    },
    {
      id: 2,
      avatar: require("../images/avatar2.jpg"),
      mentorName: "Cristofer Septimus",
      pageName: "Video editing",
      planFee: 29.50,
      status: true,
      edit: true
    },
    {
      id: 3,
      avatar: require("../images/avatar3.jpg"),
      mentorName: "Martin Geidt",
      pageName: "Finance",
      planFee: "29.50",
      status: true,
      edit: true
    },
    {
      id: 4,
      avatar: require("../images/avatar4.jpg"),
      mentorName: "Kaiya Torff",
      pageName: "Programming",
      planFee: 32.40,
      status: false,
      edit: false
    }
  ],
  columns: [
    {
      name: 'Mentor',
      selector: 'mentorName',
      sortable: false,
      style: {
        fontSize: "16px",
      },
      cell: row => <div><img src={row.avatar} className="subscription-mentor-avatar" /><a href="#" class="scription-to-specific">{row.mentorName}</a></div>,
    },
    {
      name: 'Subscription page name',
      selector: 'pageName',
      sortable: false,
      style: {
        fontSize: "16px",
      },
    },
    {
      name: 'Subscription plan fee',
      selector: 'planFee',
      sortable: false,
      style: {
        fontSize: "16px",
      },
      format: row => `$${row.planFee}`,
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: false,
      style: {
        fontSize: "16px",
      },
      cell: row => <div>{row.status === true ? "Active" : "Inactive"}</div>,
    },
    {
      name: 'Edit',
      selector: 'edit',
      sortable: false,
      center: true,
      cell: row => <div className={row.edit === true ? "subscription-edit-unsubscribe" : "subscription-edit-resubscribe" }>{row.edit === true ? "Unsubscribe" : "Resubscribe"}</div>,
    }
  ]
};

export default ScheduleLiveForum;
