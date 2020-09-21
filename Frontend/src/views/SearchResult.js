import React from "react";
import { Container, Row, Col, Button, Card, CardBody } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';
import MentorDetailCard from "../components/common/MentorDetailCard"

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

    removeSession() {
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      localStorage.removeItem('user-type');
      localStorage.removeItem('user_name');
      localStorage.removeItem('ws');
    }

    render() {
      const { item, count } = this.props;

      return (
        <>
          <img src={background} className="search-background"></img>
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
                  <MentorDetailCard key={idx} ref={this.mentorRef} mentorData={data} />
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