import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card, CardBody } from "shards-react";
import { Link } from "react-router-dom";

import MentorAvatar from "../images/Rectangle_Kianna_big.png"
import SubscriperImg from "../images/Users.svg"

const SpecificSubscription = ({ subscriptionList, columns }) => (
  <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
    <Card small className="specific-subsciption-card">
      <CardBody>
        <Row>
          <Link to="/subscriptions" className="hidden-underline">
            <Button className="btn-back-scriptions">
              Back
            </Button>
          </Link>
        </Row>
        <Row>
          <Col xl="3" className="subscription-mentor-detail">
            <div>
              <h2>Kianna Press</h2>
              <img src={MentorAvatar}  alt="avatar"/>
              <div style={{display: "flex", padding: "20px 0px"}}>
                <img src={SubscriperImg} style={{width: "22px", marginRight: "10px"}} alt="icon"/>
                <h6 className="no-margin" style={{paddingRight: "70px"}}>Subscribers</h6>
                <h6 className="no-margin"style={{fontWeight: "bold"}}>24</h6>
              </div>
              <Button className="btn-subscription-unsubscribe">
                Unsubscribe
              </Button>
            </div>
          </Col>
          <Col xl="9" lg="12" className="subscription-mentor-videos">
            {/* <MentorVideo />
            <MentorVideo />
            <MentorVideo /> */}
          </Col>
        </Row>
      </CardBody>
    </Card>    
  </Container>
);

SpecificSubscription.propTypes = {
  subscriptionList: PropTypes.array,
  columns: PropTypes.array,
};

SpecificSubscription.defaultProps = {
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
      cell: row => <div><img src={row.avatar} className="subscription-mentor-avatar" alt="avatar"/><a href="/#" class="scription-to-specific">{row.mentorName}</a></div>,
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

export default SpecificSubscription;
