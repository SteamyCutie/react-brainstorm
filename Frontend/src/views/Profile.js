import React, { useEffect, createRef, useRef } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormInput, FormGroup, FormSelect, Form, FormTextarea } from "shards-react";
import { Link } from "react-router-dom";
import MentorVideo from "../components/common/MentorVideo";

import MentorAvatar from "../images/Rectangle_K.png"
import Icon from "../images/Lightning.svg"
import Tooltip from "../images/Tooltip.svg"
import { editprofile, getuserinfo } from '../api/api';
import { parsePath } from "history";

export default class MySharePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      param: {
        fullname: '',
        birthday: '',
        email: '',
        description: '',
        expertise: '',
        hourlyprice: '',
        subpagename: '',
        subplanfee: '',
        videourl: '',
        instantcall: false
      }
    };
  }

  componentWillMount() {
    const {param} = this.state;
    let temp = param;
    temp.email = localStorage.getItem('email');
    this.setState({param: temp});
    this.getUserInformation();
  }

  getUserInformation = async() => {
    try {
      const result = await getuserinfo({email: localStorage.getItem('email')});
      if (result.data.result == "success") {
        this.setState({userInfo: result.data.data});
      } else {
        alert(result.data.message);
      }
    } catch(err) {
      alert(err);
    };
  }

  actionSave = async() => {
    try {
      const result = await editprofile(this.state.param);
      if (result.data.result == "success") {
        
      } else {
        alert(result.data.message);
      }
    } catch(err) {
      alert(err);
    };
  };
  
  onChangeFullName = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.fullname = e.target.value;
    this.setState({param: temp});
  };

  onChangeBirthDay = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.birthday = e.target.value;
    this.setState({param: temp});
  };

  onChangeEmail = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.email = e.target.value;
    this.setState({param: temp});
  }

  onChangeDescription = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.description = e.target.value;
    this.setState({param: temp});
  }

  onChangeExpertise = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.expertise = e.target.value;
    this.setState({param: temp});
  }

  onChangeHourlyPrice = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.hourlyprice = e.target.value;
    this.setState({param: temp});
  }

  onChangeSubPageName = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.subpagename = e.target.value;
    this.setState({param: temp});
  }

  onChangeSubPlanFee = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.subplanfee = e.target.value;
    this.setState({param: temp});
  }

  onChangeVideoUrl = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.videourl = e.target.value;
    this.setState({param: temp});
  }

  onChangeInstantCall = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.instantcall = !this.state.param.instantcall;
    this.setState({param: temp});
  }

  render() {
    return (
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
                  <FormCheckbox toggle normal className="instant-call-toggle" onChange={(e) => this.onChangeInstantCall(e)} >
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
                            <FormInput className="profile-detail-input" placeholder="Full Name" onChange={(e) => this.onChangeFullName(e)} />
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="fePassword">Date of birth</label>
                            <FormInput className="profile-detail-input" placeholder="Date of Birth" onChange={(e) => this.onChangeBirthDay(e)} />
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Email</label>
                            <FormInput className="profile-detail-input" placeholder="Email" onChange={(e) => this.onChangeEmail(e)} value={this.state.userInfo.email} />
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feInputState" className="profile-detail-important" >Expertise</label>
                            <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeExpertise(e)} >
                              <option>Intermediate</option>
                              <option>...</option>
                            </FormSelect>
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Hourly price</label>
                            <FormInput className="profile-detail-input no-margin" placeholder="Hourly price" onChange={(e) => this.onChangeHourlyPrice(e)} />
                            <label className="profile-detail-comment">
                              You get 80% of your price. (0.00 $) Remaining 20% goes to admin. (0.00 $)
                            </label>
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="fePassword">Video url</label>
                            <FormInput className="profile-detail-input" placeholder="Video url" onChange={(e) => this.onChangeVideoUrl(e)} />
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Subscription Page Name</label>
                            <FormInput className="profile-detail-input no-margin" placeholder="Subscription Page Name" onChange={(e) => this.onChangeSubPageName(e)} />
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="fePassword" className="profile-detail-important">Subscription plan fee</label>
                            <FormInput className="profile-detail-input no-margin" placeholder="Subscription plan fee" onChange={(e) => this.onChangeSubPlanFee(e)} />
                            <label className="profile-detail-comment">
                              You get 80% of your price. (0.00 $) Remaining 20% goes to admin. (0.00 $)
                            </label>
                          </Col>
                        </Row>
                        <Row form>
                          <label htmlFor="feEmailAddress" className="project-detail-input-group">Description</label>
                          <FormTextarea placeholder="Type here" className="profile-detail-desc profile-detail-input" onChange={(e) => this.onChangeDescription(e)} />
                        </Row>
                        <Row className="profile-detail-save center">
                          <Button className="btn-profile-detail-save" onClick={() => this.actionSave()}>Save</Button>
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
    )
  }
};
