import React from "react";
// import { Nav } from "shards-react";

// import SidebarNavItem from "./SidebarNavItem";
import { Store } from "../../../flux";

class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      navSearchItems: Store.getSearchSidebarItems()
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
      navSearchItems: Store.getSearchSidebarItems()
    });
  }

  onMenuClick(id) {
    const { menuclick } = this.props;
    menuclick(id);
  }

  render() {
    const { navSearchItems: items } = this.state;
    // const { filterType } = this.props;
    return (
      <div className="nav-wrapper">
        <ul className="search-category" style={{paddingLeft: 65}}>
          <li style={{fontSize: 18}}>
            Categories
          </li>
        </ul>
        <ul style={{paddingLeft: 65}}>
          {items.map((item, idx) => (
            <li key={idx} className="search-item-list">
              <a href="#!" onClick={() => this.onMenuClick(item.id)}>{item.title}</a>
            </li>
          ))}
        </ul>
        {/* <Nav className="nav--no-borders flex-column">
          {items.map((item, idx) => (
            <SidebarNavItem key={idx} item={item} filterType={filterType} />
          ))}
        </Nav> */}
      </div>
    )
  }
}

export default SidebarNavItems;
