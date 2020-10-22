import React from "react";
import { Modal, ModalBody, Button, ModalFooter, Col, Row } from "shards-react";
import LoadingModal from "./LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { getavailabletimesforstudent, signout, booksession } from '../../api/api';
import Close from '../../images/Close.svg'
import BackIcon from "../../images/Back_icon.svg"
import NextIcon from "../../images/Next_icon.svg"

export default class BookSession extends React.Component {
  constructor(props) {
    super(props);
    let today = new Date();
    this.state = {
      loading: false,
      date: today,
      weekdata: [],
      totalName: '',
      schedule: [],
      day: '',
      from: ''
    };
  }

  componentWillMount() {
    this.setState({day: new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDate()});
    this.checkLabel();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && this.props.id !== nextProps.id) {
      this.getAvailableTimeForStudent(nextProps.id);
    }
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  getAvailableTimeForStudent = async(id) => {
    let param = {
      user_id: id
    }

    try {
      this.setState({loading: true});
      const result = await getavailabletimesforstudent(param);

      if (result.data.result === "success") {
        this.setState({schedule: result.data.data});
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
          this.signout();
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

  checkLabel = () => {
    var curr = this.state.date;
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var twoday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
    var threeday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 2));
    var fourday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 3));
    var fiveday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 4));
    var sixday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 5));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));

    let yearName = curr.getFullYear();

    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let firstdayName = days[firstday.getDay()];
    let twodayName = days[twoday.getDay()];
    let threedayName = days[threeday.getDay()];
    let fourdayName = days[fourday.getDay()];
    let fivedayName = days[fiveday.getDay()];
    let sixdayName = days[sixday.getDay()];
    let lastdayName = days[lastday.getDay()];

    let monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let firstmonth = firstday.getMonth();
    let lastmonth = lastday.getMonth();

    let firstmonthName = monthNames[firstmonth];
    let lastmonthName = monthNames[lastmonth];

    let firstdate = firstday.getDate();
    let lastdate = lastday.getDate();

    let firstdateName = firstdate < 10 ? `0${firstdate}` : firstdate;
    let lastdateName = lastdate < 10 ? `0${lastdate}` : lastdate;

    let totalName = `${firstmonthName} ${firstdateName} - ${lastmonthName} ${lastdateName} , ${yearName}`;

    var temp = [];
    let obj1 = { date: firstdayName, day: firstday.getDate(), month: firstday.getMonth() + 1, year: firstday.getFullYear()};
    temp.push(obj1);
    let obj2 = { date: twodayName, day: twoday.getDate(), month: twoday.getMonth() + 1, year: twoday.getFullYear()};
    temp.push(obj2);
    let obj3 = { date: threedayName, day: threeday.getDate(), month: threeday.getMonth() + 1, year: threeday.getFullYear()};
    temp.push(obj3);
    let obj4 = { date: fourdayName, day: fourday.getDate(), month: fourday.getMonth() + 1, year: fourday.getFullYear()};
    temp.push(obj4);
    let obj5 = { date: fivedayName, day: fiveday.getDate(), month: fiveday.getMonth() + 1, year: fiveday.getFullYear()};
    temp.push(obj5);
    let obj6 = { date: sixdayName, day: sixday.getDate(), month: sixday.getMonth() + 1, year: sixday.getFullYear()};
    temp.push(obj6);
    let obj7 = { date: lastdayName, day: lastday.getDate(), month: lastday.getMonth() + 1, year: lastday.getFullYear()};
    temp.push(obj7);

    this.setState({
      weekdata: temp,
      totalName: totalName
    });
    temp = [];
    totalName = '';
  }

  goToBack() {
    let newDate = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth(),
      this.state.date.getDate() - 7);
    this.setState({
      date: newDate
    })
    this.checkLabel();
  }

  goToNext() {
    let newDate = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth(),
      this.state.date.getDate() + 7);
    this.setState({
      date: newDate
    })
    this.checkLabel();
  }

  bookSchedule = async(idx, idx1, time) => {
    const { weekdata } = this.state;

    let param = {
      user_id: localStorage.getItem('user_id'),
      mentor_id: this.props.id,
      day: weekdata[idx].year + '-' + weekdata[idx].month + '-' + weekdata[idx].day + '',
      from: time,
      description: "desc",
      title: "title"
    }

    try {
      this.setState({loading: true});
      const result = await booksession(param);

      if (result.data.result === "success") {
        this.showSuccess(result.data.result);
      } else if (result.data.result === "warning") {
        this.showWarning("You already booked session at this day!");
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
          this.signout();
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

  actionBookSession = async() => {
    this.props.toggle();
  } 

  signout = async() => {
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
    } catch(error) {
      this.removeSession();
    }
  }

  changeDate(day) {
    const { totalName } = this.state;
    let monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    let month = monthNames.indexOf(totalName.split("-")[0].split(" ")[0]) + 1 + "";
    let year = totalName.split(",")[1] + "";
    let date = day + "";
    this.setState({day: year+"-"+month+"-"+date});
  }

  removeSession() {
    localStorage.clear();
    window.location.href = "/";
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
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  render() {
    const { open } = this.props;
    const { loading, totalName, weekdata, schedule } = this.state;
    return (
      <div>
        <ReactNotification />
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Book a session</h1>
            
            <div className="week-header" style={{display: 'inline'}}>
              {totalName}
            </div>
            <Button onClick={() => this.goToBack()} className="back-icon-class">
              <img src={BackIcon} alt="BackIcon" />
            </Button>
            <Button onClick={() => this.goToNext()} className="next-icon-class">
              <img src={NextIcon} alt="NextIcon" />
            </Button>
            <Row style={{marginTop: 30}}>
              {weekdata.map((item, idx) => {
                if (item.date === "Sat" || item.date === "Sun") {
                  if (item.day === new Date().getDate() && item.month === new Date().getMonth()+1 && item.year === new Date().getFullYear()) {
                    return <Col className="week-style-header-disable" key={idx}>
                      <p>{item.date}</p>
                      <button type="button" className="btn btn-primary today" onClick={() => this.changeDate(item.day)}>{item.day}</button>
                    </Col>;
                  } else {
                    return <Col className="week-style-header-disable" key={idx}>
                      <p>{item.date}</p>
                      <button type="button" className="btn btn-primary not-today" onClick={() => this.changeDate(item.day)}>{item.day}</button>
                    </Col>;
                  }
                } else {
                  if (item.day === new Date().getDate() && item.month === new Date().getMonth()+1 && item.year === new Date().getFullYear()) {
                    return <Col className="week-style-header-available" key={idx}>
                      <p>{item.date}</p>
                      <button type="button" className="btn btn-primary today" onClick={() => this.changeDate(item.day)}>{item.day}</button>
                    </Col>;
                  } else {
                    return <Col className="week-style-header-available" key={idx}>
                      <p>{item.date}</p>
                      <button type="button" className="btn btn-primary not-today" onClick={() => this.changeDate(item.day)}>{item.day}</button>
                    </Col>;
                  }
                }
              })}
            </Row>
            <Row style={{marginTop: 70}}>
              {schedule.map((item, idx) => 
                <Col key={idx} style={{paddingLeft: 0, paddingRight: 0}}>
                  <table>
                    {item.map((item1, idx1) => 
                      <tr>
                        <button key={idx1} type="button" className={item1.book ? "btn btn-primary schedule active" : "btn btn-primary schedule"} onClick={() => this.bookSchedule(idx, idx1, item1.value)}>{item1.value}</button>
                      </tr>
                    )}
                  </table>
                </Col>
              )}
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="content-center block-content-class button-text-group-class">
              <Button onClick={() => this.actionBookSession()}>Book a session</Button>
            </div>
          </ModalFooter>
        </Modal>
        {loading && <LoadingModal open={true} />}
      </div>
    );
  }
}