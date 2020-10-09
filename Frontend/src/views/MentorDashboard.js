import React from "react";
import { Container, Row, Col, Card, CardBody } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';

import MentorVideo from "./../components/common/MentorVideo";
import BookSession from "./../components/common/BookSession";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import { findmentorsbytags, signout } from '../api/api';

import avatar from "../images/avatar.jpg"
import SubscriperImg from "../images/Users.svg"
import LinkImg from "../images/Link.svg"

export default class MentorDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.mentorRef = React.createRef();

    this.state = {
      id: 0,
      ModalOpen: false, 
      totalCnt: 0,
      loading: false,
      mentors: [],
    };

    this.sendUser = this.sendUser.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let categories = JSON.parse(localStorage.getItem('search-category'));
    let searchParams = [];
    if (categories === null) {
      searchParams = [];
    } else {
      for (var i = 0; i < categories.length; i ++) {
        searchParams.push(categories[i].value);
      }
    }
    this.getMentors(searchParams, 1);
  }

  componentWillMount() {
    let categories = JSON.parse(localStorage.getItem('search-category'));
    let searchParams = [];
    if (categories === null) {
      searchParams = [];
    } else {
      for (var i = 0; i < categories.length; i ++) {
        searchParams.push(categories[i].value);
      }
    }
    this.getMentors(searchParams, 1);
  }

  sendUser(to, avatar, name) {
    this.props.setUser(to, avatar, name);
  }

  getMentors = async(category, pageNo) => {
    let param = {
      user_id: localStorage.getItem('user_id'),
      tags_id: category,
      page: pageNo,
      rowsPerPage: 10
    }

    try {
      this.setState({loading: true});
      const result = await findmentorsbytags(param);
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
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
          this.signout();
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
    let categories = JSON.parse(localStorage.getItem('search-category'));
    let searchParams = [];
    if (categories === null) {
      searchParams = [];
    } else {
      for (var i = 0; i < categories.length; i ++) {
        searchParams.push(categories[i].value);
      }
    }
    this.getMentors(searchParams, value);
  }

  signout = async() => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        this.removeSession();
      } else if (result.data.result === "warning") {
        this.removeSession();
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
        } else if (result.data.message === "Token is Invalid") {
          this.removeSession();
        } else if (result.data.message === "Authorization Token not found") {
          this.removeSession();
        } else {
          this.removeSession();
        }
      }
    } catch(error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
    window.location.href = "/";
  }

  toggle(id) {
    this.setState({
      ModalOpen: !this.state.ModalOpen,
      id: id
    });
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
    const {loading, mentors, totalCnt, ModalOpen, id} = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <BookSession open={ModalOpen} toggle={() => this.toggle()} id={id}></BookSession>
          <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
            <Row noGutters className="page-header py-4">
              <Col className="page-title">
                <h3>My share page</h3>
              </Col>
            </Row>
            
            {mentors && mentors.map((mentor, idx) => 
            <Card small className="share-page-card" style={{marginBottom: 30}}>
              <CardBody>
                <Row>
                  <Col xl="3" className="subscription-mentor-detail">
                    <div>
                      {mentor.avatar && <img className="avatar" src={mentor.avatar} alt="avatar"/>}
                      {!mentor.avatar && <img className="avatar" src={avatar} alt="avatar"/>}
                      <div style={{display: "flex", padding: "20px 0px"}}>
                        <img src={SubscriperImg} style={{width: "22px", marginRight: "10px"}} alt="icon"/>
                        <h6 className="no-margin" style={{paddingRight: "70px"}}>Subscribers</h6>
                        <h6 className="no-margin"style={{fontWeight: "bold"}}>{mentor.sub_count}</h6>
                      </div>
                    </div>
                  </Col>
                  <Col xl="9" lg="12" className="subscription-mentor-videos">
                    <h6 className="profile-link-url">
                      <a href="javascript:void(0)" onClick={() => this.copyLink()} title="Copy Link"><img src={LinkImg} alt="link" className="profile-link-image" /></a>
                      <a href="javascript:void(0)" style={{color: '#018ac0'}}>www.brainsshare.com/kiannapress</a>
                    </h6>
                    {mentor.share_info && mentor.share_info.map((item, idx) => 
                      <MentorVideo key={idx} item={item} />
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>   
            )} 
            {mentors.length > 0 && <Row className="pagination-center">
              <Pagination count={totalCnt} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
            </Row>}
          </Container>
      </>
    )
  };
};