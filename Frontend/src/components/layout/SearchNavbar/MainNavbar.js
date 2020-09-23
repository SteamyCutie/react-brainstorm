import React from "react";
import classNames from "classnames";
import { Container, Navbar, Button } from "shards-react";
import NavbarSearch from "./NavbarSearch";
import NavbarDropdown from "./NavbarDropdown";
import SignIn from "../../landingpage/SignIn";
import SignUp from "../../landingpage/SignUp";

const classes = classNames(
  "main-navbar",
  "bg-white",
  "sticky-top"
);

export default class MainNavbar extends React.Component{

  constructor(props) {
    super(props);
    this.signInElement = React.createRef();
    this.signUpElement = React.createRef();
    this.state = {
      signInOpen: false,
      signUpOpen: false,
    }
  }

  toggle_signin() {
    this.setState({
      signInOpen: !this.state.signInOpen
    });
    if(!this.state.signInOpen) {
      this.signInElement.current.clearValidationErrors();
    }
  }

  toggle_signup() {
    this.setState({
      signUpOpen: !this.state.signUpOpen
    });
    if(!this.state.signUpOpen) {
      this.signUpElement.current.clearValidationErrors();
    }
  }

  toggle_modal() {
    this.setState({
      signInOpen: !this.state.signInOpen,
      signUpOpen: !this.state.signUpOpen
    });
    if(!this.state.signInOpen) {
      this.signInElement.current.clearValidationErrors();
    }
    if(!this.state.signUpOpen) {
      this.signUpElement.current.clearValidationErrors();
    }
  }

  becomeMentor() {
  }

  findMentor() {
    window.location.href = '/findmentor';
  }

  toggle_search(searchKey) {
    const { onSearch } = this.props;
    onSearch(searchKey);
  }

  render() {
    const { signInOpen, signUpOpen } = this.state;
    return (
      <div className={classes}>
        <SignIn ref={this.signInElement} open={signInOpen} toggle={() => this.toggle_signin()} toggle_modal={() => this.toggle_modal()}/>
        <SignUp ref={this.signUpElement} open={signUpOpen} toggle={() => this.toggle_signup()} toggle_modal={() => this.toggle_modal()}/>
        <Container className="p-0 fix-position">
          <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
            <NavbarSearch toggle_search={(searchKey) => this.toggle_search(searchKey)}/>
            <div className="btn-group-header">
              <Button theme="light" className="mb-2 white-background btn-landingpage" style={{boxShadow: "none !important" }} onClick={() => this.becomeMentor()}>
                Become a mentor
              </Button>
              <Button theme="light" className="mb-2 btn-landingpage white-background" onClick={() => this.findMentor()}>
                Find a mentor
              </Button>
              <Button theme="light" className="mb-2 btn-landingpage white-background" onClick={() => this.toggle_signup()}>
                Sign up
              </Button>
              <Button outline theme="primary" className="mb-2 btn-landingpage btn-custom" onClick={() => this.toggle_signin()}>
                Sign in
              </Button>
            </div>
            <div className="btn-dropdown-header">
              <NavbarDropdown />
            </div>
          </Navbar>
        </Container>
      </div>
    );
  }
};
