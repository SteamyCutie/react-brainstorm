import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import SmallCard2 from "./../components/common/SmallCard2";
import MentorDetailCard from "./../components/common/MentorDetailCard"
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import { getallmentors } from '../api/api';
export default class Trending extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      mentors: [],
      smallCards: [
        {
          title: "Act science",
          content: "Mentors",
          image: require ("../images/act-science.svg")
        },
        {
          title: "English",
          content: "Mentors",
          image: require("../images/english.svg")
        },
        {
          title: "Cooking",
          content: "Mentors",
          image: require("../images/cooking.svg")
        }
      ],
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
              <h3>Trending</h3>
            </Col>
          </Row>

          <Row>
            <div className="card-container">
            {this.state.smallCards.map((card, idx) => (
                <SmallCard2
                  id={idx}
                  title={card.title}
                  content={card.content}
                  image={card.image}
                />
            ))}
            </div>
          </Row>

          <Row noGutters className="page-header py-4">
            <Col xs="12" sm="12" className="page-title">
              <h3>Top Brainsshare mentors</h3>
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
  };
};

Trending.propTypes = {
  smallCards: PropTypes.array,
  tHistory: PropTypes.array,
  columns: PropTypes.array,
  mentorData: PropTypes.array,
};
