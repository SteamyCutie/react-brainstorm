import { notification } from "antd";
import React from "react";
import { NavItem, NavLink, Badge, Collapse, DropdownItem } from "shards-react";
import NotificationsNone from '@material-ui/icons/NotificationsNone';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import LoadingModal from "../../../../components/common/LoadingModal";
import { checkednotification, signout } from '../../../../api/api';
import avatar from "../../../../images/avatar.jpg"

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      notification_count: 0,
      notifications: []
    };

    this.toggleNotifications = this.toggleNotifications.bind(this);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications) {
      this.setState({
        notification_count: nextProps.notifications.length,
        notifications: nextProps.notifications
      });
    }
  }

  toggleNotifications() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  checkNotification = async(id) => {
    let param = {
      user_id: localStorage.getItem('user_id'),
      session_id: id
    }
    try {
      // this.setState({loading: true});
      const result = await checkednotification(param);
      if (result.data.result === "success") {
        var { notification_count } = this.state;
        var temp = notification_count;
        if (temp > 0)
          temp = temp - 1;
        this.setState({notification_count: temp});
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
      // this.setState({loading: false});
    } catch(err) {
      // this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  checkAllNotification = async(id) => {
    let param = {
      user_id: localStorage.getItem('user_id'),
      session_id: id
    }
    try {
      // this.setState({loading: true});
      const result = await checkednotification(param);
      if (result.data.result === "success") {
        this.setState({notification_count: 0});
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
      // this.setState({loading: false});
      this.setState({
        visible: !this.state.visible,
      });
    } catch(err) {
      // this.setState({loading: false});
      this.setState({
        visible: !this.state.visible,
      });
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
        duration : 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
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
    const { visible, notification_count, notifications, loading } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <NavItem className="border-right dropdown notifications">
          <NavLink
            className="nav-link-icon text-center"
            onClick={this.toggleNotifications}
          >
            <div className="nav-link-icon__wrapper">
              <a href="javascript:void(0)" style={{color: '#5a6169', fontSize: 20}}><NotificationsNone></NotificationsNone></a>
              {notification_count > 0 && <Badge pill theme="danger">
                <span style={{color: 'white'}}>{notification_count}</span>
              </Badge>}
            </div>
          </NavLink>
          <Collapse
            open={visible}
            className="dropdown-menu dropdown-menu-small"
          >
              {notifications.map((item, idx) =>
                <DropdownItem onClick={() => this.checkNotification(item.session_id)}>
                  <div className="notification__icon-wrapper">
                    <div className="notification__icon">
                      { item.avatar && <img className="avatar" src={item.avatar} alt="avatar" style={{width: '35px', height: '35px'}} /> }
                      { !item.avatar && <img className="avatar" src={avatar} alt="avatar" style={{width: '35px', height: '35px'}}/> }
                      {/* { item.avatar && <i className="material-icons"><img className="avatar" src={item.avatar} alt="avatar" style={{width: 35, height: 35}} /></i> }
                      { !item.avatar && <i className="material-icons"><img className="avatar" src={avatar} alt="avatar" style={{width: 35, height: 35}}/></i> } */}
                      {/* <i className="material-icons">&#xE6E1;</i> */}
                    </div>
                  </div>
                  <div className="notification__content">
                    <span className="notification__category">{item.session_title}</span>
                    <p>
                      The lecture <span className="text-danger text-semibold">{item.session_title}</span> will start from{" "}
                      <span className="text-success text-semibold">{item.from}</span>
                    </p>
                  </div>
                </DropdownItem>
              )}
            
            { notification_count > 0 && <DropdownItem className="notification__all text-center" onClick={() => this.checkAllNotification(0)}>
              View all Notifications
            </DropdownItem> }
          </Collapse>
        </NavItem>
      </>
    );
  }
}

