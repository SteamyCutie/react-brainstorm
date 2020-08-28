import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Badge, Button } from "shards-react";
import { Calendar, momentLocalizer, globalizeLocalizer  } from 'react-big-calendar'
import moment from 'moment';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

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
const myEventsList = {};
const CURRENT_DATE = moment().toDate();



export default class MentorSession extends React.Component {
  constructor(props) {
    super(props);
    const now = new Date();
    const events = [
      {
          id: 0,
          title: 'All Day Event very long title',
          allDay: true,
          noOfPax: 123,
          isBooked: true,
          start: new Date(2020, 7, 1),
          end: new Date(2020, 7, 2),
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
          title: 'Right now Time Event',
          noOfPax: 1,
          isBooked: false,
          start: now,
          end: now,
      },
    ]
    this.state = {
      events
    };
  }

  componentWillMount() {
  }

  MyDateCell = props => {
    console.log(props);
    return (
      <div style={{backgroundColor: "white"}}>
        A
      </div>
    );
  };

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
            style={{width: "100%"}}
            components={{
              toolbar: ToolBar,
            }}
          />
        </Row>
      </Container>
    );
  }
}

class CustomEvent extends React.Component {
  render() {
    const bookedIcon = this.props.event.isBooked ? <Badge><i className="fa fa-bookmark"></i></Badge> : null ;

    return (
      <div style={{position: "relative"}}>
        <strong>{moment(this.props.event.start).format('ha')}</strong> {this.props.event.title}
        <span className="pull-right">
          {bookedIcon}
          <Badge>{this.props.event.noOfPax} <i className="fa fa-user"></i></Badge>
        </span>
      </div>
    );
  }
}

class ToolBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      alignment: "right",
      monthLabel: moment(new Date()).endOf('month').format('MMMM YYYY'),
      currentMonth: moment(new Date()).endOf('month').format('MMM'),
      nextMonth: moment(new Date()).add(1, 'month').format('MMM')
    }
  }

  setAlignment(newAlignment) {
    this.setState({
      alignment: newAlignment,
    });
  }

  goToDayView = () => {
    this.props.onView('day');
  }

  goToWeekView = () => {
    this.props.onView('week');
  }

  goToMonthView = () => {
    this.props.onView('month');
  }

  getCalendarEvents = (date) => {
    const {project} = this;
    const startDate = moment(date).add(-1, 'month').toDate();
    const endDate = moment(date).endOf('month').toDate();
    const currentMonth = moment(date).endOf('month').format('MMMM YYYY');
    const monthToday = moment(date).endOf('month').format('MMM');
    let nextCurrentMonth = moment(date).add(1, 'month').format('MMM');
    
    this.setState({
      monthLabel: currentMonth,
      currentMonth: monthToday,
      nextMonth: nextCurrentMonth
    });
    
    if (project) {
      project.getEvents(project.id, startDate, endDate, (err, res) => {
        if (err) {
          throw err;
        }
        this.setState({
          events: res.body
        });
    
      });
    }
  }

  handleAlignment = (event, newAlignment) => {
    this.setAlignment(newAlignment);
  };

  goToBack = () => {
    let mDate = this.props.date;
    let newDate = new Date(
      mDate.getFullYear(),
      mDate.getMonth() - 1,
      1);
    this.props.onNavigate('prev', newDate);
    this.getCalendarEvents(newDate);
  }

  goToNext = () => {
    let mDate = this.props.date;
    let newDate = new Date(
      mDate.getFullYear(),
      mDate.getMonth() + 1,
      1);
    this.props.onNavigate('next', newDate);
    this.getCalendarEvents(newDate);
  
  }

  render() {
    console.log(this.props, "HHHHHH");
    const { alignment } = this.state;
    return (
      <div className="toolbar-class">
        <div className="toolbar-status">
          <Button className="today-icon-class">Today</Button>
          <label className="toolbar-month-class">{this.state.monthLabel}</label>
          <Button onClick={this.goToBack} className="back-icon-class">
            <img src={BackIcon} alt="BackIcon" />
          </Button>
          <Button onClick={this.goToNext} className="next-icon-class">
            <img src={NextIcon} alt="NextIcon" />
          </Button>
        </div>
        <div className="toolbar-button-group-class">
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={(event, newAlignment) => this.handleAlignment(event, newAlignment)}
            className="toolbar-button-group"
            aria-label="text alignment"
          >
            <ToggleButton value="left" aria-label="left aligned" className="toolbar-day-button" onClick={this.goToDayView}>
              Day
            </ToggleButton>
            <ToggleButton value="center" aria-label="right aligned" className="toolbar-week-button" onClick={this.goToWeekView}>
              Week
            </ToggleButton>
            <ToggleButton value="right" aria-label="right aligned" className="toolbar-month-button" onClick={this.goToMonthView}>
              Month
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div >
    );
  }
}
