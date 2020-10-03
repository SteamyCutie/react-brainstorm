import React from "react";
import { Container, Row, Col, Button } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';
import SearchMentorDetailCard from "../components/common/SearchMentorDetailCard"
import SignIn from "../components/landingpage/SignIn"
import SignUp from "../components/landingpage/SignUp"

import background from "../images/background.jpg"
import mentorlevel from "../images/mentor-level.svg"
import hourlyrate from "../images/hourly-rate.svg"

export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
      this.signInElement = React.createRef();
      this.signUpElement = React.createRef();
      this.state = {
        signInOpen: false,
        signUpOpen: false,
        search_hourly: false,
        search_level: false
      }
    }

    componentWillMount() {
    }

    onChangePagination(e, v) {
      const {pagination} = this.props;
      pagination(v);
    }

    toggle_signin() {
      this.setState({
        signInOpen: !this.state.signInOpen
      });
      if(!this.state.signInOpen) {
        this.signInElement.current.clearValidationErrors();
      }
    }

    toggle_signup() {
      this.setState({
        signInOpen: !this.state.signInOpen
      });
      if(!this.state.signInOpen) {
        this.signInElement.current.clearValidationErrors();
      }
    }

    toggle_modal() {
      this.setState({
        signInOpen: !this.state.signInOpen,
        signUpOpen: !this.state.signUpOpen
      });
      if(!this.state.signInOpen) {
        this.signInElement.current.clearValidationErrors();
      }

      if(!this.state.signUpOpen) {
        this.signUpElement.current.clearValidationErrors();
      }
    }

    searchByHourlyRate() {
      this.setState(prevState => {
        return { search_hourly: !prevState.search_hourly };
      });
      const { searchFilter } = this.props;
      searchFilter(this.state.search_level, !this.state.search_hourly);
    }

    searchByMentorLevel() {
      this.setState(prevState => {
        return { search_level: !prevState.search_level };
      });
      const { searchFilter } = this.props;
      searchFilter(!this.state.search_level, this.state.search_hourly);
    }

    removeSession() {
      localStorage.clear();
    }

    render() {
      const { item, count } = this.props;
      const { search_hourly, search_level, signInOpen, signUpOpen } = this.state;
      return (
        <>
          <SignIn ref={this.signInElement} open={signInOpen} toggle={() => this.toggle_signin()} toggle_modal={() => this.toggle_modal()}/>
          <SignUp ref={this.signUpElement} open={signUpOpen} toggle={() => this.toggle_signup()} toggle_modal={() => this.toggle_modal()}/>
          <img src={background} className="search-background" alt="background"></img>
          <span className="search-background-title">Share your knowledge</span>
          <span className="search-background-sub-title">Language learning and Private Lessons online</span>
          <Container fluid className="px-4 pb-4 page-basic-margin">
            <h3 className="search-title">Brainshare Mentors</h3>
            { search_level ? <Button style={{marginBottom: 10}} className="search-level" onClick={() => this.searchByMentorLevel()}>
              <img src={mentorlevel} alt="MentorLevel" />
              Mentor level
            </Button> : <Button style={{marginBottom: 10}} className="search-btn" onClick={() => this.searchByMentorLevel()}>
              <img src={mentorlevel} alt="MentorLevel" />
              Mentor level
            </Button> }
            { search_hourly ? <Button style={{marginBottom: 10}} className="search-hourly" onClick={() => this.searchByHourlyRate()}>
              <img src={hourlyrate} alt="HourlyRate" />
              Hourly rate
            </Button> : <Button style={{marginBottom: 10}} className="search-btn" onClick={() => this.searchByHourlyRate()}>
              <img src={hourlyrate} alt="HourlyRate" />
              Hourly rate
            </Button> }
          </Container>
          <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
            <Row className="no-padding">
              <Col lg="12" md="12" sm="12">
                {item.map((data, idx) =>(
                  <SearchMentorDetailCard key={idx} ref={this.mentorRef} mentorData={data} toggle_signin={() => this.toggle_signin()}/>
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