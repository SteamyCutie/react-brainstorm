import React, { useEffect, createRef, useRef } from "react";
import PropTypes from "prop-types";
import Loader from 'react-loader-spinner';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormInput, FormGroup, FormSelect, Form, FormTextarea, DatePicker, Alert } from "shards-react";
import expertise from '../common/constants';
import MentorVideo from "../components/common/MentorVideo";

import MentorAvatar from "../images/Rectangle_K.png"
import Icon from "../images/Lightning.svg"
import Tooltip from "../images/Tooltip.svg"
import { editprofile, getuserinfo, uploadimage } from '../api/api';
import { parsePath } from "history";
import zIndex from "@material-ui/core/styles/zIndex";

export default class MySharePage extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      loading: false,
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
        avatar: '',
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
      this.setState({loading: true});
      const result = await getuserinfo({email: localStorage.getItem('email')});
      if (result.data.result == "success") {
        const {param} = this.state;
        let temp = param;
        temp.fullname = result.data.data.name;
        temp.birthday = result.data.data.dob;
        temp.email = result.data.data.email;
        temp.avatar = result.data.data.avatar;
        temp.description = result.data.data.description;
        temp.hourlyprice = result.data.data.hourly_price;
        temp.subpagename = result.data.data.sub_page_name;
        temp.subplanfee = result.data.data.sub_plan_fee;
        temp.videourl = result.data.data.video_url;
        temp.expertise = result.data.data.expertise;
        this.setState({
          param: temp,
          displaygethourlyprice: (parseInt(result.data.data.hourly_price)*0.8).toFixed(2),
          displaycuthourlyprice: (parseInt(result.data.data.hourly_price)*0.2).toFixed(2),
          displaygetplanfee: (parseInt(result.data.data.sub_plan_fee)*0.8).toFixed(2),
          displaycutplanfee: (parseInt(result.data.data.sub_plan_fee)*0.2).toFixed(2),
        });
        this.setState({loading: false});
        store.addNotification({
          title: "Success",
          message: "Action Success!",
          type: "success",
          insert: "top",
          container: "top-left",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
      } else {
        store.addNotification({
          title: "Failed",
          message: "Action Failed!",
          type: "danger",
          insert: "top",
          container: "top-left",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
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
      this.setState({loading: true});
      const result = await editprofile(this.state.param);
      if (result.data.result == "success") {
        this.setState({loading: false});
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
          this.setState({loading: false});
        } else {
          alert(result.data.message);
        }
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
    console.log("111");
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
      this.setState({loading: true});
      const result = await uploadimage(formData);
      if (result.data.result == "success") {
        const {param} = this.state;
        let temp = param;
        temp.avatar = result.data.data;
        this.setState({param: temp});
      } else {
        console.log(result.data.message);
      }
      this.setState({loading: false});
    } catch(err) {
      console.log(err, "--------");
      alert(err);
    };
  }

  render() {
    return (
      <>
      {this.state.loading && <Loader type="ThreeDots" color="#04B5FA" height="100" width="100" style={{position: 'fixed', zIndex: '1', left: '50%', top: '50%'}}/>}
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
        <ReactNotification />
        <Card small className="profile-setting-card">
          <CardBody>
            <Row>
              <Col xl="3" className="subscription-mentor-detail">
                <div>
                  <h2>Profile Setting</h2>
                  <div className="avatar-tooltip"><img className="avatar" src={this.state.param.avatar} alt="avatar" onClick={() => this.onDrop()} /><span className="avatar-tooltiptext">Change your avatar</span></div>
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
                            {this.state.requiremessage.dfullname != '' && <span className="require-message">{this.state.requiremessage.dfullname}</span>}
                            <FormInput className="profile-detail-input" placeholder="Full Name" onChange={(e) => this.onChangeFullName(e)} value={this.state.param.fullname}/>
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <div><label htmlFor="fePassword">Date of birth</label></div>
                            <DatePicker
                              md="6"
                              size="lg"
                              selected={this.state.displaydate}
                              onChange={(e) => this.onChangeBirthDay(e)}
                              value={this.state.param.birthday}
                              placeholderText="Date of birth"
                              dropdownMode="select"
                              className="text-center"
                            />
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Email</label>
                            {this.state.requiremessage.demail != '' && <span className="require-message">{this.state.requiremessage.demail}</span>}
                            <FormInput className="profile-detail-input" type="email" placeholder="Email" onChange={(e) => this.onChangeEmail(e)} value={this.state.param.email}/>
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feInputState" className="profile-detail-important" >Expertise</label>
                            {this.state.requiremessage.dexpertise != '' && <span className="require-message">{this.state.requiremessage.dexpertise}</span>}
                            <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeExpertise(e)}>
                              {expertise.map((item, index) =>
                                item.value == this.state.param.expertise ? <option value={item.value} selected>{item.name}</option> : <option value={item.value}>{item.name}</option>
                              )}
                            </FormSelect>
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Hourly price</label>
                            {this.state.requiremessage.dhourlyprice != '' && <span className="require-message">{this.state.requiremessage.dhourlyprice}</span>}
                            <FormInput className="profile-detail-input no-margin" type="number" placeholder="Hourly price" onChange={(e) => this.onChangeHourlyPrice(e)} value={this.state.param.hourlyprice}/>
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
                            {this.state.requiremessage.dsubpagename != '' && <span className="require-message">{this.state.requiremessage.dsubpagename}</span>}
                            <FormInput className="profile-detail-input no-margin" placeholder="Subscription Page Name" onChange={(e) => this.onChangeSubPageName(e)} value={this.state.param.subpagename}/>
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="fePassword" className="profile-detail-important">Subscription plan fee</label>
                            {this.state.requiremessage.dsubplanfee != '' && <span className="require-message">{this.state.requiremessage.dsubplanfee}</span>}
                            <FormInput className="profile-detail-input no-margin" type="number" placeholder="Subscription plan fee" onChange={(e) => this.onChangeSubPlanFee(e)} value={this.state.param.subplanfee}/>
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
      </>
    )
  }
};
