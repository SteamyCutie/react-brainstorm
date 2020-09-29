import React from "react";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import SubMainNavbar from "../components/layout/MainNavbar/SubMainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
import Pusher from 'pusher-js';
import { Store } from "../flux";
import { Dispatcher, Constants } from "../flux";
import { schedulepost, switchuser } from '../api/api';
    
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
      noNavbar: false,
      filterType: filterType,
      mentorUrl: Store.getMentorHistory(),
      studentUrl: Store.getStudentHistory(),
      noFooter: true,
      notifications: {
        from: '',
        to: '',
        title: '',
        user_id: 0
      }
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
    var pusher = new Pusher('e89985ed54dad44cf61e', {
      cluster: 'mt1'
    });
    var self = this;
    var channel = pusher.subscribe('session-channel');
    channel.bind('brainsshare-session-event', function(data) {
      if (localStorage.getItem('user_id') == data.message.user_id){
        self.setState({notifications: data.message});
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
    let param = {
      user_id: localStorage.getItem('user_id')
    }
    try {
      const result = await switchuser(param);
      if (result.data.result === "success") {
      } else if (result.data.result === "warning") {
      } 
    } catch(err) {
    };
  }

  render() {
    const { children } = this.props;
    const { noFooter, noNavbar, filterType, notifications } = this.state;

    return (
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
    );
  }
}
