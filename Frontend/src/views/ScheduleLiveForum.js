import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import { Link } from "react-router-dom";
import SmallCardForum from "../components/common/SmallCardForum"
import { getforums } from '../api/api';

import MentorVideo from "../components/common/MentorVideo";

import MentorAvatar from "../images/Rectangle_Kianna_big.png"
import SubscriperImg from "../images/Users.svg"

export default class ScheduleLiveForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forumInfos: []
    };
  }

  componentWillMount() {
    this.getForums();  
  }

  getForums = async() => {
    try {
      const result = await getforums({email: localStorage.getItem('email')});
      if (result.data.result == "success") {
        this.setState({forumInfos: result.data.data});
      } else {
        alert(result.data.message);
      }
    } catch(err) {
      alert(err);
    };
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
        <Card small className="schedule-forum-card">
          <CardHeader className="live-forum-header">
            <h5 className="live-forum-header-title no-margin">Schedule live forum</h5>
            <Button className="live-forum-header-button">Create live forum</Button>
          </CardHeader>
          <CardBody>
            <Row>
              {this.state.forumInfos.map((item, idx) => 
                <Col xl="4" lg="4" sm="6">
                  <SmallCardForum key={idx} item={item} />
                </Col>
              )}
            </Row>
          </CardBody>
        </Card>    
      </Container>
    )
  }
};