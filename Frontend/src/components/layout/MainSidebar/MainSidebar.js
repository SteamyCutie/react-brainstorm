import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Col } from "shards-react";

import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarNavItems from "./SidebarNavItems";

import { Store } from "../../../flux";

class MainSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
      sidebarNavItems: Store.getSidebarItems()
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      menuVisible: Store.getMenuState(),
      sidebarNavItems: Store.getSidebarItems()
    });
  }

  
  render() {
    const { filterType } = this.props;
    
    const classes = classNames(
      JSON.parse(localStorage.getItem('user-type')) ? "main-sidebar-mentor" : "main-sidebar",
      "px-0",
      "col-12",
      "main-sidebar-class",
      this.state.menuVisible && "open"
    );

    return (
      <Col
        tag="aside"
        className={classes}
        lg={{ size: 2 }}
        // md={{ size: 3 }}
      >
        <SidebarMainNavbar hideLogoText={this.props.hideLogoText} />
        <SidebarNavItems filterType={filterType}/>
      </Col>
    );
  }
}

MainSidebar.propTypes = {
  hideLogoText: PropTypes.bool,
  filterType: PropTypes.bool
};

MainSidebar.defaultProps = {
  hideLogoText: false,
  filterType: true,
};

export default MainSidebar;
