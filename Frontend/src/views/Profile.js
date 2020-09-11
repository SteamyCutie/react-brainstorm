import React, { useEffect, createRef, useRef } from "react";
import PropTypes from "prop-types";
import ImageUploader from 'react-images-upload';
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormInput, FormGroup, FormSelect, Form, FormTextarea, DatePicker, FormRadio } from "shards-react";
import expertise from '../common/constants';
import MentorVideo from "../components/common/MentorVideo";

import MentorAvatar from "../images/Rectangle_K.png"
import Icon from "../images/Lightning.svg"
import Tooltip from "../images/Tooltip.svg"
import { editprofile, getuserinfo, uploadimage } from '../api/api';
import { parsePath } from "history";

export default class MySharePage extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      displaydate: undefined,
      displaygethourlyprice: '0.00',
      displaycuthourlyprice: '0.00',
      displaygetplanfee: '0.00',
      displaycutplanfee: '0.00',
      requiremessage: {
        dfullname: '',
        demail: '',
        dexpertise: '',
        dhourlyprice: '',
        dsubpagename: '',
        dsubplanfee:''
      },
      param: {
        fullname: '',
        birthday: undefined,
        email: '',
        description: '',
        expertise: 1,
        hourlyprice: '',
        subpagename: '',
        subplanfee: '',
        videourl: '',
        avatar: '555',
        instantcall: false
      }
    };
    this.onDrop = this.onDrop.bind(this);
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
        const {param} = this.state;
        let temp = param;
        temp.fullname = result.data.data.name;
        temp.birthday = result.data.data.dob;
        temp.email = result.data.data.email;
        temp.description = result.data.data.description;
        temp.hourlyprice = result.data.data.hourly_price;
        temp.subpagename = result.data.data.sub_page_name;
        temp.subplanfee = result.data.data.sub_plan_fee;
        temp.videourl = result.data.data.video_url;
        this.setState({param: temp});
        // this.setState({userInfo: result.data.data});
      } else {
        alert(result.data.message);
      }
    } catch(err) {
      alert(err);
    };
  }

  actionSave = async() => {
    const {requiremessage} = this.state;
    let temp = requiremessage;
    temp.dfullname = '';
    temp.demail = '';
    temp.dexpertise = '';
    temp.dhourlyprice = '';
    temp.dsubpagename = '';
    temp.dsubplanfee = '';
    this.setState({
      requiremessage: temp
    });
    try {
      const result = await editprofile(this.state.param);
      if (result.data.result == "success") {
        
      } else {
        if (result.data.type == 'require') {
          const {requiremessage} = this.state;
          let temp = requiremessage;
          if (result.data.message.fullname)
            temp.dfullname = result.data.message.fullname[0];
          if (result.data.message.email)
            temp.demail = result.data.message.email[0];
          if (result.data.message.expertise)
            temp.dexpertise = result.data.message.expertise[0];
          if (result.data.message.hourlyprice)
            temp.dhourlyprice = result.data.message.hourlyprice[0];
          if (result.data.message.subpagename)
            temp.dsubpagename = result.data.message.subpagename[0];
          if (result.data.message.subplanfee)
            temp.dsubplanfee = result.data.message.subplanfee[0];
          this.setState({
            requiremessage: temp
          });
        } else {
          alert(result.data.message);
        }
      }
    } catch(err) {
      alert(err);
    };
  };
  
  onChangeFullName = (e) => {
    console.log(e.target.value);
    const {param} = this.state;
    let temp = param;
    temp.fullname = e.target.value;
    this.setState({param: temp});
  };

  onChangeBirthDay = (e) => {
    const {param} = this.state;
    let temp = param;
    let date = new Date(e);
    let displaydate = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    temp.birthday = displaydate;
    this.setState({param: temp});
    this.setState({displaydate: date});
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
    let displaygethourlyprice, displaycuthourlyprice  = '';
    if (e.target.value == '') {
      displaygethourlyprice = '0.00';
      displaycuthourlyprice = '0.00';
    } else {
      displaygethourlyprice = (parseInt(e.target.value)*0.8).toFixed(2);
      displaycuthourlyprice = (parseInt(e.target.value)*0.2).toFixed(2);  
    }
    
    this.setState({param: temp});
    this.setState({displaygethourlyprice: displaygethourlyprice});
    this.setState({displaycuthourlyprice: displaycuthourlyprice});
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
    let displaygetplanfee, displaycutplanfee  = '';
    if (e.target.value == '') {
      displaygetplanfee = '0.00';
      displaycutplanfee = '0.00';
    } else {
      displaygetplanfee = (parseInt(e.target.value)*0.8).toFixed(2);
      displaycutplanfee = (parseInt(e.target.value)*0.2).toFixed(2);
    }
    this.setState({param: temp});
    this.setState({displaygetplanfee: displaygetplanfee});
    this.setState({displaycutplanfee: displaycutplanfee});
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

  onDrop() {
    const node = this.myRef.current;
    node.click();
  }

  onChangeAvatar = async(e) => {
    const formData = new FormData();
    formData.append('files[]', e.target.files[0]);
    try {
      const result = await uploadimage(formData);
      if (result.data.result == "success") {
        console.log(result.data.data);
        // const {param} = this.state;
        // let temp = param;
        // temp.avatar = result.data.result;
      } else {
        console.log(result.data.message, "++++++++++");
        console.log(result);
      }
    } catch(err) {
      console.log(err, "--------");
      alert(err);
    };
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
                  <img src={MentorAvatar} alt="avatar" onClick={() => this.onDrop()}/>
                  <input type="file" hidden ref={this.myRef} onChange={(e) => this.onChangeAvatar(e)}></input>
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
                            <FormInput className="profile-detail-input" placeholder="Full Name" onChange={(e) => this.onChangeFullName(e)} value={this.state.param.fullname}/>
                            {this.state.requiremessage.dfullname != '' && <p className="require-message">{this.state.requiremessage.dfullname}</p>}
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <div><label htmlFor="fePassword">Date of birth</label></div>
                            <DatePicker
                              md="6"
                              size="lg"
                              selected={this.state.displaydate}
                              onChange={(e) => this.onChangeBirthDay(e)}
                              placeholderText="Date of birth"
                              dropdownMode="select"
                              className="text-center"
                            />
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Email</label>
                            <FormInput className="profile-detail-input" type="email" placeholder="Email" onChange={(e) => this.onChangeEmail(e)} value={this.state.param.email}/>
                            {this.state.requiremessage.demail != '' && <p className="require-message">{this.state.requiremessage.demail}</p>}
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feInputState" className="profile-detail-important" >Expertise</label>
                            <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeExpertise(e)} >
                              {expertise.map((item, index) =>
                                <option value={item.value}>{item.name}</option>  
                              )}
                            </FormSelect>
                            {this.state.requiremessage.dexpertise != '' && <p className="require-message">{this.state.requiremessage.dexpertise}</p>}
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Hourly price</label>
                            <FormInput className="profile-detail-input no-margin" type="number" placeholder="Hourly price" onChange={(e) => this.onChangeHourlyPrice(e)} value={this.state.param.hourlyprice}/>
                            {this.state.requiremessage.dhourlyprice != '' && <p className="require-message">{this.state.requiremessage.dhourlyprice}</p>}
                            <label className="profile-detail-comment">
                              <span>You get 80% of your price. ({this.state.displaygethourlyprice} $)</span><br></br>
                              Remaining 20% goes to admin. ({this.state.displaycuthourlyprice} $)
                            </label>
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="fePassword">Video url</label>
                            <FormInput className="profile-detail-input" placeholder="Video url" onChange={(e) => this.onChangeVideoUrl(e)} value={this.state.param.videourl}/>
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Subscription Page Name</label>
                            <FormInput className="profile-detail-input no-margin" placeholder="Subscription Page Name" onChange={(e) => this.onChangeSubPageName(e)} value={this.state.param.subpagename}/>
                            {this.state.requiremessage.dsubpagename != '' && <p className="require-message">{this.state.requiremessage.dsubpagename}</p>}
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="fePassword" className="profile-detail-important">Subscription plan fee</label>
                            <FormInput className="profile-detail-input no-margin" type="number" placeholder="Subscription plan fee" onChange={(e) => this.onChangeSubPlanFee(e)} value={this.state.param.subplanfee}/>
                            {this.state.requiremessage.dsubplanfee != '' && <p className="require-message">{this.state.requiremessage.dsubplanfee}</p>}
                            <label className="profile-detail-comment">
                              <span>You get 80% of your price. ({this.state.displaygetplanfee} $)</span><br></br>
                              Remaining 20% goes to admin. ({this.state.displaycutplanfee} $)
                            </label>
                          </Col>
                        </Row>
                        <Row form>
                          <label htmlFor="feEmailAddress" className="project-detail-input-group">Description</label>
                          <FormTextarea placeholder="Type here" className="profile-detail-desc profile-detail-input" onChange={(e) => this.onChangeDescription(e)} value={this.state.param.description}/>
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
