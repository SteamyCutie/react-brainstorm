import React from "react";
import { Container, Row, Col, Button } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';
import SearchMentorDetailCard from "../components/common/SearchMentorDetailCard"
import SignIn from "../components/landingpage/SignIn";
import SignUp from "../components/landingpage/SignUp";
import background from "../images/background.jpg";
import { withRouter } from 'react-router-dom';

class SearchResult extends React.Component {
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
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path d="M6.05273 13V5.5" stroke="#04B5FA" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.1055 13V1" stroke="#04B5FA" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 13V10" stroke="#04B5FA" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Mentor level
            </Button> : <Button style={{marginBottom: 10}} className="search-btn" onClick={() => this.searchByMentorLevel()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path d="M6.05273 13V5.5" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.1055 13V1" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 13V10" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Mentor level
            </Button> }
            { search_hourly ? <Button style={{marginBottom: 10}} className="search-hourly" onClick={() => this.searchByHourlyRate()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="19" viewBox="0 0 11 19" fill="none">
                <path d="M5.63672 1V18" stroke="#04B5FA" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.5 4.09091H3.70455C2.98726 4.09091 2.29934 4.37585 1.79214 4.88306C1.28494 5.39026 1 6.07817 1 6.79546C1 7.51275 1.28494 8.20066 1.79214 8.70786C2.29934 9.21506 2.98726 9.5 3.70455 9.5H7.56818C8.28547 9.5 8.97338 9.78495 9.48058 10.2921C9.98779 10.7993 10.2727 11.4873 10.2727 12.2045C10.2727 12.9218 9.98779 13.6098 9.48058 14.117C8.97338 14.6242 8.28547 14.9091 7.56818 14.9091H1" stroke="#04B5FA" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Hourly rate
            </Button> : <Button style={{marginBottom: 10}} className="search-btn" onClick={() => this.searchByHourlyRate()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="19" viewBox="0 0 11 19" fill="none">
                <path d="M5.63672 1V18" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.5 4.09091H3.70455C2.98726 4.09091 2.29934 4.37585 1.79214 4.88306C1.28494 5.39026 1 6.07817 1 6.79546C1 7.51275 1.28494 8.20066 1.79214 8.70786C2.29934 9.21506 2.98726 9.5 3.70455 9.5H7.56818C8.28547 9.5 8.97338 9.78495 9.48058 10.2921C9.98779 10.7993 10.2727 11.4873 10.2727 12.2045C10.2727 12.9218 9.98779 13.6098 9.48058 14.117C8.97338 14.6242 8.28547 14.9091 7.56818 14.9091H1" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
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

  export default withRouter(SearchResult);