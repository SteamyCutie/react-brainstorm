import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Row, FormCheckbox, Col, FormSelect } from "shards-react";

import DeleteButtonImage from "../../images/Delete.svg"
import AddButtonImage from "../../images/Add.svg"

const timeList =[
  "00: 00 am",
  "00: 30 am",
  "01: 00 am",
  "01: 30 am",
  "02: 00 am",
  "02: 30 am",
  "03: 00 am",
  "03: 30 am",
  "04: 00 am",
  "04: 30 am",
  "05: 00 am",
  "05: 30 am",
  "06: 00 am",
  "06: 30 am",
  "07: 00 am",
  "07: 30 am",
  "08: 00 am",
  "08: 30 am",
  "09: 00 am",
  "09: 30 am",
  "10: 00 am",
  "10: 30 am",
  "11: 00 am",
  "11: 30 am",
  "12: 00 pm",
  "12: 30 pm",
  "01: 00 pm",
  "01: 30 pm",
  "02: 00 pm",
  "02: 30 pm",
  "03: 00 pm",
  "03: 30 pm",
  "04: 00 pm",
  "04: 30 pm",
  "05: 00 pm",
  "05: 30 pm",
  "06: 00 pm",
  "06: 30 pm",
  "07: 00 pm",
  "07: 30 pm",
  "08: 00 pm",
  "08: 30 pm",
  "09: 00 pm",
  "09: 30 pm",
  "10: 00 pm",
  "10: 30 pm",
  "11: 00 pm",
  "11: 30 pm"
];

class AvailableTimes extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      availableTimeList: [
          {
            fromId: 2,
            toId: 8
          },
          {
            fromId: 3,
            toId: 6
          },
          {
            fromId: 9,
            toId: 12
          },
          {
            fromId: 15,
            toId: 16
          },
          {
            fromId: 22,
            toId: 23
          },
        ]
     }

     this.handleAdd = this.handleAdd.bind(this);
     this.handleDelete = this.handleDelete.bind(this);
    }

  componentWillMount() {
  }

  handleAdd() {
    const {availableTimeList} = this.state;
    let timeList = availableTimeList;
    timeList.push([0, 0]);

    this.setState({
      availableTimeList: timeList,
    });
  }

  handleDelete(idx) {
    const {availableTimeList} = this.state;
    let timeList = availableTimeList;
    timeList.splice(idx, 1);


    this.setState({
      availableTimeList: timeList,
    });
  }

  render() {
    return (
      <Form>
        <Row style={{paddingLeft: "15px"}}>
          <FormCheckbox toggle small>
          {this.props.day}
          </FormCheckbox>
        </Row>
        {this.state.availableTimeList.map((time, idx) => {
          return (
            <Row form>
              <Col md="5" className="available-time-group" style={{marginRight: "40px"}}>
                <FormSelect id="feInputState" className="available-time-input">
                  {timeList.map((item, idx) => {
                    return (
                      time.fromId == idx 
                      ? <option selected>{item}</option>
                      : <option >{item}</option>
                    );
                  })}
                </FormSelect>
              </Col>
              <Col md="5" className="available-time-group">
                <FormSelect id="feInputState" className="available-time-input">
                  {timeList.map((item, idx) => {
                    return (
                      time.toId == idx 
                      ? <option selected>{item}</option>
                      : <option >{item}</option>
                    );
                  })}
                </FormSelect>
              </Col>
              <Col style={{marginTop: "10px", marginBottom: "10px"}}>
              {this.state.availableTimeList.length !== 1 && 
                <Button className="btn-available-time-add-delete no-padding"
                  onClick={() => this.handleDelete(idx)}>
                  <img src={DeleteButtonImage} alt="Delete" />
                </Button>}
              {this.state.availableTimeList.length - 1 === idx && 
                <Button className="btn-available-time-add-delete no-padding"
                  onClick={() => this.handleAdd()}>
                  <img src={AddButtonImage} alt="Add" />
                </Button>}
              </Col>
            </Row>
          )
        })}
      </Form>
    );
  }
}

export default AvailableTimes;
