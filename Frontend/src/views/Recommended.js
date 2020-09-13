import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MentorDetailCard from "./../components/common/MentorDetailCard"
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import { getallmentors } from '../api/api';

// const Recommended = ({ smallCards, tHistory, columns, mentorData }) => (
export default class Recommended extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      mentors: [],
    };
  }

  componentWillMount() {
   this.getMentors();
  }

  getMentors = async() => {
    try {
      this.setState({loading: true});
      const result = await getallmentors({email: localStorage.getItem('email')});
      if (result.data.result == "success") {
        this.setState({
          loading: false,
          mentors: result.data.data
        });
        console.log(this.state.mentors);
      } else {
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Edit Profile Fail");
    };
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

  showFail() {
    store.addNotification({
      title: "Fail",
      message: "Action Fail!",
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

  render() {
    return (
      <>
        {this.state.loading && <LoadingModal open={true} />}
        <Container fluid className="main-content-container px-4 main-content-container-class">
          <Row noGutters className="page-header py-4">
            <Col xs="12" sm="12" className="page-title">
              <h3>Recommended mentors for you</h3>
            </Col>
          </Row>

          <Row className="no-padding">
            <Col lg="12" md="12" sm="12">
              {this.state.mentors.map((data, idx) =>(
                <MentorDetailCard mentorData={data} key={idx}/>
              ))}
            </Col>
          </Row>
        </Container>
      </>
    )
  }
};