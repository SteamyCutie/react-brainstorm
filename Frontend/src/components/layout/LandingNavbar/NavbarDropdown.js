import React from "react";
import {
  InputGroup,
  FormInput,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "shards-react";

class NavbarDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      dropdown1: false,
      dropdown2: false
    };
  }

  toggle(which) {
    const newState = { ...this.state };
    newState[which] = !this.state[which];
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <Dropdown
        open={this.state.dropdown1}
        toggle={() => this.toggle("dropdown1")}
        addonType="append"
        >
        <DropdownToggle caret>Go to ...</DropdownToggle>
        <DropdownMenu small right>
            <DropdownItem>Become a mentor</DropdownItem>
            <DropdownItem>Find a mentor</DropdownItem>
            <DropdownItem>Sign up</DropdownItem>
            <DropdownItem>Sign in</DropdownItem>
        </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default NavbarDropdown;
