import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import { Link } from "react-router-dom";

import SubscriptionTable from "./../components/common/SubscriptionTable";

const Subscriptions = ({ subscriptionList, columns }) => (
  <Container fluid className="main-content-container px-4 main-content-container-class">
    <Row className="wallet-data-table-class py-4">
      <Col lg="12" md="12" sm="12">
        <SubscriptionTable data={subscriptionList} header={columns}/>
      </Col>
    </Row>
  </Container>
);

Subscriptions.propTypes = {
  subscriptionList: PropTypes.array,
  columns: PropTypes.array,
};

Subscriptions.defaultProps = {
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
      cell: row => <div><img src={row.avatar} className="subscription-mentor-avatar" alt="User avatar" /><Link to="/subscription-specific" class="scription-to-specific">{row.mentorName}</Link></div>,
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

export default Subscriptions;
