import React from "react";
import { Container, Row, Button, FormSelect, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "shards-react";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import LoadingModal from "../components/common/LoadingModal";
import { getUpcomingSession, signout } from '../api/api';
import { ToastsStore } from 'react-toasts';
import WalletHeader from "../components/common/WalletHeader";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BackIcon from "../images/Back_icon.svg";
import NextIcon from "../images/Next_icon.svg";

const localizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ({ date }) => props => {

  const checkInMonth = (currentValue, setValue) => {
    let setMonth = setValue.getMonth();
    let currentMonth = currentValue.getMonth();
    let today = new Date();
    if (today.getFullYear() === setValue.getFullYear() && today.getMonth() === setValue.getMonth() && today.getDate() === setValue.getDate()) return 0;
    else if (setMonth !== currentMonth) return -1;
    else return 1;
  }

  const checkBorderRadius = () => {
    if (props.range.length === 7) {
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let cPos = props.value.getDay();
      let day = lastDay.getDate();
      let month = lastDay.getMonth();
      let year = lastDay.getFullYear();
      let sDay = props.range[6].getDate();
      let sMonth = props.range[6].getMonth();
      let sYear = props.range[6].getFullYear();
      if (sMonth > month || (sMonth < month && sYear !== year) || (sMonth === month && sDay === day)) {
        if (cPos === 0) return -1;
        else if (cPos === 6) return 1;
      }
      else return 0;
    }
    return 0;
  }

  return (
    React.cloneElement(React.Children.only(props.children), {
      style: {
        ...props.children.style,
        backgroundColor: checkInMonth(date, props.value) === 1 ? "#FFFFFF" : checkInMonth(date, props.value) === -1 ? "#E6E6E6" : "#04B5FA22",
        borderBottomLeftRadius: checkBorderRadius() === -1 ? "10px" : "0px",
        borderBottomRightRadius: checkBorderRadius() === 1 ? "10px" : "0px",
        borderColor: "#E0E0E0",
        borderWidth: "1px"
      },
    })
  );
}

export default class MentorSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      events: [],
      currentDate: new Date(),
      view: "month",
    };
  }

  setCurrentDate = (date) => {
    this.setState({
      currentDate: date
    });
  }

  setView = (view) => {
    this.setState({
      view,
    });
  }

  componentWillMount() {
    this.getSessionList();
  }

  getSessionList = async () => {
    let param = {
      email: localStorage.getItem('email'),
      tag_id: ''
    }
    try {
      this.setState({ loading: true });
      const result = await getUpcomingSession(param);
      if (result.data.result === "success") {
        var data_arr = [];
        var arr = {
          id: '',
          title: '',
          name: '',
          mentor_name: '',
          noOfPax: '',
          isBooked: '',
          start: 0,
          end: false,
          room_id: 0,
          from: ''
        };

        for (var i = 0; i < result.data.data.length; i++) {
          arr.id = i;
          arr.title = result.data.data[i].title;
          arr.name = result.data.data[i].name;
          arr.mentor_name = result.data.data[i].mentor_name;
          arr.noOfPax = 10;
          arr.isBooked = true;
          arr.start = new Date(result.data.data[i].s_year, result.data.data[i].s_month - 1, result.data.data[i].s_day, i, i, 0);
          arr.end = new Date(result.data.data[i].e_year, result.data.data[i].e_month - 1, result.data.data[i].e_day, i, i + 20, 0);
          arr.room_id = result.data.data[i].room_id;
          arr.from = result.data.data[i].from.split(" ")[1]

          data_arr.push(arr);
          arr = {};
        }
        this.setState({ events: data_arr });
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
    }
  }

  changeMonth = (value) => {
    this.setState({ events: value });
  }

  showLoading = (value) => {
    this.setState({ loading: value });
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
    return (
      <>
        {this.state.loading && <LoadingModal open={true} />}
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <WalletHeader title="Upcoming Session" className="text-sm-left mb-3" flag={false} />
          </Row>
          <Row className="calendar-class">
            <Calendar
              localizer={localizer}
              culture='en-GB'
              events={this.state.events}
              defaultDate={moment().toDate()}
              startAccessor="start"
              endAccessor="end"
              style={{ width: "100%", borderRadius: "10px" }}
              components={{
                toolbar: ToolBar({
                  setCurrentDate: this.setCurrentDate,
                  changeMonth: this.changeMonth,
                  showLoading: this.showLoading
                }),
                dateCellWrapper: ColoredDateCellWrapper({
                  date: this.state.currentDate,
                }),
                month: {
                  dateHeader: CustomMonthDateHeader({
                    events: this.state.events,
                    startSession: this.props.startSession,
                  }),
                  header: CustomMonthHeader,
                  event: CustomMonthEvent,
                },
                week: {
                  header: CustomWeekHeader,
                  event: CustomWeekEvent,
                }
              }}
            />
          </Row>
        </Container>
      </>
    );
  }
}

class CustomMonthEvent extends React.Component {
  render() {
    return (
      <div style={{ position: "relative" }} className="Hello">
        Hello World!
      </div>
    );
  }
}

const ToolBar = ({ changeMonth, showLoading }) => props => {
  const [alignment, setAlignment] = React.useState("right");
  const [selectedTag] = React.useState("");
  const [tags] = React.useState([
    { id: 1, name: 'Algebra' },
    { id: 2, name: 'Mathematics' },
    { id: 3, name: 'Act' },
    { id: 4, name: 'Organic' },
    { id: 5, name: 'English' },
    { id: 6, name: 'Cooking' },
    { id: 7, name: 'German' },
    { id: 8, name: 'French' },
    { id: 9, name: 'Spanish' },
    { id: 10, name: 'Russian' },
    { id: 11, name: 'Coaching' },
    { id: 12, name: 'Travelling' },
    { id: 13, name: 'Cooking' },
    { id: 14, name: 'Copy' },
    { id: 15, name: 'Sales' },
  ]);
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const result = await gettags();
  //       if (result.data.result === "success") {
  //         setTags(result.data.data);
  //       } else {

  //       }
  //     } catch(err) {

  //     }
  //   };
  //   fetchData();
  // });

  const goToDayView = () => {
    props.onView("day");
    setAlignment("left");
  }

  const goToWeekView = () => {
    props.onView("week");
    setAlignment("center");
  }

  const goToMonthView = () => {
    props.onView("month");
    setAlignment("right");
  }

  const goToToday = () => {
    let today = new Date();
    props.onNavigate("today", today);
    getCalendarEvents(today);
  }

  const getCalendarEvents = async () => {
    // setCurrentDate(date);
    try {
      showLoading(true);
      const result = await getUpcomingSession({ email: localStorage.getItem('email') });
      if (result.data.result === "success") {
        var data_arr = [];
        var arr = {
          id: '',
          name: '',
          mentor_name: '',
          title: '',
          noOfPax: '',
          isBooked: '',
          start: 0,
          end: false,
          room_id: 0,
          from: ''
        };

        for (var i = 0; i < result.data.data.length; i++) {
          arr.id = i;
          arr.title = result.data.data[i].title;
          arr.name = result.data.data[i].name;
          arr.mentor_name = result.data.data[i].mentor_name;
          arr.noOfPax = 10;
          arr.isBooked = true;
          arr.start = new Date(result.data.data[i].s_year, result.data.data[i].s_month - 1, result.data.data[i].s_day, i, i, 0);
          arr.end = new Date(result.data.data[i].e_year, result.data.data[i].e_month - 1, result.data.data[i].e_day, i, i + 20, 0);
          arr.room_id = result.data.data[i].room_id;
          arr.from = result.data.data[i].from.split(" ")[1]

          data_arr.push(arr);
          arr = {};
        }
        changeMonth(data_arr);
      } else {
        if (result.data.message === "Token is Expired") {
          signout();
        } else if (result.data.message === "Token is Invalid") {
          signout();
        } else if (result.data.message === "Authorization Token not found") {
          signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      showLoading(false);
    } catch (err) {
      showLoading(false);
      ToastsStore.error("Something Went wrong");
    }
  }

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  }

  const goToBack = () => {
    let mDate = props.date;
    if (props.view === "month") {
      let newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth() - 1,
        1);
      props.onNavigate('prev', newDate);
      getCalendarEvents(newDate);
    }
    else if (props.view === "week") {
      let newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth(),
        mDate.getDate() - 7);
      props.onNavigate('prev', newDate);
      getCalendarEvents(newDate);
    }
    else {
      let newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth(),
        mDate.getDate() - 1);
      props.onNavigate('prev', newDate);
      getCalendarEvents(newDate);
    }
  }

  const goToNext = () => {
    let mDate = props.date;
    if (props.view === "month") {
      let newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth() + 1,
        1);
      props.onNavigate('prev', newDate);
      getCalendarEvents(newDate);
    }
    else if (props.view === "week") {
      let newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth(),
        mDate.getDate() + 7);
      props.onNavigate('prev', newDate);
      getCalendarEvents(newDate);
    }
    else {
      let newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth(),
        mDate.getDate() + 1);
      props.onNavigate('prev', newDate);
      getCalendarEvents(newDate);
    }
  }

  const getToday = () => {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayName = days[props.date.getDay()];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let monthName = months[props.date.getMonth()];
    let date = props.date.getDate();
    return `${dayName}, ${monthName} ${date}`;
  }

  const onChangeTag = async (e) => {
    try {
      showLoading(true);
      const result = await getUpcomingSession({ email: localStorage.getItem('email'), tag_id: e.target.value });
      if (result.data.result === "success") {
        var data_arr = [];
        var arr = {
          id: '',
          title: '',
          name: '',
          mentor_name: '',
          noOfPax: '',
          isBooked: '',
          start: 0,
          end: false,
          room_id: 0,
          from: ''
        };

        for (var i = 0; i < result.data.data.length; i++) {
          arr.id = i;
          arr.title = result.data.data[i].title;
          arr.name = result.data.data[i].name;
          arr.mentor_name = result.data.data[i].mentor_name;
          arr.noOfPax = 10;
          arr.isBooked = true;
          arr.start = new Date(result.data.data[i].s_year, result.data.data[i].s_month - 1, result.data.data[i].s_day, i, i, 0);
          arr.end = new Date(result.data.data[i].e_year, result.data.data[i].e_month - 1, result.data.data[i].e_day, i, i + 20, 0);
          arr.room_id = result.data.data[i].room_id;
          arr.from = result.data.data[i].from.split(" ")[1]

          data_arr.push(arr);
          arr = {};
        }
        changeMonth(data_arr);
      } else {

      }
      showLoading(false);
    } catch (err) {
      showLoading(false);
    }
  }

  return (
    <div>
      <div className="toolbar-class">
        <div className="toolbar-status">
          <Button className="today-icon-class" onClick={() => goToToday()}>Today</Button>
          <label className="toolbar-month-class">{props.label}</label>
          <Button onClick={() => goToBack()} className="back-icon-class">
            <img src={BackIcon} alt="BackIcon" />
          </Button>
          <Button onClick={() => goToNext()} className="next-icon-class">
            <img src={NextIcon} alt="NextIcon" />
          </Button>
        </div>
        <div className="toolbar-button-group-class">
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={(event, newAlignment) => handleAlignment(event, newAlignment)}
            className="toolbar-button-group"
            aria-label="text alignment"
          >
            <ToggleButton value="left" aria-label="left aligned" className="toolbar-day-button" onClick={() => goToDayView()}>
              Day
            </ToggleButton>
            <ToggleButton value="center" aria-label="right aligned" className="toolbar-week-button" onClick={() => goToWeekView()}>
              Week
            </ToggleButton>
            <ToggleButton value="right" aria-label="right aligned" className="toolbar-month-button" onClick={() => goToMonthView()}>
              Month
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div >
      <div className="headerbar-class">
        <div className="headerbar-status center">{getToday()}</div>
        <div className="headerbar-select-group">
          <div className="toolbar-select-label">
            <label className="">Tag: {selectedTag}</label>
            <FormSelect id="feInputState" onChange={(e) => onChangeTag(e)}>
              <option value="">select tag</option>
              {tags.map((item, idx) =>
                selectedTag === item.id ? <option key={idx} value={item.id} selected>{item.name}</option>
                  : <option key={idx} value={item.id}>{item.name}</option>
              )}
            </FormSelect>
          </div>
        </div>
      </div>
    </div>
  );
}


const CustomMonthDateHeader = ({ events, startSession }) => props => {
  const [open, setOpen] = React.useState(false);
  const [roomIds, setRoomIds] = React.useState([]);

  React.useEffect(() => {
    let room_id = [];
    events.forEach(event => {

      if (event.start.getFullYear() === props.date.getFullYear() && event.start.getMonth() === props.date.getMonth() && event.start.getDate() === props.date.getDate())
        room_id.push({ room_id: event.room_id, time: event.from })
    });
    setRoomIds(room_id);
  }, []);
  const consoleFunction = () => {
    return true;
  }

  const calcRecordCound = () => {
    let count = 0;
    events.forEach(event => {
      if (event.start.getFullYear() === props.date.getFullYear() && event.start.getMonth() === props.date.getMonth() && event.start.getDate() === props.date.getDate()) count++;
    });
    return count;
  }

  const startForum = (room_id) => {
    startSession(room_id);
  }

  const toggle = () => {
    setOpen(!open);
  }

  return (
    <div>
      <div className="month-date-header">
        {consoleFunction() && props.date.getDate()}
      </div>
      <div className="month-date">
        <Dropdown open={open} toggle={toggle}>
          <DropdownToggle>
            {calcRecordCound() > 0 && <label className="month-date-content"> {`${calcRecordCound()} session${calcRecordCound() > 1 ? "s" : ""}`} </label>}
          </DropdownToggle>
          <DropdownMenu>
            {roomIds.map((room_id, idx) => {
              return <DropdownItem onClick={() => startForum(room_id.room_id)} key={idx}>
                Start Forum ({room_id.time})
            </DropdownItem>
            })}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

class CustomMonthHeader extends React.Component {
  render() {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = this.props.date;
    let dayName = days[d.getDay()];
    return (
      <div {...this.props.date.getDay() === 0 ? { className: "monthHeader-again" } : { className: "monthHeader" }}>{dayName}</div>
    );
  }
}

const CustomWeekHeader = props => {

  const checkLabel = () => {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let dayName = days[props.date.getDay()];
    let month = props.date.getMonth() + 1;
    let monthName = month < 10 ? `0${month}` : month;
    let date = props.date.getDate();
    let dateName = date < 10 ? `0${date}` : date;
    let totalName = `${dayName} ${monthName}/${dateName}`;
    return totalName;
  }

  return (
    <div className="week-header">
      {checkLabel()}
    </div>
  );
}

const CustomWeekEvent = props => {

  const checkWeekEventTime = () => {
    let hours = props.event.start.getHours();
    let startType = "am";
    let startHour = "";
    let startMinute = "";
    let endHour = "";
    let endMinute = "";
    let endType = "am";
    if (hours >= 12) {
      startType = "pm";
      hours = hours % 12;
    }
    if (hours < 10) startHour = `0${hours}`;
    else startHour = `${hours}`;
    let minutes = props.event.start.getMinutes();
    if (minutes < 10) startMinute = `0${minutes}`;
    else startMinute = `${minutes}`;

    hours = props.event.end.getHours();
    minutes = props.event.end.getMinutes();
    if (hours >= 12) {
      endType = "pm";
      hours = hours % 12;
    }
    if (hours < 10) endHour = `0${hours}`;
    else endHour = `${hours}`;
    if (minutes < 10) endMinute = `0${minutes}`;
    else endMinute = `${minutes}`;

    let result = `${startHour}:${startMinute} ${startType} - ${endHour}:${endMinute} ${endType}`;
    return result;
  }

  return (
    <div className="week-event">
      <div className="week-event-time">{checkWeekEventTime()}</div>
      <div className="week-event-content">{props.event.mentor_name}</div>
    </div>
  );
}