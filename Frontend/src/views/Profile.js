import React from "react";
import MultiSelect from "react-multi-select-component";
import { ToastsStore } from 'react-toasts';
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormInput, FormSelect, Form, FormTextarea, Popover, PopoverBody } from "shards-react";
import { expertise, category, subcategory, minimum_age } from '../common/constants';
import LoadingModal from "../components/common/LoadingModal";
import Icon from "../images/Lightning.svg";
import Question from "../images/question.svg";
import Tooltip from "../images/Tooltip.svg";
import avatar from "../images/avatar.jpg";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { editprofile, getuserinfo, uploadimage, gettags, signout, getlanguages } from '../api/api';
import 'moment/locale/it.js';
import { DatePickerInput } from "rc-datepicker";
import 'moment/locale/el.js';
import 'rc-datepicker/lib/style.css';

export default class MySharePage extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      selectedTags: [],
      tags: [],
      language: [],
      selectedLanguages: [],
      loading: false,
      open: false,
      displaydate: '',
      displaygethourlyprice: '0.00',
      displaycuthourlyprice: '0.00',
      displaygetplanfee: '0.00',
      displaycutplanfee: '0.00',
      requiremessage: {
        dname: '',
        demail: '',
        dexpertise: '',
        dcategory: '',
        dage: '',
        dsubcategory: '',
        dhourlyprice: '',
        dsubpagename: '',
        dsubplanfee: '',
        videourl: ''
      },
      param: {
        name: '',
        birthday: '',
        email: '',
        phone: '',
        description: '',
        expertise: 1,
        category: 1,
        subcategory: 1,
        minimum_age: 1,
        hourlyprice: 0,
        subpagename: '',
        subplanfee: 0,
        videourl: '',
        avatar: '',
        instantcall: false,
        is_mentor: false,
        tags: [],
        language: []
      }
    };
    this.onDrop = this.onDrop.bind(this);
  }

  componentWillMount() {
    let { param } = this.state;
    param.email = localStorage.getItem('email');
    this.setState({ param });
    this.getUserInformation();
    this.getAllTags();
    this.getAllLanguages();
  }

  componentDidMount() {
    document.getElementById('email').setAttribute('style', 'pointer-events : none !important');
  }

  getUserInformation = async () => {
    try {
      this.setState({ loading: true });
      const result = await getuserinfo({ email: localStorage.getItem('email') });
      if (result.data.result === "success") {
        let { param } = this.state;
        param.name = result.data.data.name;
        param.phone = result.data.data.phone;
        param.birthday = (result.data.data.dob === null || result.data.data.dob === "") ? '2020-01-01' : result.data.data.dob;
        param.email = result.data.data.email;
        param.avatar = result.data.data.avatar;
        param.description = result.data.data.description;
        param.hourlyprice = result.data.data.hourly_price;
        param.subpagename = result.data.data.sub_page_name;
        param.subplanfee = result.data.data.sub_plan_fee;
        param.videourl = result.data.data.video_url;
        param.expertise = result.data.data.expertise;
        param.instantcall = result.data.data.instant_call;
        param.is_mentor = result.data.data.is_mentor;
        param.tags = result.data.data.tags;
        param.language = result.data.data.language;

        let param1 = {
          label: '',
          value: 0
        };

        let params = [];
        let lparams = [];
        for (let i = 0; i < result.data.data.tags.length; i++) {
          param1.label = result.data.data.tags_name[i].trim();
          param1.value = parseInt(result.data.data.tags[i].trim());
          params.push(param1);
          param1 = {};
        }
        for (let i = 0; i < result.data.data.language.length; i++) {
          param1.label = result.data.data.languages_name[i].trim();
          param1.value = parseInt(result.data.data.language[i].trim());
          lparams.push(param1);
          param1 = {};
        }
        this.setState({
          param,
          displaygethourlyprice: (parseFloat(result.data.data.hourly_price) * 0.8).toFixed(2),
          displaycuthourlyprice: (parseFloat(result.data.data.hourly_price) * 0.2).toFixed(2),
          displaygetplanfee: (parseFloat(result.data.data.sub_plan_fee) * 0.8).toFixed(2),
          displaycutplanfee: (parseFloat(result.data.data.sub_plan_fee) * 0.2).toFixed(2),
          selectedTags: params,
          selectedLanguages: lparams
        });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  getAllLanguages = async () => {
    try {
      const result = await getlanguages();
      if (result.data.result === "success") {
        let param = {
          label: '',
          value: ''
        };
        let params = [];
        for (var i = 0; i < result.data.data.length; i++) {
          param.label = result.data.data[i].language;
          param.value = result.data.data[i].id;
          params.push(param);
          param = {};
        }
        this.setState({ language: params });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
    } catch (err) {
      ToastsStore.error("Something Went wrong");
    };
  }

  getAllTags = async () => {
    try {
      const result = await gettags();
      if (result.data.result === "success") {
        let param = {
          label: '',
          value: ''
        };

        let params = [];

        for (var i = 0; i < result.data.data.length; i++) {
          param.label = result.data.data[i].name;
          param.value = result.data.data[i].id;
          params.push(param);
          param = {};
        }
        this.setState({ tags: params });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
    } catch (err) {
      ToastsStore.error("Something Went wrong");
    };
  }

  onChangeTags = (e) => {
    let temp = e;
    this.setState({ selectedTags: temp });

    if (e.length > 0) {
      let { param } = this.state;
      param.tags = [];
      for (var i = 0; i < e.length; i++) {
        param.tags.push(e[i].value);
      }
      this.setState({ param });
    } else {
      let { param } = this.state;
      param.tags = [];
      this.setState({ param });
    }
  }

  onChangeLanguages = (e) => {
    let temp = e;
    this.setState({ selectedLanguages: temp });

    if (e.length > 0) {
      let { param } = this.state;
      param.language = [];
      for (var i = 0; i < e.length; i++) {
        param.language.push(e[i].value);
      }
      this.setState({ param });
    } else {
      let { param } = this.state;
      param.language = [];
      this.setState({ param });
    }
  }

  onChangeExpertise = (e) => {
    let { param } = this.state;
    param.expertise = e.target.value;
    this.setState({ param });
  }

  actionSave = async () => {
    let { requiremessage, param } = this.state;
    requiremessage.dname = '';
    requiremessage.demail = '';
    requiremessage.dexpertise = '';
    requiremessage.dcategory = '';
    requiremessage.dage = '';
    requiremessage.dsubcategory = '';
    requiremessage.dhourlyprice = '';
    requiremessage.dsubpagename = '';
    requiremessage.dsubplanfee = '';
    requiremessage.videourl = '';
    this.setState({
      requiremessage
    });
    try {
      this.setState({ loading: true });
      const result = await editprofile(param);
      if (result.data.result === "success") {
        this.setState({ loading: false });
        localStorage.setItem('avatar', param.avatar);
        localStorage.setItem('user_name', param.name);
        ToastsStore.success("Edit Profile Success");
        localStorage.setItem('user-type', (param.is_mentor === 1 ? true : false));
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.type === "require") {
          let { requiremessage } = this.state;
          if (result.data.message.name) {
            requiremessage.dname = result.data.message.name[0];
          }
          if (result.data.message.email) {
            requiremessage.demail = result.data.message.email[0];
          }
          if (result.data.message.expertise) {
            requiremessage.dexpertise = result.data.message.expertise[0];
          }
          if (result.data.message.expertise) {
            requiremessage.dcategory = result.data.message.category[0];
          }
          if (result.data.message.expertise) {
            requiremessage.dage = result.data.message.minimum_age[0];
          }
          if (result.data.message.expertise) {
            requiremessage.dsubcategory = result.data.message.subcategory[0];
          }
          if (result.data.message.hourlyprice) {
            requiremessage.dhourlyprice = result.data.message.hourlyprice[0];
          }
          if (result.data.message.subpagename) {
            requiremessage.dsubpagename = result.data.message.subpagename[0];
          }
          if (result.data.message.subplanfee) {
            requiremessage.dsubplanfee = result.data.message.subplanfee[0];
          }
          if (result.data.message.videourl) {
            requiremessage.videourl = result.data.message.videourl[0];
          }
          this.setState({
            requiremessage
          });
        } else {
          if (result.data.message === "Token is Expired") {
            ToastsStore.error(result.data.message);
            this.signout();
          } else if (result.data.message === "Token is Invalid") {
            ToastsStore.error(result.data.message);
            this.signout();
          } else if (result.data.message === "Authorization Token not found") {
            ToastsStore.error(result.data.message);
            this.signout();
          } else {
            ToastsStore.error(result.data.message);
          }
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  };

  onChangeFullName = (e) => {
    var array = e.target.value.split("");
    if (array.length > 30) {
      return;
    }
    let { param } = this.state;
    param.name = e.target.value;
    this.setState({ param });
  };

  onChangePhoneNumber = (phone) => {
    let { param } = this.state;
    param.phone = phone;
    this.setState({ param });
  };

  onChangeBirthDay = (e) => {
    let { param } = this.state;
    let date = new Date(e);
    let displaydate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    param.birthday = displaydate;
    this.setState({ param });
    this.setState({ displaydate: date });
  };

  onChangeEmail = (e) => {
    let { param } = this.state;
    param.email = e.target.value;
    this.setState({ param });
  }

  onChangeDescription = (e) => {
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
    let { param } = this.state;
    param.description = e.target.value;
    this.setState({ param });
  }

  onChangeCategory = (e) => {
    let { param } = this.state;
    param.catetory = e.target.value;
    this.setState({ param });
  }

  onChangeSubcategory = (e) => {
    let { param } = this.state;
    param.subcategory = e.target.value;
    this.setState({ param });
  }

  onChangeAge = (e) => {
    let { param } = this.state;
    param.minimum_age = e.target.value;
    this.setState({ param });
  }

  onChangeHourlyPrice = (e) => {
    let { param } = this.state;
    param.hourlyprice = e.target.value;
    let displaygethourlyprice, displaycuthourlyprice = '';
    if (e.target.value === '') {
      displaygethourlyprice = '0.00';
      displaycuthourlyprice = '0.00';
    } else {
      displaygethourlyprice = (parseFloat(e.target.value) * 0.8).toFixed(2);
      displaycuthourlyprice = (parseFloat(e.target.value) * 0.2).toFixed(2);
    }

    this.setState({ param });
    this.setState({ displaygethourlyprice: displaygethourlyprice });
    this.setState({ displaycuthourlyprice: displaycuthourlyprice });
  }

  onChangeSubPageName = (e) => {
    var array = e.target.value.split("");
    if (array.length > 50) {
      return;
    }
    let { param } = this.state;
    param.subpagename = e.target.value;
    this.setState({ param });
  }

  onChangeSubPlanFee = (e) => {
    let { param } = this.state;
    param.subplanfee = e.target.value;
    let displaygetplanfee, displaycutplanfee = '';
    if (e.target.value === '') {
      displaygetplanfee = '0.00';
      displaycutplanfee = '0.00';
    } else {
      displaygetplanfee = (parseFloat(e.target.value) * 0.8).toFixed(2);
      displaycutplanfee = (parseFloat(e.target.value) * 0.2).toFixed(2);
    }
    this.setState({ param });
    this.setState({ displaygetplanfee: displaygetplanfee });
    this.setState({ displaycutplanfee: displaycutplanfee });
  }

  onChangeVideoUrl = (e) => {
    let { param } = this.state;
    param.videourl = e.target.value;
    this.setState({ param });
  }

  onChangeInstantCall = (e) => {
    let { param } = this.state;
    param.instantcall = !param.instantcall;
    this.setState({ param });
  }

  onDrop() {
    const node = this.myRef.current;
    node.click();
  }



  onChangeAvatar = async (e) => {
    const formData = new FormData();
    formData.append('files[]', e.target.files[0]);
    try {
      this.setState({ loading: true });
      const result = await uploadimage(formData);
      if (result.data.result === "success") {
        let { param } = this.state;
        param.avatar = result.data.data;
        this.setState({ param });
        ToastsStore.success("Change Avatar Success");
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }


  signout = async () => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        this.removeSession();
      } else if (result.data.result === "warning") {
        this.removeSession();
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
        } else if (result.data.message === "Token is Invalid") {
          this.removeSession();
        } else if (result.data.message === "Authorization Token not found") {
          this.removeSession();
        } else {
          this.removeSession();
        }
      }
    } catch (error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
    this.props.history.push('/');
  }

  setSelectedAge = (e) => {
    let temp = e;
    this.setState({ selectedAge: temp });
  }

  toggleQuestion() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { selectedTags, tags, param, requiremessage, loading, displaydate, displaycuthourlyprice, displaycutplanfee, displaygethourlyprice, displaygetplanfee, language, selectedLanguages } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <Card small className="profile-setting-card">
            <CardBody>
              <Row>
                <Col xl="3" className="subscription-mentor-detail">
                  <div>
                    <h2>Profile Setting</h2>
                    <div className="avatar-tooltip">
                      {param.avatar && <img className="avatar" src={param.avatar} alt="avatar" onClick={() => this.onDrop()} />}
                      {!param.avatar && <img className="avatar" src={avatar} alt="avatar" onClick={() => this.onDrop()} />}
                      <span className="avatar-tooltiptext">Change your avatar</span>
                    </div>
                    <input type="file" hidden ref={this.myRef} onChange={(e) => this.onChangeAvatar(e)}></input>
                  </div>
                </Col>
                <Col xl="9" lg="12" className="profile-setting-detail">
                  <div className="right">
                    {param.instantcall ? <FormCheckbox toggle checked className="instant-call-toggle" onChange={(e) => this.onChangeInstantCall(e)}>
                      <img src={Icon} alt="icon" style={{ paddingRight: "5px", paddingBottom: "5px" }} />
                    Instant call
                    <img src={Tooltip} alt="icon" style={{ paddingLeft: "5px", paddingBottom: "5px" }} />
                    </FormCheckbox> : <FormCheckbox toggle normal className="instant-call-toggle" onChange={(e) => this.onChangeInstantCall(e)}>
                        <img src={Icon} alt="icon" style={{ paddingRight: "5px", paddingBottom: "5px" }} />
                    Instant call
                    <img src={Tooltip} alt="icon" style={{ paddingLeft: "5px", paddingBottom: "5px" }} />
                      </FormCheckbox>}
                  </div>
                  <div className="profile-detail">
                    <Row>
                      <Col>
                        <Form>
                          <Row form>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="feEmailAddress" className="profile-detail-important">Full Name</label>
                              {requiremessage.dname !== '' && <span className="require-message">{requiremessage.dname}</span>}
                              {requiremessage.dname !== '' && <FormInput className="profile-detail-input" placeholder="Full Name" autoFocus="1" invalid onChange={(e) => this.onChangeFullName(e)} value={param.name} />}
                              {requiremessage.dname === '' && <FormInput className="profile-detail-input" placeholder="Full Name" autoFocus="1" onChange={(e) => this.onChangeFullName(e)} value={param.name} />}
                            </Col>
                            <Col md="6" className="project-detail-input-group">
                              <div><label htmlFor="fePassword">Date of birth</label></div>
                              {/* <DatePicker
                                md="6"
                                size="lg"
                                // selected={displaydate}
                                onChange={(e) => this.onChangeBirthDay(e)}
                                value={param.birthday}
                                placeholderText="Date of birth"
                                dropdownMode="select"
                                className="text-center"
                              /> */}
                              <DatePickerInput
                                onChange={(e) => this.onChangeBirthDay(e)}
                                value={param.birthday}
                                selected={displaydate}
                                placeholderText="Date of birth"
                                className='text-center'   
                                locale='en'                             
                              />
                              {/* <DatePicker onChange={(e) => this.onChangeBirthDay(e)} value={param.birthday} locale='fr'/> */}
                            </Col>
                          </Row>
                          <Row form>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="feEmailAddress" className="profile-detail-important">Email</label>
                              {requiremessage.demail !== '' && <span className="require-message">{requiremessage.demail}</span>}
                              {requiremessage.demail !== '' && <FormInput className="profile-detail-input" id="email" type="email" placeholder="Email" invalid onChange={(e) => this.onChangeEmail(e)} value={param.email} />}
                              {requiremessage.demail === '' && <FormInput className="profile-detail-input" id="email" type="email" placeholder="Email" onChange={(e) => this.onChangeEmail(e)} value={param.email} />}
                            </Col>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="feInputState" className="profile-detail-important" >Expertise</label>
                              {requiremessage.dexpertise !== '' && <span className="require-message">{requiremessage.dexpertise}</span>}
                              <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeExpertise(e)}>
                                {expertise.map((item, idx) =>
                                  item.value === param.expertise ? <option key={idx} value={item.value} selected>{item.name}</option> : <option key={idx} value={item.value}>{item.name}</option>
                                )}
                              </FormSelect>
                            </Col>
                          </Row>
                          <Row form>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="feInputState" className="profile-detail-important" >Category</label>
                              <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeCategory(e)}>
                                {category.map((item, idx) =>
                                  item.value === param.category ?
                                    <option key={idx} value={item.value} selected>{item.name}</option>
                                    : <option key={idx} value={item.value}>{item.name}</option>
                                )}
                              </FormSelect>
                            </Col>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="feInputState" className="profile-detail-important" >SubCategory</label>
                              <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeSubcategory(e)}>
                                {subcategory.map((item, idx) =>
                                  item.value === param.subcategory ?
                                    <option key={idx} value={item.value} selected>{item.name}</option>
                                    : <option key={idx} value={item.value}>{item.name}</option>
                                )}
                              </FormSelect>
                            </Col>
                          </Row>
                          <Row form>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="feInputState" className="profile-detail-important">Select minimum age</label>
                              <img id="popover-1" alt="icon" style={{ paddingRight: "5px", paddingBottom: "5px" }} src={Question} onMouseEnter={() => this.toggleQuestion()} onMouseLeave={() => this.toggleQuestion()} />
                              <Popover
                                placement="top"
                                open={this.state.open}
                                toggle={this.toggle}
                                target="#popover-1"
                              >
                                <PopoverBody>
                                  Set an age limit for student or people
                                  who can participate or interact with
                                  your content and share page
                                </PopoverBody>
                              </Popover>
                              <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeAge(e)}>
                                {minimum_age.map((item, idx) =>
                                  item.value === param.minimum_age ?
                                    <option key={idx} value={item.value} selected>{item.label}</option>
                                    : <option key={idx} value={item.value}>{item.label}</option>
                                )}
                              </FormSelect>
                            </Col>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="fePhoneNumber" >Phone Number</label>
                              <PhoneInput
                                country={'us'}  
                                value={param.phone}
                                onChange={(phone) => this.onChangePhoneNumber(phone)}
                              />                              
                              {/* {requiremessage.dphone !== '' && <span className="require-message">{requiremessage.dphone}</span>}
                              {requiremessage.dphone !== '' && <FormInput className="profile-detail-input" placeholder="phone number" autoFocus="1" invalid onChange={(e) => this.onChangePhoneNumber(e)} value={param.phone} />}
                              {requiremessage.dphone === '' && <FormInput className="profile-detail-input" placeholder="phone number" autoFocus="1" onChange={(e) => this.onChangePhoneNumber(e)} value={param.phone} />} */}
                            </Col>
                          </Row>
                          <Row form>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="feEmailAddress" className="profile-detail-important">Hourly price</label>
                              {requiremessage.dhourlyprice !== '' && <FormInput className="profile-detail-input no-margin" type="number" placeholder="Hourly price" invalid onChange={(e) => this.onChangeHourlyPrice(e)} value={param.hourlyprice} />}
                              {requiremessage.dhourlyprice !== '' && <span className="require-message">{requiremessage.dhourlyprice}</span>}
                              {requiremessage.dhourlyprice === '' && <FormInput className="profile-detail-input no-margin" type="number" placeholder="Hourly price" onChange={(e) => this.onChangeHourlyPrice(e)} value={param.hourlyprice} />}
                              <label className="profile-detail-comment">
                                <span>You get 80% of your price. ({displaygethourlyprice} $)</span><br></br>
                              Remaining 20% goes to admin. ({displaycuthourlyprice} $)
                            </label>
                            </Col>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="fePassword">Video url</label>
                              {requiremessage.videourl !== '' && <span className="require-message">{requiremessage.videourl}</span>}
                              {requiremessage.videourl !== '' && <FormInput className="profile-detail-input" type="url" placeholder="Video url" invalid onChange={(e) => this.onChangeVideoUrl(e)} value={param.videourl} />}
                              {requiremessage.videourl === '' && <FormInput className="profile-detail-input" type="url" placeholder="Video url" onChange={(e) => this.onChangeVideoUrl(e)} value={param.videourl} />}
                            </Col>
                          </Row>
                          <Row form>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="feEmailAddress" className="profile-detail-important">Subscription Page Name</label>
                              {requiremessage.dsubpagename !== '' && <span className="require-message">{requiremessage.dsubpagename}</span>}
                              {requiremessage.dsubpagename !== '' && <FormInput className="profile-detail-input no-margin" placeholder="Subscription Page Name" invalid onChange={(e) => this.onChangeSubPageName(e)} value={param.subpagename} />}
                              {requiremessage.dsubpagename === '' && <FormInput className="profile-detail-input no-margin" placeholder="Subscription Page Name" onChange={(e) => this.onChangeSubPageName(e)} value={param.subpagename} />}
                            </Col>
                            <Col md="6" className="project-detail-input-group">
                              <label htmlFor="fePassword" className="profile-detail-important">Subscription plan fee</label>
                              {requiremessage.dsubplanfee !== '' && <span className="require-message">{requiremessage.dsubplanfee}</span>}
                              {requiremessage.dsubplanfee !== '' && <FormInput className="profile-detail-input no-margin" type="number" placeholder="Subscription plan fee" invalid onChange={(e) => this.onChangeSubPlanFee(e)} value={param.subplanfee} />}
                              {requiremessage.dsubplanfee === '' && <FormInput className="profile-detail-input no-margin" type="number" placeholder="Subscription plan fee" onChange={(e) => this.onChangeSubPlanFee(e)} value={param.subplanfee} />}
                              <label className="profile-detail-comment">
                                <span>You get 80% of your price. ({displaygetplanfee} $)</span><br></br>
                              Remaining 20% goes to admin. ({displaycutplanfee} $)
                            </label>
                            </Col>
                          </Row>
                          <Row form>
                            <Col md="12" className="project-detail-input-group" >
                              <label htmlFor="feEmailAddress" className="project-detail-input-group">Description</label>
                              <FormTextarea placeholder="Type here" className="profile-detail-desc profile-detail-input" onChange={(e) => this.onChangeDescription(e)} value={param.description} />
                            </Col>
                          </Row>
                          {param.is_mentor ?
                            <Row form>
                              <Col md="12" className="project-detail-input-group" >
                                <label htmlFor="fePassword">Tags</label>
                                <MultiSelect
                                  hasSelectAll={false}
                                  options={tags}
                                  value={selectedTags}
                                  onChange={(e) => this.onChangeTags(e)}
                                  labelledBy={"Select"}
                                />
                              </Col>
                            </Row>
                            : <></>
                          }
                          <Row form>
                            <Col md="12" className="project-detail-input-group" >
                              <label htmlFor="feEmailAddress" >Language</label>
                              <MultiSelect
                                hasSelectAll={false}
                                options={language}
                                value={selectedLanguages}
                                onChange={(e) => this.onChangeLanguages(e)}
                                labelledBy={"Select"}
                              />
                            </Col>
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
