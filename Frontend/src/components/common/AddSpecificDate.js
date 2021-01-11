import React from "react";
import { Modal, ModalBody, Button, ModalHeader, ModalFooter, FormSelect } from "shards-react";
import Close from '../../images/Close.svg';
import AddButtonImage from "../../images/Add.svg";
import DeleteButtonImage from "../../images/Delete.svg";
import Timelinelist from '../../common/TimelistList';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

moment.locale('en');

export default class AddSpecificDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: "", 
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
    const { addSpecificDate } = this.props;
    addSpecificDate(this.state.currentDate, this.state.timeList);

    this.toggle();
  }

  render() {
    const { open } = this.props;
    const { currentDate, timeList } = this.state;
    return (
      <div>
        <Modal size="lg" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <ModalHeader>
            <label style={{fontSize: "25px",paddingTop: "15px",fontWeight: "bold",color: "#0f0f0f"}}>Select the date(s) you want to assign specific hours</label>
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
                <label style={{fontSize: "15px"}}>What hours are you available?</label>
                {currentDate && 
                  <div style={{width: "100%", marginBottom: "20px"}}>
                    <label style={{marginRight: "auto", width: "calc(100% - 50px)", fontSize: "17px", fontWeight: "bold"}}>{currentDate}</label>
                    <Button className="btn-available-time-add-delete no-padding" onClick={() => this.handleAdd()}>
                      <img src={AddButtonImage} alt="Add" />
                    </Button>
                  </div>
                }
                {currentDate && 
                  <div className="specific-date-time-list">
                    {timeList.map((time, idx) => {
                      return (
                        <>
                          <FormSelect className="specific-available-time-input" onChange={(e) => this.handleUpdateFrom(idx, e)}>
                            {Timelinelist.map((item) => {
                              return (
                                time.from === item.str
                                  ? <option vaule={item.str} selected>{item.str}</option>
                                  : <option value={item.str}>{item.str}</option>
                              );
                            })}
                          </FormSelect>
                          <FormSelect className="specific-available-time-input" onChange={(e) => this.handleUpdateTo(idx, e)}>
                            {Timelinelist.map((item, idx) => {
                              return (
                                time.to === item.str
                                  ? <option value={item.str} selected>{item.str}</option>
                                  : <option value={item.str}>{item.str}</option>
                              );
                            })}
                          </FormSelect>
                          <Button className="btn-specific-available-time-delete no-padding"
                            onClick={() => this.handleDelete(idx)}>
                            <img src={DeleteButtonImage} alt="Delete" />
                          </Button>
                        </>
                      )
                    })}
                  </div>
                }
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="content-center block-content-class button-text-group-class">
              <Button onClick={() => this.handleApply()}>Apply</Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}