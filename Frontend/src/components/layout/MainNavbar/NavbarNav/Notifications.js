import React from "react";
import { NavItem, NavLink, Badge, Collapse, DropdownItem } from "shards-react";
import NotificationsNone from '@material-ui/icons/NotificationsNone';
import LoadingModal from "../../../../components/common/LoadingModal";
import { checkednotification, signout } from '../../../../api/api';
import avatar from "../../../../images/avatar.jpg";
import { ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      notification_count: 0,
      notifications: [],      
      all_notifications: [],
    };

    this.toggleNotifications = this.toggleNotifications.bind(this);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications) {
      this.setState({
        notification_count: nextProps.notifications.length,
        notifications: nextProps.notifications,
      });
    }
    if (nextProps.all_notifications) {
      this.setState({        
        all_notifications: nextProps.all_notifications,
      })
    }
  }

  toggleNotifications() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  checkNotification = async (id) => {
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
        this.setState({ notification_count: temp });
        localStorage.setItem('user-type', (result.data.data === 1 ? true : false));
        if (result.data.data === 1) {
          // this.props.history.push('/scheduleLiveForum');
          window.location.href = "/scheduleLiveForum";
        } else {          
          // this.props.history.push('/studentSession');
          window.location.href = "/studentSession";
        }
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
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
      // this.setState({loading: false});
    } catch (err) {
      // this.setState({loading: false});
      ToastsStore.error("Something Went wrong");
    };
  }

  checkAllNotification = async (id) => {
    let param = {
      user_id: localStorage.getItem('user_id'),
      session_id: id
    }
    try {
      // this.setState({loading: true});
      const result = await checkednotification(param);
      if (result.data.result === "success") {        
        this.setState({ notification_count: 0 });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
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
      // this.setState({loading: false});
      this.setState({
        visible: !this.state.visible,
      });
    } catch (err) {
      // this.setState({loading: false});
      this.setState({
        visible: !this.state.visible,
      });
      ToastsStore.error("Something Went wrong");
    };
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
    const { visible, notification_count, all_notifications, loading } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <NavItem className="border-right dropdown notifications">
          <NavLink
            className="nav-link-icon text-center"
            onClick={this.toggleNotifications}
          >
            <div className="nav-link-icon__wrapper">
              <label style={{ color: '#5a6169', fontSize: 20 }}><NotificationsNone></NotificationsNone></label>
              {notification_count > 0 && <Badge pill theme="danger">
                <span style={{ color: 'white' }}>{notification_count}</span>
              </Badge>}
            </div>
          </NavLink>
          <Collapse
            open={visible}
            className="dropdown-menu dropdown-menu-small"
          >
            {all_notifications.slice(0).reverse().map((item, idx) =>
              <DropdownItem onClick={() => this.checkNotification(item.session_id)} key={idx}>
                <div className="notification__icon-wrapper">
                  <div className="notification__icon">
                    {item.avatar && <img className="avatar" src={item.avatar} alt="avatar" style={{ width: '35px', height: '35px' }} />}
                    {!item.avatar && <img className="avatar" src={avatar} alt="avatar" style={{ width: '35px', height: '35px' }} />}
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

            {notification_count > 0 && <DropdownItem className="notification__all text-center" onClick={() => this.checkAllNotification(0)}>
              View all Notifications
            </DropdownItem>}
          </Collapse>
        </NavItem>
      </>
    );
  }
}

export default withRouter(Notifications);