import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "shards-react";

import SignIn from "../../landingpage/SignIn";
import SignUp from "../../landingpage/SignUp";
import { withRouter } from 'react-router-dom';


class NavbarDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      dropdown1: false,
      dropdown2: false,
      signInOpen: false,
      signUpOpen: false,
    };
  }

  toggle(which) {
    // const newState = { ...this.state };
    // newState[which] = !this.state[which];
    // this.setState(newState);
    this.setState({dropdown1: !this.state.dropdown1});
  }

  toggle_signin() {
    this.setState({
      signInOpen: !this.state.signInOpen
    });
  }

  toggle_signup() {
    this.setState({
      signUpOpen: !this.state.signUpOpen
    });
    if(!this.state.signUpOpen) {
      this.is_Mentor = false;
    }
  }

  toggle_modal() {
    this.setState({
      signInOpen: !this.state.signInOpen,
      signUpOpen: !this.state.signUpOpen
    });
  }

  findMentor() {
    this.props.history.push('/findmentor');
  }

  becomeMentor() {
    this.setState({
      signUpOpen: !this.state.signUpOpen, 
      // isMentor: true, 
    });
    this.is_Mentor = true;
  }

  render() {
    const { signInOpen, signUpOpen } = this.state;
    return (
      <div>
        <SignIn open={signInOpen} toggle={() => this.toggle_signin()} toggle_modal={() => this.toggle_modal()}/>
        <SignUp open={signUpOpen} toggle={() => this.toggle_signup()} toggle_modal={() => this.toggle_modal()} isMentor={this.is_Mentor}/>
        <Dropdown
        open={this.state.dropdown1}
        toggle={() => this.toggle("dropdown1")}
        addonType="append"
        >
        <DropdownToggle caret className="btn-dropdown-toogle">Go to ...</DropdownToggle>
        <DropdownMenu small right>
            <DropdownItem className="btn-dropdown-item" onClick={() => this.becomeMentor()}>Become a mentor</DropdownItem>
            <DropdownItem className="btn-dropdown-item" onClick={() => this.findMentor()}>Find a mentor</DropdownItem>
            <DropdownItem className="btn-dropdown-item" onClick={() => this.toggle_signup()}>Sign up</DropdownItem>
            <DropdownItem className="btn-dropdown-item" onClick={() => this.toggle_signin()}>Sign in</DropdownItem>
        </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default withRouter(NavbarDropdown);
