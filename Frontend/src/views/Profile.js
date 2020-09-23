import React from "react";
import MultiSelect from "react-multi-select-component";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormInput, FormSelect, Form, FormTextarea, DatePicker } from "shards-react";
import expertise from '../common/constants';
import LoadingModal from "../components/common/LoadingModal";
import Icon from "../images/Lightning.svg"
import Tooltip from "../images/Tooltip.svg"
import avatar from "../images/avatar.jpg"
import { editprofile, getuserinfo, uploadimage, gettags } from '../api/api';

export default class MySharePage extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
      selectedTags: [],
      tags: [],
      loading: false,
      displaydate: '',
      displaygethourlyprice: '0.00',
      displaycuthourlyprice: '0.00',
      displaygetplanfee: '0.00',
      displaycutplanfee: '0.00',
      requiremessage: {
        dname: '',
        demail: '',
        dexpertise: '',
        dhourlyprice: '',
        dsubpagename: '',
        dsubplanfee:'',
        videourl: ''
      },
      param: {
        name: '',
        birthday: '',
        email: '',
        description: '',
        expertise: 1,
        hourlyprice: '',
        subpagename: '',
        subplanfee: '',
        videourl: '',
        avatar: '',
        instantcall: false,
        is_mentor: false,
        tags: [],
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
    this.getAllTags();
  }

  componentDidMount() {
    document.getElementById('email').setAttribute('style', 'pointer-events : none !important');
  }

  getUserInformation = async() => {
    try {
      this.setState({loading: true});
      const result = await getuserinfo({email: localStorage.getItem('email')});
      if (result.data.result === "success") {
        const {param} = this.state;
        let temp = param;
        temp.name = result.data.data.name;
        temp.birthday = (result.data.data.dob === null || result.data.data.dob === "") ? '2020-01-01' : result.data.data.dob;
        temp.email = result.data.data.email;
        temp.avatar = result.data.data.avatar;
        temp.description = result.data.data.description;
        temp.hourlyprice = (result.data.data.hourly_price === "" || result.data.data.hourly_price === null) ? 0 : result.data.data.hourly_price;
        temp.subpagename = result.data.data.sub_page_name;
        temp.subplanfee = (result.data.data.sub_plan_fee === "" || result.data.data.sub_plan_fee === null) ? 0 : result.data.data.sub_plan_fee;
        temp.videourl = result.data.data.video_url;
        temp.expertise = (result.data.data.expertise === null || result.data.data.expertise === "") ? 1 : result.data.data.expertise;
        temp.instantcall = result.data.data.instant_call;
        temp.is_mentor = result.data.data.is_mentor;
        temp.tags = result.data.data.tags;

        let param1 = {
          label: '',
          value: 0
        };

        let params = [];
        for (var i = 0; i < result.data.data.tags.length; i ++) {
          param1.label = result.data.data.tags_name[i].trim();
          param1.value = parseInt(result.data.data.tags[i].trim());
          params.push(param1);
          param1 = {};
        }
        this.setState({
          param: temp,
          displaygethourlyprice: (parseFloat(result.data.data.hourly_price)*0.8).toFixed(2),
          displaycuthourlyprice: (parseFloat(result.data.data.hourly_price)*0.2).toFixed(2),
          displaygetplanfee: (parseFloat(result.data.data.sub_plan_fee)*0.8).toFixed(2),
          displaycutplanfee: (parseFloat(result.data.data.sub_plan_fee)*0.2).toFixed(2),
          selectedTags: params
        });
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  getAllTags = async() => {
    try {
      const result = await gettags();
      if (result.data.result === "success") {
        let param = {
          label: '',
          value: ''
        };

        let params = [];

        for (var i = 0; i < result.data.data.length; i ++) {
          param.label = result.data.data[i].name;
          param.value = result.data.data[i].id;
          params.push(param);
          param = {};
        }
        this.setState({tags: params});
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
    } catch(err) {
      this.showFail("Something Went wrong");
    };
  }

  onChangeTags = (e) => {
    const {selectedTags} = this.state;
    let temp = selectedTags;
    temp = e;
    this.setState({selectedTags: temp});

    if (e.length > 0) {
      const { param } = this.state;
      let temp1 = param;
      temp1.tags = [];
      for(var i = 0; i < e.length; i ++) {
        temp1.tags.push(e[i].value);
      }
      this.setState({param: temp1});
    } else {
      const { param } = this.state;
      let temp1 = param;
      temp1.tags = [];
      this.setState({param: temp1});
    }
  }

  onChangeUser = (e) => {
    const {param} = this.state;
    let temp = param;
    temp.is_mentor = !param.is_mentor;
    if (!param.is_mentor === true) {
      localStorage.setItem('is_mentor', 0);
    } else {
      localStorage.setItem('is_mentor', 1);
    }
    
    this.setState({param: temp});
  }

  actionSave = async() => {
    const {requiremessage, param} = this.state;
    let temp = requiremessage;
    temp.dname = '';
    temp.demail = '';
    temp.dexpertise = '';
    temp.dhourlyprice = '';
    temp.dsubpagename = '';
    temp.dsubplanfee = '';
    temp.videourl = '';
    this.setState({
      requiremessage: temp
    });
    try {
      this.setState({loading: true});
      const result = await editprofile(param);
      if (result.data.result === "success") {
        this.setState({loading: false});
        this.showSuccess("Edit Profile Success");
        localStorage.setItem('user-type', param.is_mentor);
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.type === "require") {
          const {requiremessage} = this.state;
          let temp = requiremessage;
          if (result.data.message.name) {
            temp.dname = result.data.message.name[0];
          }
          if (result.data.message.email) {
            temp.demail = result.data.message.email[0];
          }
          if (result.data.message.expertise) {
            temp.dexpertise = result.data.message.expertise[0];
          }
          if (result.data.message.hourlyprice) {
            temp.dhourlyprice = result.data.message.hourlyprice[0];
          }
          if (result.data.message.subpagename) {
            temp.dsubpagename = result.data.message.subpagename[0];
          }
          if (result.data.message.subplanfee) {
            temp.dsubplanfee = result.data.message.subplanfee[0];
          }
          if (result.data.message.videourl) {
            temp.videourl = result.data.message.videourl[0];
          }
          this.setState({
            requiremessage: temp
          });
        } else {
          if (result.data.message === "Token is Expired") {
            this.removeSession();
            window.location.href = "/";
          } else {
            this.showFail(result.data.message);
          }
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  };
  
  onChangeFullName = (e) => {
    var array = e.target.value.split("");
    if (array.length > 30) {
      return;
    }
    const {param} = this.state;
    let temp = param;
    temp.name = e.target.value;
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
    var array = e.target.value.split("");
    if (array.length > 500) {
      return;
    }
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
    if (e.target.value === '') {
      displaygethourlyprice = '0.00';
      displaycuthourlyprice = '0.00';
    } else {
      displaygethourlyprice = (parseFloat(e.target.value)*0.8).toFixed(2);
      displaycuthourlyprice = (parseFloat(e.target.value)*0.2).toFixed(2);  
    }
    
    this.setState({param: temp});
    this.setState({displaygethourlyprice: displaygethourlyprice});
    this.setState({displaycuthourlyprice: displaycuthourlyprice});
  }

  onChangeSubPageName = (e) => {
    var array = e.target.value.split("");
    if (array.length > 50) {
      return;
    }
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
    if (e.target.value === '') {
      displaygetplanfee = '0.00';
      displaycutplanfee = '0.00';
    } else {
      displaygetplanfee = (parseFloat(e.target.value)*0.8).toFixed(2);
      displaycutplanfee = (parseFloat(e.target.value)*0.2).toFixed(2);
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
    temp.instantcall = !param.instantcall;
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
      if (result.data.result === "success") {
        const {param} = this.state;
        let temp = param;
        temp.avatar = result.data.data;
        this.setState({param: temp});
        this.showSuccess("Change Avatar Success");
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  showSuccess(text) {
    store.addNotification({
      title: "Success",
      message: text,
      type: "success",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      },
    });
  }

  showFail(text) {
    store.addNotification({
      title: "Fail",
      message: text,
      type: "danger",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  showWarning(text) {
    store.addNotification({
      title: "Warning",
      message: text,
      type: "warning",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration : 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  removeSession() {
    localStorage.clear();
  }

  render() {
    const { selectedTags, tags, param, requiremessage, loading, displaydate, displaycuthourlyprice, displaycutplanfee, displaygethourlyprice, displaygetplanfee } = this.state;
    return (
      <>
      {loading && <LoadingModal open={true} />}
      <ReactNotification />
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
                    <img src={Icon} alt="icon" style={{paddingRight: "5px", paddingBottom: "5px"}}/>
                    Instant call
                    <img src={Tooltip} alt="icon" style={{paddingLeft: "5px", paddingBottom: "5px"}}/>
                  </FormCheckbox> : <FormCheckbox toggle normal className="instant-call-toggle" onChange={(e) => this.onChangeInstantCall(e)}>
                    <img src={Icon} alt="icon" style={{paddingRight: "5px", paddingBottom: "5px"}}/>
                    Instant call
                    <img src={Tooltip} alt="icon" style={{paddingLeft: "5px", paddingBottom: "5px"}}/>
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
                            {requiremessage.dname !== '' && <FormInput className="profile-detail-input" placeholder="Full Name" autoFocus="1" invalid onChange={(e) => this.onChangeFullName(e)} value={param.name}/>}
                            {requiremessage.dname === '' && <FormInput className="profile-detail-input" placeholder="Full Name" autoFocus="1" onChange={(e) => this.onChangeFullName(e)} value={param.name}/>}
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <div><label htmlFor="fePassword">Date of birth</label></div>
                            <DatePicker
                              md="6"
                              size="lg"
                              selected={displaydate}
                              onChange={(e) => this.onChangeBirthDay(e)}
                              value={param.birthday}
                              placeholderText="Date of birth"
                              dropdownMode="select"
                              className="text-center"
                            />
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Email</label>
                            {requiremessage.demail !== '' && <span className="require-message">{requiremessage.demail}</span>}
                            {requiremessage.demail !== '' && <FormInput className="profile-detail-input" id="email" type="email" placeholder="Email" invalid onChange={(e) => this.onChangeEmail(e)} value={param.email}/>}
                            {requiremessage.demail === '' && <FormInput className="profile-detail-input" id="email" type="email" placeholder="Email" onChange={(e) => this.onChangeEmail(e)} value={param.email}/>}
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
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Hourly price</label>
                            {requiremessage.dhourlyprice !== '' && <span className="require-message">{requiremessage.dhourlyprice}</span>}
                            {requiremessage.dhourlyprice !== '' && <FormInput className="profile-detail-input no-margin" type="number" placeholder="Hourly price" invalid onChange={(e) => this.onChangeHourlyPrice(e)} value={param.hourlyprice}/>}
                            {requiremessage.dhourlyprice === '' && <FormInput className="profile-detail-input no-margin" type="number" placeholder="Hourly price" onChange={(e) => this.onChangeHourlyPrice(e)} value={param.hourlyprice}/>}
                            <label className="profile-detail-comment">
                              <span>You get 80% of your price. ({displaygethourlyprice} $)</span><br></br>
                              Remaining 20% goes to admin. ({displaycuthourlyprice} $)
                            </label>
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="fePassword" className="profile-detail-important">Video url</label>
                            {requiremessage.videourl !== '' && <span className="require-message">{requiremessage.videourl}</span>}
                            {requiremessage.videourl !== '' && <FormInput className="profile-detail-input" type="url" placeholder="Video url" invalid onChange={(e) => this.onChangeVideoUrl(e)} value={param.videourl}/>}
                            {requiremessage.videourl === '' && <FormInput className="profile-detail-input" type="url" placeholder="Video url" onChange={(e) => this.onChangeVideoUrl(e)} value={param.videourl}/>}
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="feEmailAddress" className="profile-detail-important">Subscription Page Name</label>
                            {requiremessage.dsubpagename !== '' && <span className="require-message">{requiremessage.dsubpagename}</span>}
                            {requiremessage.dsubpagename !== '' && <FormInput className="profile-detail-input no-margin" placeholder="Subscription Page Name" invalid onChange={(e) => this.onChangeSubPageName(e)} value={param.subpagename}/>}
                            {requiremessage.dsubpagename === '' && <FormInput className="profile-detail-input no-margin" placeholder="Subscription Page Name" onChange={(e) => this.onChangeSubPageName(e)} value={param.subpagename}/>}
                          </Col>
                          <Col md="6" className="project-detail-input-group">
                            <label htmlFor="fePassword" className="profile-detail-important">Subscription plan fee</label>
                            {requiremessage.dsubplanfee !== '' && <span className="require-message">{requiremessage.dsubplanfee}</span>}
                            {requiremessage.dsubplanfee !== '' && <FormInput className="profile-detail-input no-margin" type="number" placeholder="Subscription plan fee" invalid onChange={(e) => this.onChangeSubPlanFee(e)} value={param.subplanfee}/>}
                            {requiremessage.dsubplanfee === '' && <FormInput className="profile-detail-input no-margin" type="number" placeholder="Subscription plan fee" onChange={(e) => this.onChangeSubPlanFee(e)} value={param.subplanfee}/>}
                            <label className="profile-detail-comment">
                              <span>You get 80% of your price. ({displaygetplanfee} $)</span><br></br>
                              Remaining 20% goes to admin. ({displaycutplanfee} $)
                            </label>
                          </Col>
                        </Row>
                        <Row form>
                          <label htmlFor="feEmailAddress" className="project-detail-input-group">Description</label>
                          <FormTextarea placeholder="Type here" className="profile-detail-desc profile-detail-input" onChange={(e) => this.onChangeDescription(e)} value={param.description}/>
                        </Row>
                        {param.is_mentor ? 
                          <span><span style={{color: '#04B5FA', fontSize: 18, fontWeight: 'bold'}}>Student</span>
                          <FormCheckbox toggle checked className="instant-call-toggle custom-toggle" onChange={(e) => this.onChangeUser(e)}>
                          </FormCheckbox><span style={{color: '#04B5FA', fontSize: 18, fontWeight: 'bold'}}>Mentor</span></span> : 

                          <span><span style={{color: '#04B5FA', fontSize: 18, fontWeight: 'bold'}}>Student</span>
                          <FormCheckbox toggle normal className="instant-call-toggle" onChange={(e) => this.onChangeUser(e)}>
                          </FormCheckbox>
                          <span style={{color: '#04B5FA', fontSize: 18, fontWeight: 'bold'}}>Mentor</span></span>}
                        {param.is_mentor ? 
                        <>
                          <div><label htmlFor="fePassword">Tags</label></div>
                          <MultiSelect
                            options={tags}
                            value={selectedTags}
                            onChange={(e) => this.onChangeTags(e)}
                            labelledBy={"Select"}
                          />
                        </> : <></>
                        }
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
