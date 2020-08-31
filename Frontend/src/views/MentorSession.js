import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Badge, Button, FormSelect } from "shards-react";
import { Calendar, momentLocalizer, globalizeLocalizer  } from 'react-big-calendar'
import moment from 'moment';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import TimeGrid from 'react-big-calendar/lib/TimeGrid'

// import PageTitle from "./../components/common/PageTitle";
// import SmallStats from "./../components/common/SmallStats";
// import UsersOverview from "./../components/blog/UsersOverview";
// import UsersByDevice from "./../components/blog/UsersByDevice";
// import NewDraft from "./../components/blog/NewDraft";
// import Discussions from "./../components/blog/Discussions";
// import TopReferrals from "./../components/common/TopReferrals";
import WalletHeader from "../components/common/WalletHeader";
import "react-big-calendar/lib/css/react-big-calendar.css";

import BackIcon from "../images/Back_icon.svg"
import NextIcon from "../images/Next_icon.svg"

const localizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ( {date} ) => props => {

  const checkInMonth = (currentValue, setValue) => {
    let setMonth = setValue.getMonth();
    let currentMonth = currentValue.getMonth();
    let today = new Date();
    if (today.getFullYear() === setValue.getFullYear() && today.getMonth() === setValue.getMonth() && today.getDate() === setValue.getDate()) return 0;
    else if (setMonth !== currentMonth) return -1;
    else return 1;
  }

  const checkBorderRadius = () => {
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let cPos = props.value.getDay();
    let day = lastDay.getDate();
    let month = lastDay.getMonth();
    let year = lastDay.getFullYear();
    let sDay = props.range[6].getDate();
    let sMonth = props.range[6].getMonth();
    let sYear = props.range[6].getFullYear();
    if(sMonth > month || (sMonth < month && sYear !== year) || (sMonth === month && sDay === day)) {
      if(cPos === 0) return -1;
      else if(cPos === 6) return 1;
    }
    else return 0;
  }

  const checkBorderWidth = () => {
    let cPos = props.value.getDay();
    if(cPos === 0) return -1;
    else if(cPos === 6) return 1;
    else return 0;
  }

  return (
    React.cloneElement(React.Children.only(props.children), {
      style: {
        ...props.children.style,
        backgroundColor: checkInMonth(date, props.value) === 1 ? "#FFFFFF" : checkInMonth(date, props.value) === -1 ? "#E6E6E6" : "#04B5FA22",
        borderBottomLeftRadius: checkBorderRadius() === -1 ? "10px" : "0px",
        borderBottomRightRadius: checkBorderRadius() === 1 ? "10px" : "0px",
        borderColor: "#E0E0E0",
        borderWidth: "1px",
        // borderLeftWidth: checkBorderWidth() === -1 ? "0px" : "1px",
        // borderRightWidth: checkBorderWidth() === 1 ? "0px" : "1px",
      },
    })
  );
}

export default class MentorSession extends React.Component {
  constructor(props) {
    super(props);
    const now = new Date();
    this.state = {
      events: [
        {
          id: 0,
          title: 'All Day Event very long title',
          allDay: false,
          noOfPax: 123,
          isBooked: true,
          start: new Date(2020, 7, 1, 2, 0, 0),
          end: new Date(2020, 7, 1, 3, 30, 0),
        },
        {
          id: 5,
          title: 'All Day Event very long title 2',
          allDay: false,
          noOfPax: 123,
          isBooked: true,
          start: new Date(2020, 7, 1, 4, 0, 0),
          end: new Date(2020, 7, 1, 4, 30, 0),
        },
        {
          id: 1,
          title: 'Long Event',
          noOfPax: 101,
          isBooked: true,
          start: new Date(2020, 7, 7, 10, 0, 0),
          end: new Date(2020, 7, 7, 11, 30, 0),
        },
        {
          id: 2,
          title: 'Long Event 2',
          noOfPax: 10,
          isBooked: true,
          start: new Date(2020, 7, 7, 15, 0, 0),
          end: new Date(2020, 7, 7, 16, 30, 0),
        },
        {
          id: 3,
          title: 'Long Event 3',
          noOfPax: 10,
          isBooked: true,
          start: new Date(2020, 7, 7, 17, 0, 0),
          end: new Date(2020, 7, 7, 18, 30, 0),
        },
        {
          id: 4,
          title: 'Right now Time Event',
          noOfPax: 1,
          isBooked: false,
          start: now,
          end: now,
        },
      ],
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
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <WalletHeader title="Upcoming Session" className="text-sm-left mb-3" flag={false}/>
        </Row>
        <Row className="calendar-class">
          <Calendar
            localizer={localizer}
            events={this.state.events}
            defaultDate={moment().toDate()}
            startAccessor="start"
            endAccessor="end"
            style={{width: "100%", borderRadius: "10px"}}
            components={{
              toolbar: ToolBar({
                setCurrentDate: this.setCurrentDate,
                view: this.state.view,
                setView: this.setView,
              }),
              dateCellWrapper: ColoredDateCellWrapper({
                date: this.state.currentDate,
              }),
              month: {
                dateHeader: CustomMonthDateHeader({
                  events: this.state.events,
                }),
                header: CustomMonthHeader,
                event: CustomMonthEvent,
              }
            }}
          />
        </Row>
      </Container>
    );
  }
}

class CustomMonthEvent extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const bookedIcon = this.props.event.isBooked ? <Badge><i className="fa fa-bookmark"></i></Badge> : null ;
    return (
      <div style={{position: "relative"}} className="Hello">
        {/* <strong>{moment(this.props.event.start).format('ha')}</strong> {this.props.event.title}
        <span className="pull-right">
          {bookedIcon}
          <Badge>{this.props.event.noOfPax} <i className="fa fa-user"></i></Badge>
        </span> */}
        Hello World!
      </div>
    );
  }
}

const ToolBar = ({setCurrentDate, view, setView}) => props => {
  const [alignment, setAlignment] = React.useState("right");
  const [monthLabel, setMonthLabel] = React.useState(moment(new Date()).endOf('month').format('MMMM YYYY'));
  const [currentMonth, setCurrentMonth] = React.useState(moment(new Date()).endOf('month').format('MMM'));
  const [nextMonth, setNextMonth] = React.useState(moment(new Date()).add(1, 'month').format('MMM'));
  
  const goToDayView = () => {
    // setView("day");
    props.onView("day");
    // setAlignment("left");
  }

  const goToWeekView = () => {
    // setView("week");
    props.onView("week");
    // setAlignment("center");
  }

  const goToMonthView = () => {
    // setView("month");
    props.onView("month");
    // setAlignment("right");
  }

  const goToToday = () => {
    let today = new Date();
    props.onNavigate("today", today);
    getCalendarEvents(today);
  }

  const getCalendarEvents = (date) => {
    // const {project} = this;
    // const startDate = moment(date).add(-1, 'month').toDate();
    // const endDate = moment(date).endOf('month').toDate();
    const currentMonth = moment(date).endOf('month').format('MMMM YYYY');
    const monthToday = moment(date).endOf('month').format('MMM');
    let nextCurrentMonth = moment(date).add(1, 'month').format('MMM');
    
    setCurrentDate(date);

    setMonthLabel(currentMonth);
    setCurrentMonth(monthToday);
    setNextMonth(nextCurrentMonth);
    
    // if (project) {
    //   project.getEvents(project.id, startDate, endDate, (err, res) => {
    //     if (err) {
    //       throw err;
    //     }
    //     this.setState({
    //       events: res.body
    //     });
    
    //   });
    // }
  }

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  }

  const goToBack = () => {
    let mDate = props.date;
    if(props.view === "month") {
      let newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth() - 1,
        1);
      props.onNavigate('prev', newDate);
      getCalendarEvents(newDate);
    }
    else if(props.view === "week" ) {
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
    if(props.view === "month") {
      let newDate = new Date(
        mDate.getFullYear(),
        mDate.getMonth() + 1,
        1);
      props.onNavigate('prev', newDate);
      getCalendarEvents(newDate);
    }
    else if(props.view === "week" ) {
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

  return (
    <div>
      <div className="toolbar-class">
        <div className="toolbar-status">
          <Button className="today-icon-class" onClick={goToToday}>Today</Button>
          <label className="toolbar-month-class">{props.label}</label>
          <Button onClick={goToBack} className="back-icon-class">
            <img src={BackIcon} alt="BackIcon" />
          </Button>
          <Button onClick={goToNext} className="next-icon-class">
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
            <ToggleButton value="left" aria-label="left aligned" className="toolbar-day-button" onClick={goToDayView}>
              Day
            </ToggleButton>
            <ToggleButton value="center" aria-label="right aligned" className="toolbar-week-button" onClick={goToWeekView}>
              Week
            </ToggleButton>
            <ToggleButton value="right" aria-label="right aligned" className="toolbar-month-button" onClick={goToMonthView}>
              Month
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div >
      <div className="headerbar-class">
        <div className="headerbar-status center">{getToday()}</div>
        <div className="headerbar-select-group">
          <div className="toolbar-select-label">
            <label className="">Sessions:</label>
            <FormSelect className="profile-detail-input">
              <option>All</option>
              <option>...</option>
            </FormSelect>
          </div>
          <div className="toolbar-select-label">
            <label className="">Category: </label>
            <FormSelect className="profile-detail-input">
              <option>select category</option>
              <option>...</option>
            </FormSelect>
          </div>
          <div className="toolbar-select-label">
            <label className="">Student: </label>
            <FormSelect className="profile-detail-input">
              <option>select student</option>
              <option>...</option>
            </FormSelect>
          </div>
        </div>
      </div>
    </div>
  );
}


const CustomMonthDateHeader = ({events}) => props => {

  const consoleFunction = () => {
    return true;
  }

  const calcRecordCound = () => {
    let count = 0;
    events.forEach(event => {
      if(event.start.getFullYear() === props.date.getFullYear() && event.start.getMonth() === props.date.getMonth() && event.start.getDate() === props.date.getDate()) count++;
    });
    return count;
  }

  const consoleFunction2 = (date, view, e) => {
    const { onDrillDown, drilldownView } = props;
    // onDrillDown(date, view, drilldownView);
    // props.onView(view);
  }

  return (
    <div>
      <div className="month-date-header">
        {consoleFunction() && props.date.getDate()}
      </div>
      <div className="month-date">
        {calcRecordCound() > 0 && <a className="month-date-content" onClick={(e) => consoleFunction2(props.date, "day", e)}>
          {`${calcRecordCound()} session${calcRecordCound() > 1 ? "s" : ""}`}
        </a>}
      </div>
    </div>
  );
}


class CustomMonthHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = this.props.date;
    let dayName = days[d.getDay()];
    return (
      <div className="monthHeader">{dayName}</div>
    );
  }
}
