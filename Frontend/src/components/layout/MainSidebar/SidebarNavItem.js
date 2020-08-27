import React from "react";
import PropTypes from "prop-types";
import { NavLink as RouteNavLink } from "react-router-dom";
import { NavItem, NavLink } from "shards-react";

const SidebarNavItem = ({ item, filterType }) => (
  <NavItem>
    {
      filterType === item.filter && <NavLink tag={RouteNavLink} to={item.to} className="main-sidebar-item-icon-class">
      {item.htmlBefore && (
        <div
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
        />
      )}
      {item.title && <span className="sidebar-item-font">{item.title}</span>}
      {item.htmlAfter && (
        <div
          className="d-inline-block item-icon-wrapper"
          dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
        />
      )}
    </NavLink>
    }
    
  </NavItem>
);

SidebarNavItem.propTypes = {
  item: PropTypes.object,
  filterType: PropTypes.bool
};

export default SidebarNavItem;
