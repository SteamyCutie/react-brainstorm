import React from "react";
import { Button, Modal, ModalBody, FormInput } from "shards-react";
import Loginbygoogle from "../common/Loginbygoogle";
import Loginbyfacebook from "../common/Loginbyfacebook";
import "../../assets/landingpage.css"
import { signin } from '../../api/api';
import Close from '../../images/Close.svg';
import { withRouter } from 'react-router-dom';

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.state = {
      email: "",
      password: "",
      validationError: {
        email: '',
        password: ''
      },
      signInError: ''
    };
  }

  componentWillMount() {
    localStorage.clear();
  }
  
  componentDidMount() {
    if (this.props.open) {
      document.body.style.overflow = 'hidden';
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = 'unset';
  }

  clearValidationErrors() {
    this.setState({
      validationError: {
        email: '',
        password: ''
      },
      signInError: ''
    })
  }

  toggle() {
    const { toggle } = this.props;
    this.setState({
      validationError: {
        email: '',
        password: ''
      },
      signInError: ''
    })
    toggle();
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();
  }

  onChangeEmail = (e) => {
    this.setState({
      email: e.target.value,
      signInError: ''
    });
  }

  onChangePassword = (e) => {
    this.setState({
      password: e.target.value,
      signInError: ''
    });
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    //Email
    if (!this.state.email) {
      formIsValid = false;
      errors["email"] = "This field is required";
    } else {
      if (this.state.email !== "undefined") {
        let lastAtPos = this.state.email.lastIndexOf('@');
        let lastDotPos = this.state.email.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') === -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
          formIsValid = false;
          errors["email"] = "Email is incorrect";
        }
      }
    }

    //Password
    if (!this.state.password) {
      formIsValid = false;
      errors["password"] = "This field is required";
    }
    this.setState({ validationError: errors }, () => {
      this.showValidation();
    });
    return formIsValid;
  }

  showValidation() {
    var emailInput = document.getElementById("email-input");
    var passwordInput = document.getElementById("password-input");

    if (this.state.validationError['email']) {
      emailInput.classList.add("sign-has-err");
    } else {
      emailInput.classList.remove("sign-has-err");
    }

    if (this.state.validationError['password']) {
      passwordInput.classList.add("sign-has-err");
    } else {
      passwordInput.classList.remove("sign-has-err");
    }
  }

  handleSignin() {
    if (this.handleValidation()) {
      this.actionSignin();
    }
  }

  actionSignin = async () => {
    try {
      const result = await signin(this.state);
      if (result.data.result === "success") {        
        localStorage.setItem('email', result.data.user.email);
        localStorage.setItem('user_id', result.data.user.id);
        localStorage.setItem('avatar', result.data.user.avatar);
        localStorage.setItem('user_name', result.data.user.name);
        localStorage.setItem('pay_verified', result.data.user.pay_verified);
        localStorage.setItem('channel_name', result.data.user.channel_name);
        localStorage.setItem('user-type', (result.data.user.is_mentor === 1 ? true : false));
        localStorage.setItem('token', result.data.token);

        if (result.data.user.is_mentor) {
          this.props.history.push('/mentordashboard');
        } else {
          this.props.history.push('/studentdashboard');
        }
      } else {
        this.setState({
          signInError: result.data.message
        })
      }
    } catch (err) {
      this.setState({
        signInError: 'Error is occured'
      })
    };
  }

  handleEmailKeyDown = (e) => {
    if (e.key === 'Enter') {
      document.getElementById("password-input").focus();
    }
  }

  handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.handleSignin();
    }
  }

  handleforgetPassword() {    
    // this.props.history.push('/forgetpassword');
  }

  errorOccur(text) {
    this.setState({
      signInError: text
    })
  }

  onClick = (e) => {
    e.preventDefault();
    this.toggle_modal();
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal open={open} toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Sign in</h1>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Email</label>
              <FormInput
                id="email-input"
                type="email"
                placeholder="Username or Email"
                onChange={(e) => this.onChangeEmail(e)}
                onKeyDown={(e) => this.handleEmailKeyDown(e)}
                autoComplete="email"
                className="email-input"
                autoFocus="1"
              />
              <label className="email-validation-err">{this.state.validationError['email']}</label>
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="fePassword">Password</label>
              <a href="/forgetpassword" htmlFor="feForgot" className="forgot-class" onClick={() => this.handleforgetPassword()}>Forgot password?</a>
              <FormInput
                id="password-input"
                type="password"
                placeholder="Password"
                onChange={(e) => this.onChangePassword(e)}
                onKeyDown={(e) => this.handlePasswordKeyDown(e)}
                autoComplete="text"
                className="password-input"
              />
              <label className="password-validation-err">{this.state.validationError['password']}</label>
            </div>
            <div className="content-center block-content-class button-text-group-class">
              <label className="sign-in-err">{this.state.signInError}</label>
              <Button onClick={() => this.handleSignin()}>Sign in</Button>
              <p>Don't have an account?&nbsp;
                <label className="login-signup" onClick={this.onClick}>Sign up</label>                
                </p>
            </div>
            <div className="content-center seperation-line-class">
              <hr />
              or
              <hr />
            </div>
            <div className="facebook-login-center">
              <Loginbyfacebook errorOccur={(text) => this.errorOccur(text)}></Loginbyfacebook>
            </div>
            <div className="google-login-center">
              <Loginbygoogle errorOccur={(text) => this.errorOccur(text)}></Loginbygoogle>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default withRouter(SignIn);