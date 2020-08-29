import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import { Link } from "react-router-dom";
import SmallCard3 from "../components/common/SmallCard3"

import MentorVideo from "../components/common/MentorVideo";

import MentorAvatar from "../images/Rectangle_Kianna_big.png"
import SubscriperImg from "../images/Users.svg"

const StudentSession = ({ subscriptionList, columns }) => (
  <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
    <Row noGutters className="page-header py-4">
      <Col className="page-title">
        <h3>Upcoming session</h3>
      </Col>
      <Button className="btn-add-payment">Find a mentor</Button>
    </Row>
    <Card small className="history-card">
      <CardHeader className="history-card-header">
        <h5 className="history-card-header-title no-margin">Filter by:</h5>
        <div className="filter-items-group">
          <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
            Date:
          </label>
          <FormSelect style={{height: "30px", width: "180px", marginRight: "10px"}}>
            <option>Augut 10 - August 16</option>
            <option>...</option>
          </FormSelect>
          <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
            Sessions:
          </label>
          <FormSelect style={{height: "30px", width: "80px", marginRight: "10px"}}>
            <option>All</option>
            <option>...</option>
          </FormSelect>
          <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
            Category:
          </label>
          <FormSelect style={{height: "30px", width: "130px", marginRight: "10px"}}>
            <option>Select category</option>
            <option>...</option>
          </FormSelect>
          <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
            Mentor:
          </label>
          <FormSelect style={{height: "30px", width: "120px", marginRight: "10px"}}>
            <option>Select mentor</option>
            <option>...</option>
          </FormSelect>
        </div>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xl="4" lg="4" sm="6">
            <SmallCard3 />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCard3 />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCard3 />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCard3 />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCard3 />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCard3 />
          </Col>
          <Col xl="4" lg="4" sm="6">
            <SmallCard3 />
          </Col>
        </Row>
      </CardBody>
    </Card>    
  </Container>
);

History.propTypes = {
  subscriptionList: PropTypes.array,
  columns: PropTypes.array,
};

History.defaultProps = {
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

export default StudentSession;
