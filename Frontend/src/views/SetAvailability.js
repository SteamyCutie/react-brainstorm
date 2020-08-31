import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormInput, FormGroup, FormSelect, Form, FormTextarea } from "shards-react";
import { Link } from "react-router-dom";

import MentorVideo from "../components/common/MentorVideo";
import AvailableTimes from "../components/common/AvailableTimes";

import MentorAvatar from "../images/Rectangle_K.png"
import Icon from "../images/Lightning.svg"
import Tooltip from "../images/Tooltip.svg"

const SetAvailability = ({ subscriptionList, columns }) => (
  <Container fluid className="main-content-container px-4 pb-4 main-content-container-class">
    <Card small className="profile-setting-card">
      <CardBody>
        <Row className="center">
          <h2 className="availability-title">Set availability</h2>
        </Row>
        <Row className="availability-items center no-margin">
          <Form style={{width: "80%"}}>
            <Row form>
              <Col className="project-detail-input-group">
                <label htmlFor="feInputState" >Choose your timezone</label>
                <FormSelect id="feInputState" className="profile-detail-input">
                  <option>America New York (USA Eastern Time)</option>
                  <option>...</option>
                </FormSelect>
              </Col>
            </Row>
            <AvailableTimes day="Sunday"/>
            <AvailableTimes day="Monday"/>
            <AvailableTimes day="Tuesday"/>
            <AvailableTimes day="Wednesday"/>
            <AvailableTimes day="Thursday"/>
            <AvailableTimes day="Friday"/>
            <AvailableTimes day="Saturday"/>
            <Row className="profile-detail-save center">
              <Button className="btn-profile-detail-save">Save</Button>
            </Row>
          </Form>
        </Row>
      </CardBody>
    </Card>    
  </Container>
);

SetAvailability.propTypes = {
  subscriptionList: PropTypes.array,
  columns: PropTypes.array,
};

SetAvailability.defaultProps = {
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

export default SetAvailability;
