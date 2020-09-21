import React from "react";
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

    this.mentorRef = React.createRef();

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

    this.sendUser = this.sendUser.bind(this);
  }

  componentWillMount() {
   this.getMentors();
  }

  sendUser(to, avatar) {
    this.props.setUser(to, avatar);
  }

  getMentors = async() => {
    try {
      this.setState({loading: true});
      const result = await getallmentors({email: localStorage.getItem('email')});
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          mentors: result.data.data
        });
      } else {
        this.showFail(result.data.message);
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
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

  render() {
    const {loading, smallCards, mentors} = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <Container fluid className="main-content-container px-4 main-content-container-class">
          <Row noGutters className="page-header py-4">
            <Col xs="12" sm="12" className="page-title">
              <h3>Trending</h3>
            </Col>
          </Row>
          <Row>
            <div className="card-container">
            {smallCards.map((card, idx) => (
                <SmallCard2
                  key={idx}
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
              {mentors.map((data, idx) =>(
                <MentorDetailCard key={idx} ref={this.mentorRef} mentorData={data} sendUser={this.sendUser} />
              ))}
            </Col>
          </Row>
        </Container>
      </>
    )
  };
};