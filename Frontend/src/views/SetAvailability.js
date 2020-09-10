import React from "react";
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormSelect, Form } from "shards-react";

import DeleteButtonImage from "../images/Delete.svg"
import AddButtonImage from "../images/Add.svg"

import { getAvailableTimes } from '../api/api';
import { setAvailableTimes } from '../api/api';

const timeList = [
  {id: 1, str: "00 : 00 am"},
  {id: 2, str: "00 : 30 am"},
  {id: 3, str: "01 : 00 am"},
  {id: 4, str: "01 : 30 am"},
  {id: 5, str: "02 : 00 am"},
  {id: 6, str: "02 : 30 am"},
  {id: 7, str: "03 : 00 am"},
  {id: 8, str: "03 : 30 am"},
  {id: 9, str: "04 : 00 am"},
  {id: 10, str: "04 : 30 am"},
  {id: 11, str: "05 : 00 am"},
  {id: 12, str: "05 : 30 am"},
  {id: 13, str: "06 : 00 am"},
  {id: 14, str: "06 : 30 am"},
  {id: 15, str: "07 : 00 am"},
  {id: 16, str: "07 : 30 am"},
  {id: 17, str: "08 : 00 am"},
  {id: 18, str: "08 : 30 am"},
  {id: 19, str: "09 : 00 am"},
  {id: 20, str: "09 : 30 am"},
  {id: 21, str: "10 : 00 am"},
  {id: 22, str: "10 : 30 am"},
  {id: 23, str: "11 : 00 am"},
  {id: 24, str: "11 : 30 am"},
  {id: 25, str: "12 : 00 pm"},
  {id: 26, str: "12 : 30 pm"},
  {id: 27, str: "01 : 00 pm"},
  {id: 28, str: "01 : 30 pm"},
  {id: 29, str: "02 : 00 pm"},
  {id: 30, str: "02 : 30 pm"},
  {id: 31, str: "03 : 00 pm"},
  {id: 32, str: "03 : 30 pm"},
  {id: 33, str: "04 : 00 pm"},
  {id: 34, str: "04 : 30 pm"},
  {id: 35, str: "05 : 00 pm"},
  {id: 36, str: "05 : 30 pm"},
  {id: 37, str: "06 : 00 pm"},
  {id: 38, str: "06 : 30 pm"},
  {id: 39, str: "07 : 00 pm"},
  {id: 40, str: "07 : 30 pm"},
  {id: 41, str: "08 : 00 pm"},
  {id: 42, str: "08 : 30 pm"},
  {id: 43, str: "09 : 00 pm"},
  {id: 44, str: "09 : 30 pm"},
  {id: 45, str: "10 : 00 pm"},
  {id: 46, str: "10 : 30 pm"},
  {id: 47, str: "11 : 00 pm"},
  {id: 48, str: "11 : 30 pm"}
];

class SetAvailability extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUserId: '',
      availableTimeList: []
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

    for(var i = 0; i < timeList.length; i ++) {
      if(e.target.value === timeList[i]['str']) {
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

    for(var i = 0; i < timeList.length; i ++) {
      if(e.target.value === timeList[i]['str']) {
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
      const result = await setAvailableTimes({email: localStorage.getItem('email'), data: this.state.availableTimeList});
      console.log(result);
      if (result.data.result === "success") {
        this.getTimeListData();
      } else {
        alert(result.data.message);
      }
    } catch(err) {
      alert(err);
    };
  }
  
  getTimeListData = async() => {
    try {
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

      }
    } catch(err) {

    };
  }
  
  render () {
    return(
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
                {this.state.availableTimeList.map((day, dayIdx) => {
                  return (
                    <div>
                      <Row style={{paddingLeft: "15px"}}>
                        <FormCheckbox toggle small>
                        {day.dayOfWeek}
                        </FormCheckbox>
                      </Row>
                      {
                      day.timeList.length ?
                        day.timeList.map((time, timeIdx) => {
                          return (
                            <Row form>
                              <Col md="5" className="available-time-group" style={{marginRight: "40px"}}>
                                <FormSelect id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdatefrom(dayIdx, timeIdx, e)}>
                                  {timeList.map((item, idx) => {
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
                                  {timeList.map((item, idx) => {
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
                              {timeList.map((item, idx) => {
                                return (
                                  <option >{item.str}</option>
                                )
                              })}
                            </FormSelect>
                          </Col>
                          <Col md="5" className="available-time-group">
                            <FormSelect disabled id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdateto(0, 0, e)}>
                              {timeList.map((item, idx) => {
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
    );
  }
}

export default SetAvailability;
