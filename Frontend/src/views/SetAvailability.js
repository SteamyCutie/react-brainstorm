import React from "react";
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormSelect, Form } from "shards-react";
import LoadingModal from "../components/common/LoadingModal";
import AddSpecificDate from "../components/common/AddSpecificDate";
import { ToastsStore } from 'react-toasts';
import DeleteButtonImage from "../images/Delete.svg";
import AddButtonImage from "../images/Add.svg";
import { getAvailableTimes, setAvailableTimes, signout } from '../api/api';
import TimezoneOptions from '../common/TimezoneOptions';
import Timelinelist from '../common/TimelistList';
import moment from 'moment';

moment.locale('en');

class SetAvailability extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentUserId: '',
      availableSpecificTimeList: [],
      availableRecurrenceTimeList: [
        {
          dayOfWeek: "Sunday",
          timeList: [],
          status: false
        },
        {
          dayOfWeek: "Monday",
          timeList: [],
          status: false
        },
        {
          dayOfWeek: "Tuesday",
          timeList: [],
          status: false
        },
        {
          dayOfWeek: "Wednesday",
          timeList: [],
          status: false
        },
        {
          dayOfWeek: "Thursday",
          timeList: [],
          status: false
        },
        {
          dayOfWeek: "Friday",
          timeList: [],
          status: false
        },
        {
          dayOfWeek: "Saturday",
          timeList: [],
          status: false
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
      ],
      addSpecificDateModal: false, 
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
    let { availableRecurrenceTimeList } = this.state;
    availableRecurrenceTimeList[dayIdx].timeList.push({ fromTimeStr: "00:00 am", toTimeStr: "00:00 am" });
    availableRecurrenceTimeList[dayIdx].status = true;

    this.setState({
      availableRecurrenceTimeList,
    });
  }

  handleDelete(dayIdx, idx) {
    let { availableRecurrenceTimeList } = this.state;
    
    if (availableRecurrenceTimeList[dayIdx].timeList.length === 1) {
      availableRecurrenceTimeList[dayIdx].timeList.splice(idx, 1);
    } else {
      availableRecurrenceTimeList[dayIdx].timeList.splice(idx, 1);
    }

    if (!availableRecurrenceTimeList[dayIdx].timeList.length)
      availableRecurrenceTimeList[dayIdx].status = false;

    this.setState({
      availableRecurrenceTimeList,
    });
  }

  handleUpdateto(dayIdx, timeIdx, e) {
    let { availableRecurrenceTimeList } = this.state;
    let timeStr = "";
    for (var i = 0; i < Timelinelist.length; i++) {
      if (parseInt(e.target.value) === Timelinelist[i].id) {
        timeStr = Timelinelist[i].str;
      }
    }
    
    availableRecurrenceTimeList[dayIdx].timeList[timeIdx].toTimeStr = timeStr;
    this.setState({
      availableRecurrenceTimeList,
    });
  }

  handleUpdatefrom(dayIdx, timeIdx, e) {
    let { availableRecurrenceTimeList } = this.state;
    let timeStr = "";
    for (var i = 0; i < Timelinelist.length; i++) {
      if (parseInt(e.target.value) === Timelinelist[i].id) {
        timeStr = Timelinelist[i].str;
      }
    }
    
    availableRecurrenceTimeList[dayIdx].timeList[timeIdx].fromTimeStr = timeStr;
    this.setState({
      availableRecurrenceTimeList: availableRecurrenceTimeList,
    });
  }

  makeParam() {

  }

  handleSave = async () => {
    const { availableRecurrenceTimeList, dayOfWeekStatus, timezone, availableSpecificTimeList } = this.state;

    for (var i = 0; i < availableRecurrenceTimeList.length; i++) {
      availableRecurrenceTimeList[i].status = dayOfWeekStatus[i];
    }

    let param = {
      email: localStorage.getItem('email'),
      timezone: timezone,
      recurrence: availableRecurrenceTimeList,
      specific_date: availableSpecificTimeList
    }

    try {
      this.setState({ loading: true });
      this.makeParam();
      const result = await setAvailableTimes(param);

      if (result.data.result === "success") {
        this.getTimeListData();
        ToastsStore.success("Set Availability Success");
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

  getTimeListData = async () => {
    let param = {
      email: localStorage.getItem('email')
    }
    try {
      this.setState({ loading: true });
      const result = await getAvailableTimes(param);
      if (result.data.result === "success") {
        var availableSpecificTimeListTemp = [];
        var availableRecurrenceTimeListTemp = [
          {
            dayOfWeek: "Sunday",
            timeList: [],
            status: false
          },
          {
            dayOfWeek: "Monday",
            timeList: [],
            status: false
          },
          {
            dayOfWeek: "Tuesday",
            timeList: [],
            status: false
          },
          {
            dayOfWeek: "Wednesday",
            timeList: [],
            status: false
          },
          {
            dayOfWeek: "Thursday",
            timeList: [],
            status: false
          },
          {
            dayOfWeek: "Friday",
            timeList: [],
            status: false
          },
          {
            dayOfWeek: "Saturday",
            timeList: [],
            status: false
          }
        ];
        let timezone = "";
        for (let i = 0; i < result.data.data.recurrenceList.length; i++) {
          for (let j = 0; j < availableRecurrenceTimeListTemp.length; j++) {
            if (result.data.data.recurrenceList[i].day_of_week === availableRecurrenceTimeListTemp[j].dayOfWeek) {
              availableRecurrenceTimeListTemp[j].timeList.push({
                fromTimeStr: result.data.data.recurrenceList[i].fromTimeStr,
                toTimeStr: result.data.data.recurrenceList[i].toTimeStr,
                status: result.data.data.recurrenceList[i].status === 1 ? true : false
              });
              availableRecurrenceTimeListTemp[j].status = result.data.data.recurrenceList[i].status === 1 ? true : false;
            }
          }
          if (result.data.data.recurrenceList[i].day_of_week === "Sunday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[0] = result.data.data.recurrenceList[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data.recurrenceList[i].day_of_week === "Monday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[1] = result.data.data.recurrenceList[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data.recurrenceList[i].day_of_week === "Tuesday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[2] = result.data.data.recurrenceList[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data.recurrenceList[i].day_of_week === "Wednesday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[3] = result.data.data.recurrenceList[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data.recurrenceList[i].day_of_week === "Thursday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[4] = result.data.data.recurrenceList[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data.recurrenceList[i].day_of_week === "Friday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[5] = result.data.data.recurrenceList[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data.recurrenceList[i].day_of_week === "Saturday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[6] = result.data.data.recurrenceList[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          }
        }
        
        var specificTimes = result.data.data.specificList;
        if (specificTimes.length) {
          var sp_date = specificTimes[0].sp_date;
          var timeList =[];
          
          for (let i = 0; i < specificTimes.length; i ++) {
            if (sp_date === specificTimes[i].sp_date) {
              timeList.push({fromTimeStr: specificTimes[i].fromTimeStr, toTimeStr: specificTimes[i].toTimeStr});
            } else {
              availableSpecificTimeListTemp.push({sp_date: sp_date, timeList: timeList})
              sp_date = specificTimes[i].sp_date;
              timeList = [];
              timeList.push({fromTimeStr: specificTimes[i].fromTimeStr, toTimeStr: specificTimes[i].toTimeStr});
            }
          }
          availableSpecificTimeListTemp.push({sp_date: sp_date, timeList: timeList});
        }
        
        if (result.data.data.timezone)
          timezone = result.data.data.timezone;
        else
          timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        this.setState({
          availableRecurrenceTimeList: availableRecurrenceTimeListTemp,
          availableSpecificTimeList: availableSpecificTimeListTemp,
          timezone: timezone
        });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        ToastsStore.error(result.data.message);
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

  onChangeTimeZone = (e) => {
    this.setState({ timezone: e.target.value });
  }

  handleChange(e, dayIdx, dayOfWeek) {
    let { dayOfWeekStatus } = this.state;
    if (this.state.availableRecurrenceTimeList[dayOfWeek].status) {
      if (this.state.availableRecurrenceTimeList[dayOfWeek].timeList.length) {
        const elements = document.getElementById(dayIdx).getElementsByTagName("*");
        let y = [...elements];

        for (var i = 0; i < y.length; i++) {
          y[i].setAttribute("disabled", true);
          y[i].classList.add("disable-event");
        }
      } else {
        const elements = document.getElementById(dayIdx).getElementsByClassName("btn-available-time-add-delete");
        let y = [...elements];
        for (var j = 0; j < y.length; j++) {
          y[j].setAttribute("disabled", true);
          y[j].classList.add("disable-event");
        }
      }
    } else {
      if (this.state.availableRecurrenceTimeList[dayOfWeek].timeList.length) {
        const elements = document.getElementById(dayIdx).getElementsByTagName("*");
        let y = [...elements];

        for (var k = 0; k < y.length; k++) {
          y[k].removeAttribute("disabled");
          y[k].classList.remove("disable-event");
        }
      } else {
        const elements = document.getElementById(dayIdx).getElementsByClassName("btn-available-time-add-delete");
        let y = [...elements];

        for (var l = 0; l < y.length; l++) {
          y[l].removeAttribute("disabled");
          y[l].classList.remove("disable-event");
        }
      }
    }
    dayOfWeekStatus[dayOfWeek] = !this.state.availableRecurrenceTimeList[dayOfWeek].status;
    this.setState({
      dayOfWeekStatus
    });
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

  handleAddSpecificDate() {
    this.toggle_AddSpecificDate();
  }

  toggle_AddSpecificDate() {
    this.setState({
      addSpecificDateModal: !this.state.addSpecificDateModal
    });
  }

  addSpecificDate(date, timeList) {
    let { availableSpecificTimeList } = this.state;
    const buf = {
      sp_date: date,
      timeList: timeList
    };

    availableSpecificTimeList.push(buf);

    this.setState({
      availableSpecificTimeList
    });
  }

  handleSpecificDelete(idx_date) {
    let {availableSpecificTimeList} = this.state;
    availableSpecificTimeList.splice(idx_date, 1);
    if (!availableSpecificTimeList.length)
    availableSpecificTimeList.splice(idx_date, 1);

    this.setState({
      availableSpecificTimeList
    });
  }

  render() {
    const { loading, availableRecurrenceTimeList, dayOfWeekStatus, timezone, availableSpecificTimeList, addSpecificDateModal } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <AddSpecificDate 
          open={addSpecificDateModal} 
          toggle={() => this.toggle_AddSpecificDate()}
          addSpecificDate={(date, timeList) => this.addSpecificDate(date, timeList)}
        />
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class">
          <Card small className="set-available-card">
            <CardBody>
              <Row className="center">
                <h2 className="availability-title">Set availability</h2>
              </Row>
              <Row className="availability-items center no-margin">
                <Form style={{ width: "80%" }}>
                  <Row form>
                    <Col className="project-detail-input-group">
                      <label htmlFor="feInputState" >Choose your timezone</label>
                      <FormSelect className="profile-detail-input" onChange={(e) => this.onChangeTimeZone(e)} defaultValue={timezone}>
                        {TimezoneOptions.map((item, idx) => {
                          return (
                            <option key={idx} value={item.value}> {item.name}</option>
                          );
                        })}
                      </FormSelect>
                    </Col>
                  </Row>
                  {availableRecurrenceTimeList.map((day, dayIdx) => {
                    return (
                      <div key={dayIdx}>
                        <Row style={{ paddingLeft: "15px" }}>
                          {day.status ?
                            <FormCheckbox
                              toggle
                              small
                              checked
                              onChange={e => this.handleChange(e, 'day_' + dayIdx, dayIdx)}
                            >
                              {day.dayOfWeek}
                            </FormCheckbox> : <FormCheckbox
                              toggle
                              small
                              onChange={e => this.handleChange(e, 'day_' + dayIdx, dayIdx)}
                            >
                              {day.dayOfWeek}
                            </FormCheckbox>}
                        </Row>
                        <div id={'day_' + dayIdx}>
                          {day.timeList.length ?
                            day.timeList.map((time, timeIdx) => {
                              return (
                                <Row key={timeIdx} form>
                                  <Col md="5" xs="4" className="available-time-group" style={{ marginRight: "70px" }}>
                                    <FormSelect className="available-time-input" onChange={(e) => this.handleUpdatefrom(dayIdx, timeIdx, e)} >
                                      {Timelinelist.map((item, idx) => {
                                        return (
                                          time.fromTimeStr === item.str 
                                          ? <option key={idx} value={item.id} selected>{item.str}</option>
                                          : <option key={idx} value={item.id}>{item.str}</option>
                                        );
                                      })}
                                    </FormSelect>
                                  </Col>
                                  <Col md="5" xs="4">
                                    <FormSelect className="available-time-input" onChange={(e) => this.handleUpdateto(dayIdx, timeIdx, e)} >
                                      {Timelinelist.map((item, idx) => {
                                        return (
                                          time.toTimeStr === item.str
                                          ? <option key={idx} value={item.id} selected>{item.str}</option>
                                          : <option key={idx} value={item.id}>{item.str}</option>
                                        );
                                      })}
                                    </FormSelect>
                                  </Col>
                                  <Col style={{ marginTop: "10px", marginBottom: "10px" }}>
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
                            : <Row form>
                              <Col md="5" xs="4" className="available-time-group">
                                <FormSelect disabled className="available-time-input" onChange={(e) => this.handleUpdatefrom(0, 0, e)} defaultValue="(GMT-12:00) International Date Line West">
                                  {Timelinelist.map((item, idx) => {
                                    return (
                                      <option key={idx} >{item.str}</option>
                                    )
                                  })}
                                </FormSelect>
                              </Col>
                              <Col md="5" xs="4">
                                <FormSelect disabled className="available-time-input" onChange={(e) => this.handleUpdateto(0, 0, e)}>
                                  {Timelinelist.map((item, idx) => {
                                    return (
                                      <option key={idx} >{item.str}</option>
                                    )
                                  })}
                                </FormSelect>
                              </Col>
                              <Col style={{ marginTop: "10px", marginBottom: "10px" }}>
                                {!dayOfWeekStatus[dayIdx]}
                                <Button className="btn-available-time-add-delete no-padding"
                                  disabled={!dayOfWeekStatus[dayIdx]}
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

                </Form>
              </Row>
              <Row id="hours-specific-dates" className="center">
                <Row style={{ width: "80%", marginTop: "20px" }}>
                  <h2 className="availability-specific-dates">Add hours for specific dates.</h2>
                  <Button className="btn-add-specific-date" onClick={() => this.handleAddSpecificDate()}>+</Button>
                </Row>
                <Row className="specific-date-table-header">
                  <div style={{width: "150px"}}>Dates</div>
                  <div style={{width: "calc(100% - 150px)"}}>AVAILABILITY</div>
                </Row>
                {availableSpecificTimeList.map((item, idx_date) => {
                  return(
                    item.timeList.map((time, idx_time) => {
                      return (
                        <Row className="specific-date-table-content">
                          <div style={{width: "150px"}}>{item.sp_date}</div>
                          <div style={{width: "calc(100% - 200px)"}}>{time.fromTimeStr} - {time.toTimeStr}</div>
                          <Button className="btn-available-time-add-delete no-padding"
                            onClick={() => this.handleSpecificDelete(idx_date, idx_time)}>
                            <img src={DeleteButtonImage} alt="Delete" />
                          </Button>
                        </Row>
                      )
                    })
                  )
                })}
              </Row>
              <Row className="profile-detail-save center">
                <Button className="btn-profile-detail-save" onClick={() => this.handleSave()}>Save</Button>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

export default SetAvailability;
