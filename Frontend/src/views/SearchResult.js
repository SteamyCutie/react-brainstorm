import React from "react";
import { Container, Row, Col, Button } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';
import SearchMentorDetailCard from "../components/common/SearchMentorDetailCard"

import background from "../images/background.jpg"
import mentorlevel from "../images/mentor-level.svg"
import hourlyrate from "../images/hourly-rate.svg"

export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);

      this.state = {}
    }

    componentWillMount() {
    }

    onChangePagination(e, v) {
      const {pagination} = this.props;
      pagination(v);
    }

    toggle_login(text) {
      // const { showInfomation } = this.props;
      // showInfomation(text);
    }

    removeSession() {
      localStorage.clear();
    }

    render() {
      const { item, count } = this.props;

      return (
        <>
          <img src={background} className="search-background" alt="background"></img>
          <span className="search-background-title">Share your knowledge</span>
          <span className="search-background-sub-title">Language learning and Private Lessons online</span>
          <Container fluid className="px-4 pb-4 page-basic-margin">
            <h3 className="search-title">Brainshare Mentors</h3>
            <Button style={{marginBottom: 10}} className="search-btn">
              <img src={mentorlevel} alt="MentorLevel" />
              Mentor level
            </Button>
            <Button style={{marginBottom: 10}} className="search-btn">
              <img src={hourlyrate} alt="HourlyRate" />
              Hourly rate
            </Button>
          </Container>
          <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
            <Row className="no-padding">
              <Col lg="12" md="12" sm="12">
                {item.map((data, idx) =>(
                  <SearchMentorDetailCard key={idx} ref={this.mentorRef} mentorData={data} toggle_login={(text) => this.toggle_login(text)}/>
                ))}
              </Col>
            </Row>
            {item.length > 0 && <Row className="pagination-center">
              <Pagination count={count} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
            </Row>}
          </Container>
        </>
      )
    }
  }