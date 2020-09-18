import React from "react";
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormSelect, Form } from "shards-react";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import DeleteButtonImage from "../images/Delete.svg"
import AddButtonImage from "../images/Add.svg"

import { getAvailableTimes } from '../api/api';
import { setAvailableTimes } from '../api/api';
import TimezoneOptions from '../common/TimezoneOptions';
import Timelinelist from '../common/TimelistList';

class SetAvailability extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      currentUserId: '',
      availableTimeList: [
        {
          dayOfWeek: "Sunday",
          timeList: []
        },
        {
          dayOfWeek: "Monday",
          timeList: []
        },
        {
          dayOfWeek: "Tuesday",
          timeList: []
        },
        {
          dayOfWeek: "Wednesday",
          timeList: []
        },
        {
          dayOfWeek: "Thursday",
          timeList: []
        },
        {
          dayOfWeek: "Friday",
          timeList: []
        },
        {
          dayOfWeek: "Saturday",
          timeList: []
        }
      ],
      dayOfWeekStatus: [
         false,
         false,
         false,
         false,
         false,
         false,
         false
      ]
    }

    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleUpdateto = this.handleUpdateto.bind(this);
    this.handleUpdatefrom = this.handleUpdatefrom.bind(this);
  }

  componentDidMount() {
    this.getTimeListData();
  }

  handleAdd(dayIdx) {
      const {availableTimeList} = this.state;
      let list = availableTimeList;
      list[dayIdx].timeList.push({from: 0, to: 0});
  
      this.setState({
        availableTimeList: list,
      });
  }

  handleDelete(dayIdx, idx) {
    const {availableTimeList} = this.state;
    let list = availableTimeList;

    if (list[dayIdx].timeList.length === 1) {
      list[dayIdx].timeList.splice(idx, 1);
    } else {
      list[dayIdx].timeList.splice(idx, 1);
    }

    this.setState({
      availableTimeList: list,
    });
  }

  handleUpdateto(dayIdx, timeIdx, e) {
    const {availableTimeList} = this.state;
    let list = availableTimeList;
    let timeId = 0;

    for(var i = 0; i < Timelinelist.length; i ++) {
      if(e.target.value === Timelinelist[i]['str']) {
        timeId = i;
        break;
      }
    }

    list[dayIdx].timeList[timeIdx].to = timeId + 1;
    this.setState({
      availableTimeList: list,
    });
  }

  handleUpdatefrom(dayIdx, timeIdx, e) {
    const {availableTimeList} = this.state;
    let list = availableTimeList;
    let timeId = 0;

    for(var i = 0; i < Timelinelist.length; i ++) {
      if(e.target.value === Timelinelist[i]['str']) {
        timeId = i;
        break;
      }
    }
    
    list[dayIdx].timeList[timeIdx].from = timeId + 1;
    list[dayIdx].timeList[timeIdx].to = timeId + 2;
    this.setState({
      availableTimeList: list,
    });
  }

  makeParam() {
    const {availableTimeList} = this.state;
    let temp = availableTimeList;

    // temp.map((time, ))
  }

  handleSave = async() => {
    let param = {
      email: localStorage.getItem('email'),
      data: this.state.availableTimeList,
      status: this.state.dayOfWeekStatus
    }
    // try {
    //   this.setState({loading: true});
    //   this.makeParam();
    //   const result = await setAvailableTimes(param);

    //   if (result.data.result === "success") {
    //     this.getTimeListData();
    //     this.showSuccess("Set Availability Success");
    //   } else {
    //     this.showFail(result.data.message);
    //     if (result.data.message == "Token is Expired") {
    //       this.removeSession();
    //       window.location.href = "/";
    //     }
    //   }
    //   this.setState({loading: false});
    // } catch(err) {
    //   this.setState({loading: false});
    //   this.showFail("Something Went wrong");
    // };
  }
  
  getTimeListData = async() => {
    try {
      this.setState({loading: true});
      const result = await getAvailableTimes({email: localStorage.getItem('email')});
      
      if (result.data.result === "success") {
        var availableTimeListTemp = [
          {
            dayOfWeek: "Sunday",
            timeList: []
          },
          {
            dayOfWeek: "Monday",
            timeList: []
          },
          {
            dayOfWeek: "Tuesday",
            timeList: []
          },
          {
            dayOfWeek: "Wednesday",
            timeList: []
          },
          {
            dayOfWeek: "Thursday",
            timeList: []
          },
          {
            dayOfWeek: "Friday",
            timeList: []
          },
          {
            dayOfWeek: "Saturday",
            timeList: []
          }
        ];

        for(var i = 0; i < result.data.data.length; i ++) {
          for (var j = 0; j < availableTimeListTemp.length; j ++){
            if(result.data.data[i].day_of_week === availableTimeListTemp[j].dayOfWeek) {
              availableTimeListTemp[j].timeList.push({from: result.data.data[i].fromTime, to: result.data.data[i].toTime});
            }
          }
        }

        this.setState({
          availableTimeList: availableTimeListTemp,
        });
      } else {
        this.showFail(result.data.message);
        if (result.data.message == "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  onChangeTimeZone = (e) => {
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

  handleChange(e, dayIdx, dayOfWeek) {
    const {dayOfWeekStatus} = this.state;
    let temp = dayOfWeekStatus;
    
    if(this.state.dayOfWeekStatus[dayOfWeek]) {
      if(this.state.availableTimeList[dayOfWeek].timeList.length) {
        const elements = document.getElementById(dayIdx).getElementsByTagName("*");
        let y = [...elements];

        y.map((element, id) => {
          element.setAttribute("disabled", true);
          element.classList.add("disable-event");
        });
      } else {
        const elements = document.getElementById(dayIdx).getElementsByClassName("btn-available-time-add-delete");
        let y = [...elements];

        y.map((element, id) => {
          element.setAttribute("disabled", true);
          element.classList.add("disable-event");
        });
      }
    } else {
      if(this.state.availableTimeList[dayOfWeek].timeList.length) {
        const elements = document.getElementById(dayIdx).getElementsByTagName("*");
        let y = [...elements];

        y.map((element, id) => {
          element.removeAttribute("disabled");
          element.classList.remove("disable-event")
        });
      } else {
        const elements = document.getElementById(dayIdx).getElementsByClassName("btn-available-time-add-delete");
        let y = [...elements];

        y.map((element, id) => {
          element.removeAttribute("disabled");
          element.classList.remove("disable-event")
        });
      }
    }
    temp[dayOfWeek] = !dayOfWeekStatus[dayOfWeek];
    this.setState({
      dayOfWeekStatus: temp
    });
  }

  removeSession() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('user-type');
    localStorage.removeItem('ws');
  }
  
  render () {
    return(
      <>
      {this.state.loading && <LoadingModal open={true} />}
      <ReactNotification />
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
                      <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeTimeZone(e)}>
                      {TimezoneOptions.map((item, idx)  =>
                         <option key={idx} value={item.value}> {item.name}</option>
                      )}
                      </FormSelect>
                    </Col>
                  </Row>
                  {this.state.availableTimeList.map((day, dayIdx) => {
                    return (
                      <div key={dayIdx}>
                        <Row style={{paddingLeft: "15px"}}>
                          <FormCheckbox 
                            toggle
                            small 
                            checked={this.state.dayOfWeekStatus['day_' + dayIdx]}
                            onChange={e => this.handleChange(e, 'day_' + dayIdx, dayIdx)}
                          >
                          {day.dayOfWeek}
                          </FormCheckbox>
                        </Row>
                        <div id={'day_' + dayIdx}>
                          {day.timeList.length ?
                            day.timeList.map((time, timeIdx) => {
                              return (
                                <Row key={timeIdx} form>
                                  <Col md="5" className="available-time-group" style={{marginRight: "40px"}}>
                                    <FormSelect id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdatefrom(dayIdx, timeIdx, e)}>
                                      {Timelinelist.map((item, idx) => {
                                        return (
                                          time.from === item.id
                                          ? <option key={idx} selected>{item.str}</option>
                                          : <option key={idx} >{item.str}</option>
                                        );
                                      })}
                                    </FormSelect>
                                  </Col>
                                  <Col md="5" className="available-time-group">
                                    <FormSelect id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdateto(dayIdx, timeIdx, e)}>
                                      {Timelinelist.map((item, idx) => {
                                        return (
                                          time.to === item.id 
                                          ? <option key={idx} selected>{item.str}</option>
                                          : <option key={idx} >{item.str}</option>
                                        );
                                      })}
                                    </FormSelect>
                                  </Col>
                                  <Col style={{marginTop: "10px", marginBottom: "10px"}}>
                                  {day.timeList.length !== 0 && 
                                    <Button className="btn-available-time-add-delete no-padding"
                                      onClick={() => this.handleDelete(dayIdx, timeIdx)}>
                                      <img src={DeleteButtonImage} alt="Delete" />
                                    </Button>}
                                  {day.timeList.length - 1 === timeIdx && 
                                    <Button className="btn-available-time-add-delete no-padding"
                                      onClick={() => this.handleAdd(dayIdx)}>
                                      <img src={AddButtonImage} alt="Add" />
                                    </Button>}
                                  </Col>
                                </Row>
                              )
                            })
                            // : null
                            :<Row form>
                              <Col md="5" className="available-time-group" style={{marginRight: "40px"}}>
                                <FormSelect disabled id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdatefrom(0, 0, e)}>
                                  {Timelinelist.map((item, idx) => {
                                    return (
                                      <option key={idx} >{item.str}</option>
                                    )
                                  })}
                                </FormSelect>
                              </Col>
                              <Col md="5" className="available-time-group">
                                <FormSelect disabled id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdateto(0, 0, e)}>
                                  {Timelinelist.map((item, idx) => {
                                    return (
                                      <option key={idx} >{item.str}</option>
                                    )
                                  })}
                                </FormSelect>
                              </Col>
                              <Col style={{marginTop: "10px", marginBottom: "10px"}}>
                              {!this.state.dayOfWeekStatus[dayIdx]}
                                <Button className="btn-available-time-add-delete no-padding"
                                  disabled={!this.state.dayOfWeekStatus[dayIdx]}
                                  onClick={() => this.handleAdd(dayIdx)}>
                                  <img src={AddButtonImage} alt="Add" />
                                </Button>
                              </Col>
                            </Row>
                          }
                        </div>
                      </div>
                    )
                  })}
                  <Row className="profile-detail-save center">
                    <Button className="btn-profile-detail-save" onClick={() => this.handleSave()}>Save</Button>
                  </Row>
                </Form>
              </Row>
            </CardBody>
          </Card>    
        </Container>
      </>
    );
  }
}

export default SetAvailability;
