import React from "react";
import { Container, Row, Col } from "shards-react";
import LoadingModal from "../components/common/LoadingModal";
import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import SubMainNavbar from "../components/layout/MainNavbar/SubMainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
import Pusher from 'pusher-js';
import { Store } from "../flux";
import { getnotification, switchuser, signout } from '../api/api';
import { PUSHER_KEY } from '../common/config';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import moment from 'moment';
moment.locale('en');

export default class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);

    this.outcomingRef = React.createRef();
    let filterType = false;
    if (JSON.parse(localStorage.getItem('user-type')) !== null || JSON.parse(localStorage.getItem('user-type')) !== undefined) {
      filterType = JSON.parse(localStorage.getItem('user-type'));
    } else {
      if (props.location.pathname === "/mentorWallet" || props.location.pathname === "/mentordashboard") {
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
      all_notifications: [],
      searchKey: {}
    }

    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/');
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
    channel.bind('brainsshare-session-event', function (data) {
      // for (var j = 0; j < data.message.length; j ++) {
      //   ToastsStore.info(data.message[j].session_title + " session will start from " + data.message[j].from);
      // }
      var { notifications } = self.state;
      notifications = [];
      for (var i = 0; i < data.message.length; i++) {
        if (localStorage.getItem('user_id') === data.message[i].user_id) {
          var temp = notifications;
          temp.push(data.message[i]);
        }
      }
      self.setState({ notifications: temp });
      temp = [];
    });
  }

  getNotifications = async () => {
    let param = {
      user_id: localStorage.getItem('user_id')
    }
    try {
      const result = await getnotification(param);
      if (result.data.result === "success") {
        let t_notifications = result.data.data.new_notifications;
        t_notifications.forEach(t_notification => {
          t_notification.from = moment(t_notification.forum_start * 1000).format("YYYY-MM-DD h:mm:ss a");
          t_notification.to = moment(t_notification.forum_end * 1000).format("YYYY-MM-DD h:mm:ss a");
        });
        let t_all_notifications = result.data.data.all_notifications;
        t_all_notifications.forEach(t_all_notification => {
          t_all_notification.from = moment(t_all_notification.forum_start * 1000).format("YYYY-MM-DD h:mm:ss a");
          t_all_notification.to = moment(t_all_notification.forum_end * 1000).format("YYYY-MM-DD h:mm:ss a");
        });
        this.setState({ 
          notifications: result.data.data.new_notifications,          
          all_notifications: result.data.data.all_notifications
        });
      } else if (result.data.result === "warning") {
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
    } catch (err) {
    };
  }

  onChange() {
    let filterType = false;
    if (JSON.parse(localStorage.getItem('user-type')) != null || JSON.parse(localStorage.getItem('user-type')) !== undefined) {
      filterType = JSON.parse(localStorage.getItem('user-type'));
    } else {
      if (this.props.location.pathname === "/mentorWallet" || this.props.location.pathname === "/mentordashboard") {
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

    localStorage.setItem('user-type', !JSON.parse(localStorage.getItem('user-type')));
    const { filterType, mentorUrl, studentUrl } = this.state;    
    if (!filterType)
      this.props.history.push(mentorUrl);
    else
      this.props.history.push(studentUrl);
  }

  switchUser = async () => {
    let param = {
      user_id: localStorage.getItem('user_id')
    }
    try {
      this.setState({ loading: true });
      const result = await switchuser(param);      
      if (result.data.result === "success") {
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invaild") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  handleSearch(searchKey) {
    if (JSON.parse(localStorage.getItem('user-type')))      
      this.props.history.push("/mentordashboard");
    else
      this.props.history.push("/studentdashboard");
  }

  signout = async () => {
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
    } catch (error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
    this.props.history.push('/');
  }

  render() {
    const { children } = this.props;
    const { noFooter, noNavbar, filterType, notifications, all_notifications, loading } = this.state;
    if (children.props.location.pathname === "/mentordashboard" || children.props.location.pathname === "/studentdashboard") {
      children.props.location.search = "search";
    }
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <Container fluid>
          <Row>
            <MainSidebar filterType={filterType} />
            <Col className="main-content p-0 main-content-class" tag="main">
              {!noNavbar && <MainNavbar filterType={filterType} toggleType={() => this.handleClick()} notifications={notifications} all_notifications={all_notifications} toggle_search={(searchkey) => this.handleSearch(searchkey)} />}
              {filterType && <SubMainNavbar />}
              <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
              {children}
              {!noFooter && <MainFooter />}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
