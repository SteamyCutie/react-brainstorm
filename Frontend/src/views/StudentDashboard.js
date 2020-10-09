import React from "react";
import AdSense from 'react-adsense';
import { Container, Row, Col } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';

import MentorDetailCardStudentDashboard from "./../components/common/MentorDetailCardStudentDashboard";
import BookSession from "./../components/common/BookSession";
import OutcomingCallDesc from "./../components/common/OutcomingCallDesc";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import { findmentorsbytags, signout } from '../api/api';
export default class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.mentorRef = React.createRef();

    this.state = {
      id: 0,
      ModalOpen: false, 
      ModalCallWithDescOpen: false,
      totalCnt: 0,
      loading: false,
      mentors: [],
      callDescription: '', 
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

  toggle_callwithdesc(id) {
    this.setState({
      ModalCallWithDescOpen: !this.state.ModalCallWithDescOpen,
      id: id
    });
  }

  setDescription(description) {
    this.setState({
      callDescription: description, 
    }, () => this.handleCall());
  }

  handleCall(){
    var callerInfo = {};
    var index;

    for (index = 0; index < this.state.mentors.length; index ++) {
      if(this.state.mentors[index].id == this.state.id) {
        callerInfo = this.state.mentors[index];
      }
    }

    console.log(callerInfo, this.state.callDescription);
    this.toggle_callwithdesc();
    
    this.props.setUser(callerInfo.email, callerInfo.avatar, callerInfo.name, callerInfo.channel_name, this.state.callDescription);
  }

  handleCancel(){
    this.toggle_callwithdesc();

    this.setState({
      callDescription: '', 
    });
  }

  handleCallEnd() {
    this.toggle_callwithdesc();

    this.setState({
      callDescription: '', 
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
    const {loading, mentors, totalCnt, ModalOpen, ModalCallWithDescOpen, id} = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <BookSession open={ModalOpen} toggle={() => this.toggle()} id={id}></BookSession>
        <OutcomingCallDesc 
          id={id}
          open={ModalCallWithDescOpen} 
          // onCall={() => this.handleCall()}
          onCancel={() => this.handleCancel()}
          onCallEnd={() => this.handleCallEnd()}
          // callwithdescription={() => this.toggle_callwithdesc()} 
          setDescription={(description) => this.setDescription(description)} 
        />
        <Container fluid className="main-content-container px-4 main-content-container-class">
          <Row noGutters className="page-header py-4">
            <Col xs="12" sm="12" className="page-title">
              <h3>Top Brainsshare mentors</h3>
            </Col>
            <AdSense.Google
              client='ca-pub-7292810486004926'
              slot='7806394673'
              style={{ width: 500, height: 300, float: 'left' }}
              format=''
            />
          </Row>
          <Row className="no-padding">
            <Col lg="12" md="12" sm="12">
              {mentors.map((data, idx) =>(
                <MentorDetailCardStudentDashboard key={idx} ref={this.mentorRef} mentorData={data} sendUser={this.sendUser} toggle={(id) => this.toggle(id)} callwithdescription={(id) => this.toggle_callwithdesc(id)}/>
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