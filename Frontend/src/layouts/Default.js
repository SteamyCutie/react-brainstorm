import React from "react";
import { Container, Row, Col } from "shards-react";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import SubMainNavbar from "../components/layout/MainNavbar/SubMainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
import Pusher from 'pusher-js';
import { Store } from "../flux";
import { Dispatcher, Constants } from "../flux";
import { schedulepost, switchuser } from '../api/api';
import { PUSHER_KEY } from '../common/config';
    
export default class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);

    this.outcomingRef = React.createRef();
    let filterType = false;
    if (JSON.parse(localStorage.getItem('user-type')) != null || JSON.parse(localStorage.getItem('user-type')) != undefined) {
      filterType = JSON.parse(localStorage.getItem('user-type'));
    } else {
      if (props.location.pathname === "/mentorWallet" || props.location.pathname === "/mentorSession") {
        filterType = true;
      } else if (props.location.pathname === "/studentWallet" || props.location.pathname === "/studentSession") {
        filterType = false;
      }
    }

    this.state = {
      loading: false,
      noNavbar: false,
      filterType: filterType,
      mentorUrl: Store.getMentorHistory(),
      studentUrl: Store.getStudentHistory(),
      noFooter: true,
      // notifications: {
      //   from: '',
      //   to: '',
      //   title: '',
      //   user_id: 0
      // }
      notifications: []
    }

    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    if(!localStorage.getItem('token')) {
      window.location.href = '/';
      return;
    }

    Store.addChangeListener(this.onChange);
    this.getNotifications();
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  getNotifications() {
    console.log("-----");
    var pusher = new Pusher(PUSHER_KEY, {
      cluster: 'mt1'
    });
    var self = this;
    var channel = pusher.subscribe('session-channel');
    channel.bind('brainsshare-session-event', function(data) {
      console.log(data, "*****");
      for (var i = 0; i < data.message.length; i ++) {
        if (localStorage.getItem('user_id') == data.message[i].user_id){
          var {notifications} = self.state;
          // notifications = [];
          var temp = notifications;
          temp.push(data.message[i]);
          console.log(temp, "++++");
          self.setState({notifications: temp});
        }
      }
    });
  }

  onChange() {
    let filterType = false;
    if (JSON.parse(localStorage.getItem('user-type')) != null || JSON.parse(localStorage.getItem('user-type')) != undefined) {
      filterType = JSON.parse(localStorage.getItem('user-type'));
    } else {
      if (this.props.location.pathname === "/mentorWallet" || this.props.location.pathname === "/mentorSession") {
        filterType = true;
      } else if (this.props.location.pathname === "/studentWallet" || this.props.location.pathname === "/studentSession") {
        filterType = false;
      }
    }

    this.setState({
      ...this.state,
      filterType: filterType,
      mentorUrl: Store.getMentorHistory(),
      studentUrl: Store.getStudentHistory(),
    });
  }

  handleClick() {
    this.switchUser();
    // Dispatcher.dispatch({
    //   actionType: Constants.TOGGLE_USER_TYPE,
    // });

    localStorage.setItem('user-type', !JSON.parse(localStorage.getItem('user-type')));

    const { filterType, mentorUrl, studentUrl } = this.state;
    if ( !filterType ) 
      this.props.history.push(mentorUrl);
    else 
      this.props.history.push(studentUrl);
  }

  switchUser = async() => {
    const { loading } = this.state;
    let param = {
      user_id: localStorage.getItem('user_id')
    }
    try {
      this.setState({loading: true});
      const result = await switchuser(param);
      if (result.data.result === "success") {
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else { 
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
          this.removeSession();
          window.location.href = "/";
        } else if (result.data.message === "Token is Invaild") {
          this.showFail(result.data.message);
          this.removeSession();
          window.location.href = "/";
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
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
        onScreeen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  removeSession() {
    localStorage.clear();
  }

  render() {
    const { children } = this.props;
    const { noFooter, noNavbar, filterType, notifications, loading } = this.state;

    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <Container fluid>
          <Row>
            <MainSidebar filterType={filterType}/>
            <Col
              className="main-content p-0 main-content-class"
              tag="main"
            >
              {!noNavbar && <MainNavbar filterType={filterType} toggleType={() => this.handleClick()} notifications={notifications}/>}
              {filterType && <SubMainNavbar/>}
              {children}
              {!noFooter && <MainFooter />}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
