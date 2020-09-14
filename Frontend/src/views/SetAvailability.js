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
      dayOfWeekStatus: {
        day_0: 1,
        day_1: 1,
        day_2: 1,
        day_3: 1,
        day_4: 1,
        day_5: 1,
        day_6: 1
      }
    }

    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleUpdateto = this.handleUpdateto.bind(this);
    this.handleUpdatefrom = this.handleUpdatefrom.bind(this);
  }

  componentWillMount() {
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
    this.setState({
      availableTimeList: list,
    });
  }

  handleSave = async() => {
    try {
      this.setState({loading: true});
      const result = await setAvailableTimes({email: localStorage.getItem('email'), data: this.state.availableTimeList});
      console.log(result);
      if (result.data.result === "success") {
        this.getTimeListData();
        this.showSuccess("Set Availability Success");
      } else {
        this.showFail("Set Availability Fail");
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Set Availability Fail");
    };
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
        this.showFail();
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail();
    };
  }

  onChangeTimeZone = (e) => {
    console.log(e.target.value);
  }

  showSuccess(text) {
    store.addNotification({
      title: "Success",
      message: "Action Success!",
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
      message: "Action Fail!",
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

  handleChange(e, dayIdx) {
    const {dayOfWeekStatus} = this.state;
    let temp = dayOfWeekStatus;

    if(this.state.dayOfWeekStatus[dayIdx]) {
      document.getElementById(dayIdx).setAttribute("style", "pointer-events: none; color: #999999 !important;");
    } else {
      document.getElementById(dayIdx).setAttribute("style", "");
    }

    temp[dayIdx] = !dayOfWeekStatus[dayIdx];
    this.setState({
      dayOfWeekStatus: temp
    })
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
                      {TimezoneOptions.map((item, index)  =>
                         <option value={item.value}> {item.name}</option>
                      )}
                      </FormSelect>
                    </Col>
                  </Row>
                  {this.state.availableTimeList.map((day, dayIdx) => {
                    return (
                      <div>
                        <Row style={{paddingLeft: "15px"}}>
                          <FormCheckbox 
                            toggle
                            small 
                            checked={this.state.dayOfWeekStatus['day_' + dayIdx]}
                            onChange={e => this.handleChange(e, 'day_' + dayIdx)}
                          >
                          {day.dayOfWeek}
                          </FormCheckbox>
                        </Row>
                        <div id={'day_' + dayIdx}>
                          {day.timeList.length ?
                            day.timeList.map((time, timeIdx) => {
                              return (
                                <Row form>
                                  <Col md="5" className="available-time-group" style={{marginRight: "40px"}}>
                                    <FormSelect id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdatefrom(dayIdx, timeIdx, e)}>
                                      {Timelinelist.map((item, idx) => {
                                        return (
                                          time.from === item.id
                                          ? <option selected>{item.str}</option>
                                          : <option >{item.str}</option>
                                        );
                                      })}
                                    </FormSelect>
                                  </Col>
                                  <Col md="5" className="available-time-group">
                                    <FormSelect id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdateto(dayIdx, timeIdx, e)}>
                                      {Timelinelist.map((item, idx) => {
                                        return (
                                          time.to === item.id 
                                          ? <option selected>{item.str}</option>
                                          : <option >{item.str}</option>
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
                                      <option >{item.str}</option>
                                    )
                                  })}
                                </FormSelect>
                              </Col>
                              <Col md="5" className="available-time-group">
                                <FormSelect disabled id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdateto(0, 0, e)}>
                                  {Timelinelist.map((item, idx) => {
                                    return (
                                      <option >{item.str}</option>
                                    )
                                  })}
                                </FormSelect>
                              </Col>
                              <Col style={{marginTop: "10px", marginBottom: "10px"}}>
                                <Button className="btn-available-time-add-delete no-padding"
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
