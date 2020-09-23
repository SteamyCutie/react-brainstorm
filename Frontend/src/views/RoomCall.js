import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormInput, CardFooter, Button, FormTextarea, ListGroup, ListGroupItem, FormGroup } from "shards-react";
import { verifyCode } from '../api/api';

import {Video} from '../video/video.mp4'

export default class RoomCall extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      errorMsg: '',
      code: '',
    }
  }

  componentWillMount() {
    
  }

  render() {
    return (
      <div className="room-container">
      {/* </div> <Container fluid className="main-content-container px-4 pb-4 main-content-container-class"> */}
        <Col xl="9">
          <div className="room-video-container">
            <video id="video-from" autoPlay width="100%" className="video-call-student" controls>
              Your browser does not support the video tag.
              <source src={Video} type="video/mp4" />
            </video>
            <video id="video-me" autoPlay width="200px" height="150px" className="video-call-mentor" controls>
              Your browser does not support the video tag.
              <source src={Video} type="video/mp4" />
            </video>
          </div>
          <div id="room-chat-area" className="room-chat-area">
            <FormGroup>
              <FormTextarea placeholder="Please input" className="chat-history"/>
              <FormInput placeholder="Input.." className="chat-input"/>
            </FormGroup>
          </div>
        </Col>
        <Col xl="3" className="room-member">
          <div id="room-member" width="20%">
          <ListGroup>
            <ListGroupItem>Student 1</ListGroupItem>
            <ListGroupItem>Student 2</ListGroupItem>
            <ListGroupItem>Student 3</ListGroupItem>
            <ListGroupItem>Student 4</ListGroupItem>
            <ListGroupItem>Student 5</ListGroupItem>
            <ListGroupItem>Student 6</ListGroupItem>
            <ListGroupItem>Student 7</ListGroupItem>
            <ListGroupItem>Student 8</ListGroupItem>
            <ListGroupItem>Student 9</ListGroupItem>
          </ListGroup>
          </div>
        </Col>
      {/* </Container> */}
      </div>
    )
  }
}
