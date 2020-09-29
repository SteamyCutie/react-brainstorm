import { notification } from "antd";
import React from "react";
import { NavItem, NavLink, Badge, Collapse, DropdownItem } from "shards-react";
import NotificationsNone from '@material-ui/icons/NotificationsNone';

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      notification_count: 0,
      notifications: {}
    };

    this.toggleNotifications = this.toggleNotifications.bind(this);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications) {
      this.setState({
        notification_count: 1,
        notifications: nextProps.notifications
      });
    }
  }

  toggleNotifications() {
    this.setState({
      visible: !this.state.visible,
      notification_count: 0,
    });
  }

  render() {
    const { visible, notification_count, notifications } = this.state;
    return (
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
            <DropdownItem>
              <div className="notification__icon-wrapper">
                <div className="notification__icon">
                  <i className="material-icons">&#xE6E1;</i>
                </div>
              </div>
              <div className="notification__content">
                <span className="notification__category">{notifications.title}</span>
                <p>
                  The lecture <span className="text-danger text-semibold">{notifications.title}</span> will start from{" "}
                  <span className="text-success text-semibold">{notifications.from}</span>
                </p>
              </div>
            </DropdownItem>
          
          <DropdownItem className="notification__all text-center">
            View all Notifications
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}

