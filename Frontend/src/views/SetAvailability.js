import React from "react";
import { Container, Row, Col, Button, Card, CardBody, FormCheckbox, FormSelect, Form } from "shards-react";
import LoadingModal from "../components/common/LoadingModal";
import { ToastsStore } from 'react-toasts';
import DeleteButtonImage from "../images/Delete.svg";
import AddButtonImage from "../images/Add.svg";
import { getAvailableTimes, setAvailableTimes, signout } from '../api/api';
import TimezoneOptions from '../common/TimezoneOptions';
import Timelinelist from '../common/TimelistList';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

class SetAvailability extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      timezone: '',
      currentUserId: '',
      availableTimeList: [
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
      ]
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
    const { availableTimeList } = this.state;
    let list = availableTimeList;
    list[dayIdx].timeList.push({ from: 0, to: 0 });

    this.setState({
      availableTimeList: list,
    });
  }

  handleDelete(dayIdx, idx) {
    const { availableTimeList } = this.state;
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
    const { availableTimeList } = this.state;
    let list = availableTimeList;
    let timeId = 1;
    let timeStr = "";
    for (var i = 0; i < Timelinelist.length; i++) {
      if (parseInt(e.target.value) === Timelinelist[i].id) {
        timeId = i;
        timeStr = Timelinelist[i].str;
      }
    }

    list[dayIdx].timeList[timeIdx].to = timeId;
    list[dayIdx].timeList[timeIdx].toStr = timeStr;
    this.setState({
      availableTimeList: list,
    });
  }

  handleUpdatefrom(dayIdx, timeIdx, e) {
    const { availableTimeList } = this.state;
    let list = availableTimeList;
    let timeId = 1;
    let timeStr = "";
    for (var i = 0; i < Timelinelist.length; i++) {
      if (parseInt(e.target.value) === Timelinelist[i].id) {
        timeId = i;
        timeStr = Timelinelist[i].str;
      }
    }

    list[dayIdx].timeList[timeIdx].from = timeId;
    list[dayIdx].timeList[timeIdx].fromStr = timeStr;
    this.setState({
      availableTimeList: list,
    });
  }

  makeParam() {

  }

  handleSave = async () => {
    const { availableTimeList, dayOfWeekStatus, timezone } = this.state;
    const curr = new Date();
    var twoday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 2));

    for (var i = 0; i < availableTimeList.length; i++) {
      availableTimeList[i].status = dayOfWeekStatus[i];
      var week_date = new Date(curr.setDate(curr.getDate() - curr.getDay() + i));
      for (let j = 0; j < availableTimeList[i].timeList.length; j++) {
        // console.log("+++++ timelist = " + availableTimeList[i].timeList[j].fromStr + availableTimeList[i].timeList[j].toStr);
        let date_from = availableTimeList[i].timeList[j].fromStr.split(" ");
        let date_to = availableTimeList[i].timeList[j].toStr.split(" ");
        var date_from_timestamp = moment(week_date).format("YYYY-MM-DD ") + date_from[0] + date_from[1] + date_from[2] + " " + date_from[3];
        var date_to_timestamp = moment(week_date).format("YYYY-MM-DD ") + date_to[0] + date_to[1] + date_to[2] + " " + date_to[3];
        
        availableTimeList[i].timeList[j].fromTimestamp = new Date(date_from_timestamp).getTime()/1000;
        availableTimeList[i].timeList[j].toTimestamp = new Date(date_to_timestamp).getTime()/1000;
      }
    }

    let param = {
      email: localStorage.getItem('email'),
      // data: this.state.availableTimeList,
      data: availableTimeList,
      timezone: timezone
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
        var availableTimeListTemp = [
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
        for (var i = 0; i < result.data.data.length; i++) {
          for (var j = 0; j < availableTimeListTemp.length; j++) {
            if (result.data.data[i].day_of_week === availableTimeListTemp[j].dayOfWeek) {
              availableTimeListTemp[j].timeList.push({
                from: result.data.data[i].fromTime,
                to: result.data.data[i].toTime,
                fromStr: result.data.data[i].fromTimeStr,
                toStr: result.data.data[i].toTimeStr,
                status: result.data.data[i].status === 1 ? true : false
              });
              availableTimeListTemp[j].status = result.data.data[i].status === 1 ? true : false;
              // availableTimeListTemp[j].timeList[i].fromStr = result.data.data[i].fromStr;
              // availableTimeListTemp[j].timeList[i].toStr = result.data.data[i].toStr;
            }
          }
          if (result.data.data[i].day_of_week === "Sunday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[0] = result.data.data[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data[i].day_of_week === "Monday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[1] = result.data.data[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data[i].day_of_week === "Tuesday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[2] = result.data.data[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data[i].day_of_week === "Wednesday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[3] = result.data.data[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data[i].day_of_week === "Thursday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[4] = result.data.data[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data[i].day_of_week === "Friday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[5] = result.data.data[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          } else if (result.data.data[i].day_of_week === "Saturday") {
            let { dayOfWeekStatus } = this.state;
            let temp = dayOfWeekStatus;
            temp[6] = result.data.data[i].status === 1 ? true : false;
            this.setState({ dayOfWeekStatus: temp });
          }
          timezone = result.data.data[i].timezone;
        }
        this.setState({
          availableTimeList: availableTimeListTemp,
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
    const { dayOfWeekStatus } = this.state;
    let temp = dayOfWeekStatus;
    // if(this.state.dayOfWeekStatus[dayOfWeek]) {
    if (this.state.availableTimeList[dayOfWeek].status) {
      if (this.state.availableTimeList[dayOfWeek].timeList.length) {
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
      if (this.state.availableTimeList[dayOfWeek].timeList.length) {
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
    temp[dayOfWeek] = !this.state.availableTimeList[dayOfWeek].status;
    this.setState({
      dayOfWeekStatus: temp
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

  render() {
    const { loading, availableTimeList, dayOfWeekStatus, timezone } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
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
                      <FormSelect id="feInputState" className="profile-detail-input" onChange={(e) => this.onChangeTimeZone(e)}>
                        {TimezoneOptions.map((item, idx) => {
                          return (
                            item.value === timezone ? <option key={idx} value={item.value} selected> {item.name}</option> : <option key={idx} value={item.value}> {item.name}</option>
                          );
                        })}
                      </FormSelect>
                    </Col>
                  </Row>
                  {availableTimeList.map((day, dayIdx) => {
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
                                    <FormSelect id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdatefrom(dayIdx, timeIdx, e)}>
                                      {Timelinelist.map((item, idx) => {
                                        return (
                                          time.from === item.id
                                            ? <option key={idx} vaule={item.id} selected>{item.str}</option>
                                            : <option key={idx} value={item.id}>{item.str}</option>
                                        );
                                      })}
                                    </FormSelect>
                                  </Col>
                                  <Col md="5" xs="4">
                                    <FormSelect id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdateto(dayIdx, timeIdx, e)}>
                                      {Timelinelist.map((item, idx) => {
                                        return (
                                          time.to === item.id
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
                                <FormSelect disabled id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdatefrom(0, 0, e)}>
                                  {Timelinelist.map((item, idx) => {
                                    return (
                                      <option key={idx} >{item.str}</option>
                                    )
                                  })}
                                </FormSelect>
                              </Col>
                              <Col md="5" xs="4">
                                <FormSelect disabled id="feInputState" className="available-time-input" onChange={(e) => this.handleUpdateto(0, 0, e)}>
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
