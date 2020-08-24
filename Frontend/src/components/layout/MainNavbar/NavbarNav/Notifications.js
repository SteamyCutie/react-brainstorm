import React from "react";
import { NavItem, NavLink, Badge, Collapse, DropdownItem } from "shards-react";

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleNotifications = this.toggleNotifications.bind(this);
  }

  toggleNotifications() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    return (
      <NavItem className="dropdown notifications notification-class">
        <NavLink
          className="nav-link-icon text-center"
          onClick={this.toggleNotifications}
        >
          <div className="nav-link-icon__wrapper">
          <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5029 7.60117C17.5029 5.85043 16.8074 4.1714 15.5695 2.93344C14.3315 1.69548 12.6525 1 10.9018 1C9.15102 1 7.47198 1.69548 6.23402 2.93344C4.99606 4.1714 4.30058 5.85043 4.30058 7.60117C4.30058 15.3025 1 17.5029 1 17.5029H20.8035C20.8035 17.5029 17.5029 15.3025 17.5029 7.60117Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.8047 21.9037C12.6113 22.2371 12.3337 22.5139 11.9996 22.7063C11.6656 22.8987 11.2869 23 10.9014 23C10.5159 23 10.1372 22.8987 9.80314 22.7063C9.4691 22.5139 9.19147 22.2371 8.99805 21.9037" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

            <Badge pill theme="danger badge-class">0</Badge>
          </div>
        </NavLink>
        <Collapse
          open={this.state.visible}
          className="dropdown-menu dropdown-menu-small"
        >
          <DropdownItem>
            <div className="notification__icon-wrapper">
              <div className="notification__icon">
                <i className="material-icons">&#xE6E1;</i>
              </div>
            </div>
            <div className="notification__content">
              <span className="notification__category">Analytics</span>
              <p>
                Your website’s active users count increased by{" "}
                <span className="text-success text-semibold">28%</span> in the
                last week. Great job!
              </p>
            </div>
          </DropdownItem>
          <DropdownItem>
            <div className="notification__icon-wrapper">
              <div className="notification__icon">
                <i className="material-icons">&#xE8D1;</i>
              </div>
            </div>
            <div className="notification__content">
              <span className="notification__category">Sales</span>
              <p>
                Last week your store’s sales count decreased by{" "}
                <span className="text-danger text-semibold">5.52%</span>. It
                could have been worse!
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
