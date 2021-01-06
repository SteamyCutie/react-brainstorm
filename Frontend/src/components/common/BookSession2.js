import React from "react";
import { Modal, ModalBody, Button, ModalHeader, ModalFooter, FormTextarea, Row, Col } from "shards-react";
import Close from '../../images/Close.svg';
import AddButtonImage from "../../images/Add.svg";
import DeleteButtonImage from "../../images/Delete.svg";
import Timelinelist from '../../common/TimelistList';
import Clock from "../../images/Clock.svg";
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

moment.locale('en');

export default class BookSession2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: "", 
      displayDate: "",
      showBookingComponents: false,
      bookDateTime: "",
      timeList: []
    };
  }

  toggle() {
    const { toggle } = this.props;

    this.setState({
      currentDate: "",
      timeList: []
    })

    toggle();
  }

  onChange(value, event) {
    this.setState({
      currentDate: moment(value).format('YYYY-MM-DD').toString(),
      displayDate: moment(value).format('dddd, MMMM DD').toString(),
      timeList: []
    })
  }

  handleAdd() {
    const {timeList} = this.state;
    let temp = timeList;
    temp.push({
      from: "00 : 00 am",
      to: "00 : 00 am"
    })

    this.setState({
      timeList: temp
    })
  }

  handleDelete(idx) {
    const {timeList} = this.state;
    let temp = timeList;
    temp.splice(idx, 1,);

    this.setState({
      timeList: temp
    });
  }

  handleUpdateFrom(idx, eve) {
    const {timeList} = this.state;
    let temp = timeList;
    temp[idx].from = eve.target.value;

    this.setState({
      timeList: temp
    });
  }

  handleUpdateTo(idx, eve) {
    const {timeList} = this.state;
    let temp = timeList;
    temp[idx].to = eve.target.value;

    this.setState({
      timeList: temp
    });
  }

  handleApply() {
    // addSpecificDate(this.state.currentDate, this.state.timeList);
    this.toggle();
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
      bookDateTime: currentDate + " " + moment(time.start_time).format("LT").toString(), 
    })
  }

  handleBookSession() {

  }

  render() {
    const { open } = this.props;
    const { currentDate, displayDate, showBookingComponents, bookDateTime } = this.state;
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
              />
              <div className="specific-date-times">
                {currentDate && 
                  <div style={{width: "100%", marginBottom: "20px"}}>
                    <label style={{marginRight: "auto", width: "calc(100% - 50px)", fontSize: "17px", fontWeight: "bold"}}>{displayDate}</label>
                  </div>
                }
                {currentDate && 
                  <div className="book-date-time-list">
                    {availableTimes.map((time) => {
                      return (
                        <Button className="btn-mentor-detail-time-book" onClick={() => this.handleTimeClick(time)}>
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
                <FormTextarea className="booking-components-comment" />
                <Col>
                  <label>{bookDateTime}</label>
                  <Button className="btn-mentor-detail-time-book" onClick={() => this.handleBookSession()}>
                    Schedule Event
                  </Button>
                </Col>
              </Row>
            }
          </ModalBody>
        </Modal>
      </div>
    );
  }
}