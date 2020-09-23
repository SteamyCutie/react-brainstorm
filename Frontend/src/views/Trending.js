import React from "react";
import { Container, Row, Col } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';

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
      totalCnt: 0,
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
   this.getMentors(1);
  }

  sendUser(to, avatar, name) {
    this.props.setUser(to, avatar, name);
  }

  getMentors = async(pageNo) => {
    let param = {
      email: localStorage.getItem('email'),
      page: pageNo,
      rowsPerPage: 10
    }
    try {
      this.setState({loading: true});
      const result = await getallmentors(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          mentors: result.data.data,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
        });
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
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

  onChangePagination(e, value) {
    this.getMentors(value);
  }

  removeSession() {
    localStorage.clear();
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
    const {loading, smallCards, mentors, totalCnt} = this.state;
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
          {mentors.length > 0 && <Row className="pagination-center">
            <Pagination count={totalCnt} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
          </Row>}
        </Container>
      </>
    )
  };
};