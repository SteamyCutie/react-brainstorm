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
import { getnotification, switchuser, signout } from '../api/api';
import { PUSHER_KEY } from '../common/config';
    
export default class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);

    this.outcomingRef = React.createRef();
    let filterType = false;
    if (JSON.parse(localStorage.getItem('user-type')) !== null || JSON.parse(localStorage.getItem('user-type')) !== undefined) {
      filterType = JSON.parse(localStorage.getItem('user-type'));
    } else {
      if (props.location.pathname === "/mentorWallet" || props.location.pathname === "/mentorDashboard") {
        filterType = true;
      } else if (props.location.pathname === "/studentWallet" || props.location.pathname === "/studentDashboard") {
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
      notifications: [],
      searchKey: {}
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
    this.getNotificationsByPusher();
    this.getNotifications();
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  getNotificationsByPusher() {
    var pusher = new Pusher(PUSHER_KEY, {
      cluster: 'mt1'
    });
    var self = this;
    var channel = pusher.subscribe('session-channel');
    channel.bind('brainsshare-session-event', function(data) {
      for (var j = 0; j < data.message.length; j ++) {
        self.showAlert(data.message[j].session_title + " session will start from " + data.message[j].from);
      }
      var {notifications} = self.state;
      notifications = [];
      for (var i = 0; i < data.message.length; i ++) {
        if (localStorage.getItem('user_id') === data.message[i].user_id){
          var temp = notifications;
          temp.push(data.message[i]);
        }
      }
      self.setState({notifications: temp});
      temp = [];
    });
  }

  getNotifications = async() => {
    let param = {
      user_id: localStorage.getItem('user_id')
    }
    try {
      const result = await getnotification(param);
      if (result.data.result === "success") {
        this.setState({notifications: result.data.data});
      } else if (result.data.result === "warning") {
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
    } catch(err) {
    };
  }

  onChange() {
    let filterType = false;
    if (JSON.parse(localStorage.getItem('user-type')) != null || JSON.parse(localStorage.getItem('user-type')) !== undefined) {
      filterType = JSON.parse(localStorage.getItem('user-type'));
    } else {
      if (this.props.location.pathname === "/mentorWallet" || this.props.location.pathname === "/mentorDashboard") {
        filterType = true;
      } else if (this.props.location.pathname === "/studentWallet" || this.props.location.pathname === "/studentDashboard") {
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
          this.signout();
        } else if (result.data.message === "Token is Invaild") {
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

  handleSearch(searchKey) {
    const { history } = this.props;
    if (JSON.parse(localStorage.getItem('user-type')))
      history.push("/mentorDashboard");
    else 
      history.push("/studentDashboard");
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

  showAlert(text) {
    store.addNotification({
      title: "Alert",
      message: text,
      type: "default",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 5500,
        onScreen: false,
        waitForAnimation: true,
        showIcon: true,
        pauseOnHover: false
      }
    });
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

  render() {
    const { children } = this.props;
    const { noFooter, noNavbar, filterType, notifications, loading } = this.state;
    if (children.props.location.pathname === "/mentorDashboard" || children.props.location.pathname === "/studentDashboard") {
      children.props.location.search = "search";
    }
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <Container fluid>
          <Row>
            <MainSidebar filterType={filterType}/>
            <Col className="main-content p-0 main-content-class" tag="main">
              {!noNavbar && <MainNavbar filterType={filterType} toggleType={() => this.handleClick()} notifications={notifications} toggle_search={(searchkey) => this.handleSearch(searchkey)}/>}
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
