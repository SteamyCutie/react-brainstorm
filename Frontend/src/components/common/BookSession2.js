import React from "react";
import { Modal, ModalBody, Button, ModalHeader, FormInput, FormTextarea, Row, Col } from "shards-react";
import Close from '../../images/Close.svg';
import moment from 'moment';
import Calendar from 'react-calendar';
import { ToastsStore } from 'react-toasts';
import 'react-calendar/dist/Calendar.css';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PublicIcon from '@material-ui/icons/Public';
import { setbookedtime, signout } from '../../api/api'

moment.locale('en');

export default class BookSession2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: "", 
      displayDate: "",
      showBookingComponents: false,
      startDateTime: "",
      timeList: [],
      duration: 0
    };
  }

  toggle() {
    console.log(this.props.id, "??????");
    const { toggle } = this.props;

    this.setState({
      currentDate: "",
      showBookingComponents: false,
      timeList: []
    })

    toggle();
  }

  onChange(value, event) {
    this.setState({
      currentDate: moment(value).format('YYYY-MM-DD'),
      displayDate: moment(value).format('dddd, MMMM DD'),
      timeList: []
    })
  }

  getAvailableTimes(currentDate) {
    const { availableTimes } = this.props;
    let timeList = [];

    for (var i in availableTimes) {
      if (currentDate === availableTimes[i].date) {
        timeList = availableTimes[i].spots;
        break;
      }
    }

    return timeList;
  }

  handleTimeClick(time) {
    const { currentDate } = this.state;

    this.setState({
      showBookingComponents: true,
      startDateTime: time.start_time, 
    })
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

  handleBookSession = async () => {
    const { startDateTime, duration } = this.state;
    const api_param = {
      user_id: localStorage.getItem("user_id"),
      mentor_id: this.props.id,
      start: startDateTime,
      duration: duration
    };

    try {
      const result = await setbookedtime(api_param);

      if (result.data.result === "success") {
        ToastsStore.success("Booking Session Success");
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
    }
    this.toggle();
  }

  onActiveStartDateChange(param) {
    let currentDate = new Date();
    let startDate = moment(param.activeStartDate);
    let endDate = moment(new Date(startDate.year(), startDate.month() + 1, 0)).format("MM-DD-YYYY");
    if (currentDate.getMonth() == startDate.month()) {
      startDate = moment(currentDate);
    }

    const api_param = {
      startDate: startDate.format("MM-DD-YYYY"),
      endDate: endDate,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    console.log(api_param, "++++++")
  }

  componentDidMount() {
    let startDate = moment();
    let endDate = moment(new Date(startDate.year(), startDate.month() + 1, 0)).format("MM-DD-YYYY");

    const api_param = {
      startDate: startDate.format("MM-DD-YYYY"),
      endDate: endDate,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    console.log(api_param, "159")
  }

  handleDurationChange(eve) {
    this.setState({
      duration: parseInt(eve.target.value)
    });
  }

  getTimezone(){
    const d = new Date();
    const dtf = Intl.DateTimeFormat(undefined, {timeZoneName: 'long'});
    const result = dtf.formatToParts(d).find((part) => part.type == 'timeZoneName').value;

    return result;
  }

  render() {
    const { open } = this.props;
    const { currentDate, displayDate, showBookingComponents, startDateTime } = this.state;
    const availableTimes = this.getAvailableTimes(currentDate);
    return (
      <div>
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <ModalHeader>
            <label style={{fontSize: "25px",paddingTop: "15px",fontWeight: "bold",color: "#0f0f0f"}}>{"Select a Date & Time"}</label>
            <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          </ModalHeader>

          <ModalBody className="modal-content-class center full-width">
            <div className="center specific-date-calendar">
              <Calendar 
                minDate={new Date()}
                next2Label = {null}
                prev2Label = {null}
                calendarType = "Hebrew"
                onChange={(value, event) => this.onChange(value, event)}
                onActiveStartDateChange={(param) => this.onActiveStartDateChange(param)}
              />
              <div className="specific-date-times">
                {currentDate && 
                  <div style={{width: "100%", marginBottom: "20px"}}>
                    <label style={{marginRight: "auto", width: "calc(100% - 50px)", fontSize: "17px", fontWeight: "bold"}}>{displayDate}</label>
                  </div>
                }
                {currentDate && 
                  <div className="book-date-time-list">
                    {availableTimes.map((time, idx) => {
                      return (
                        <Button key={idx} className="btn-mentor-detail-time-book" onClick={() => this.handleTimeClick(time)}>
                          {moment(time.start_time).format("LT").toString()}
                        </Button>
                      )
                    })}
                  </div>
                }
              </div>
            </div>
            {showBookingComponents && 
              <Row className="booking-components">
                <label>Please share anything that will help prepare for our meeting.</label>
                <FormTextarea className="booking-components-comment" />
                <Col>
                  <label><CalendarTodayIcon style={{ fontSize: "30px", color: "#04B5FA", marginRight: "10px"}} />
                    {moment(startDateTime).format("h:mm A, dddd, MMMM, DD, YYYY").toString()}
                  </label>
                  <div><PublicIcon style={{ fontSize: "30px", color: "#04B5FA", marginRight: "10px"}} />{this.getTimezone()}</div>
                  <div style={{marginTop: "20px"}} className="center">
                    <FormInput className="booking-components-hours" type="number" max="12" min="1" onChange={(eve) => this.handleDurationChange(eve)}/>
                    <label style={{marginRight: "20px", marginLeft: "5px"}}>hours</label>
                    <Button className="btn-mentor-detail-time-book" onClick={() => this.handleBookSession()}>
                      Schedule Event
                    </Button>
                  </div>
                </Col>
              </Row>
            }
          </ModalBody>
        </Modal>
      </div>
    );
  }
}