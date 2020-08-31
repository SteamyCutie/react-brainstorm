import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormInput, FormGroup, FormSelect, Form, FormTextarea } from "shards-react";
import { Link } from "react-router-dom";

import MentorVideo from "../components/common/MentorVideo";

import MentorAvatar from "../images/Rectangle_K.png"
import Icon from "../images/Lightning.svg"
import Tooltip from "../images/Tooltip.svg"

const Profile = ({ subscriptionList, columns }) => (
  <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
    <Card small className="profile-setting-card">
      <CardBody>
        <Row>
          <Col xl="3" className="subscription-mentor-detail">
            <div >
              <h2>Profile Setting</h2>
              <img src={MentorAvatar} alt="avatar"/>
            </div>
          </Col>
          <Col xl="9" lg="12" className="profile-setting-detail">
            <div className="right">
              <FormCheckbox toggle normal className="instant-call-toggle">
                <img src={Icon} alt="icon" style={{paddingRight: "5px", paddingBottom: "5px"}}/>
                Instant call
                <img src={Tooltip} alt="icon" style={{paddingLeft: "5px", paddingBottom: "5px"}}/>
              </FormCheckbox>
            </div>
            <div className="profile-detail">
              <Row>
                <Col>
                  <Form>
                    <Row form>
                      <Col md="6" className="project-detail-input-group">
                        <label htmlFor="feEmailAddress" className="profile-detail-important">Full Name</label>
                        <FormInput className="profile-detail-input" placeholder="Full Name" />
                      </Col>
                      <Col md="6" className="project-detail-input-group">
                        <label htmlFor="fePassword">Date of birth</label>
                        <FormInput className="profile-detail-input" placeholder="Date of Birth" />
                      </Col>
                    </Row>
                    <Row form>
                      <Col md="6" className="project-detail-input-group">
                        <label htmlFor="feEmailAddress" className="profile-detail-important">Email</label>
                        <FormInput className="profile-detail-input" placeholder="Email" />
                      </Col>
                      <Col md="6" className="project-detail-input-group">
                        <label htmlFor="feInputState" className="profile-detail-important" >Expertise</label>
                        <FormSelect id="feInputState" className="profile-detail-input">
                          <option>Intermediate</option>
                          <option>...</option>
                        </FormSelect>
                      </Col>
                    </Row>
                    <Row form>
                      <Col md="6" className="project-detail-input-group">
                        <label htmlFor="feEmailAddress" className="profile-detail-important">Hourly price</label>
                        <FormInput className="profile-detail-input no-margin" placeholder="Hourly price" />
                        <label className="profile-detail-comment">
                          You get 80% of your price. (0.00 $) Remaining 20% goes to admin. (0.00 $)
                        </label>
                      </Col>
                      <Col md="6" className="project-detail-input-group">
                        <label htmlFor="fePassword">Video url</label>
                        <FormInput className="profile-detail-input" placeholder="Video url" />
                      </Col>
                    </Row>
                    <Row form>
                      <Col md="6" className="project-detail-input-group">
                        <label htmlFor="feEmailAddress" className="profile-detail-important">Subscription Page Name</label>
                        <FormInput className="profile-detail-input no-margin" placeholder="Subscription Page Name" />
                      </Col>
                      <Col md="6" className="project-detail-input-group">
                        <label htmlFor="fePassword" className="profile-detail-important">Subscription plan fee</label>
                        <FormInput className="profile-detail-input no-margin" placeholder="Subscription plan fee" />
                        <label className="profile-detail-comment">
                          You get 80% of your price. (0.00 $) Remaining 20% goes to admin. (0.00 $)
                        </label>
                      </Col>
                    </Row>
                    <Row form>
                      <label htmlFor="feEmailAddress" className="project-detail-input-group">Description</label>
                      <FormTextarea placeholder="Type here" className="profile-detail-desc profile-detail-input"/>
                    </Row>
                    <Row className="profile-detail-save center">
                      <Button className="btn-profile-detail-save">Save</Button>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>    
  </Container>
);

Profile.propTypes = {
  subscriptionList: PropTypes.array,
  columns: PropTypes.array,
};

Profile.defaultProps = {
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

export default Profile;
