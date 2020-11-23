import React from "react";
import AWS from 'aws-sdk'
import { Button, Modal, ModalBody, FormInput } from "shards-react";
import Loginbygoogle from "../common/Loginbygoogle";
import Loginbyfacebook from "../common/Loginbyfacebook";
import "../../assets/landingpage.css"
import { signup } from '../../api/api';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../common/config';
import Close from '../../images/Close.svg';
import { withRouter } from 'react-router-dom';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", 
      email: "", 
      password: "", 
      channel_name: "",
      confirmpassword: "",
      validationError: {
        name: '',
        email: '',
        password: '',
        confirm: '',
      },
      signUpError: '', 
      is_mentor:  false,
      history: null,
    };
  }

  componentWillMount() {
    localStorage.clear();
  }

  toggle() {
    const { toggle } = this.props;
    this.setState({
      validationError: {
        name: '',
        email: '',
        password: '',
        confirm: ''
      },
      signUpError: ''
    })
    toggle();    
  }

  toggle_modal() {
    const { toggle_modal } = this.props;
    toggle_modal();    
  }

  onChangeName = (e) => {
    this.setState({name: e.target.value});
  }

  onChangeEmail = (e) => {
    this.setState({email: e.target.value});
  }

  onChangePassword = (e) => {
    this.setState({password: e.target.value});
  }

  onChangeConfirmPassword = (e) => {
    this.setState({confirmpassword: e.target.value});
  }

  actionSignup = async() => {        
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    let param = this.state;
    param.channel_name = text;    
    this.setState({history: this.props.history});
    try {
      const result = await signup(param);
      if (result.data.result === "success") {
        this.createAWSKinesisChannel();
      } else {
        this.setState({
          signUpError: result.data.message
        })
      }
    } catch(err) {
    };
  }

  createAWSKinesisChannel() {
    var params = {
      ChannelName: this.state.channel_name,
    };

    var kinesisvideo = new AWS.KinesisVideo({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
    var self = this;
    kinesisvideo.createSignalingChannel(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {        
        self.state.history.push('/verification');
      } 
    });
  }

  handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      document.getElementById("email").focus();
    }
  }

  handleEmailKeyDown = (e) => {
    if (e.key === 'Enter') {
      document.getElementById("password").focus();
    }
  }

  handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      document.getElementById("confirm").focus();
    }
  }

  handleConfirmKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.handleSignup();
    }
  }

  clearValidationErrors() {
    this.setState({
      validationError: {
        name: '',
        email: '',
        password: '',
        confirm: ''
      },
      signUpError: ''
    })
  }

  showValidation() {
    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var confirmInput = document.getElementById("confirm");
    
    if(this.state.validationError['name']) {
      nameInput.classList.add("sign-has-err");
    } else {
      nameInput.classList.remove("sign-has-err");
    }

    if(this.state.validationError['email']) {
      emailInput.classList.add("sign-has-err");
    } else {
      emailInput.classList.remove("sign-has-err");
    }
    
    if(this.state.validationError['password']) {
      passwordInput.classList.add("sign-has-err");
    } else {
      passwordInput.classList.remove("sign-has-err");
    }

    if(this.state.validationError['confirm']) {
      confirmInput.classList.add("sign-has-err");
    } else {
      confirmInput.classList.remove("sign-has-err");
    }
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    //Full name
    if(!this.state.name) {
      formIsValid = false;
        errors["name"] = "This field is required";
    }
    
    //Email
    if(!this.state.email){
        formIsValid = false;
        errors["email"] = "This field is required";
    } else {
      if(this.state.email !== "undefined"){
        let lastAtPos = this.state.email.lastIndexOf('@');
        let lastDotPos = this.state.email.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') === -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
          formIsValid = false;
          errors["email"] = "Email is incorrect";
        }
      }
    }

    //Compare
    if(this.state.confirmpassword && this.state.password && this.state.password !== this.state.confirmpassword) {
      formIsValid = false;
      errors["confirm"] = "The password does not match. Try again";
    }

    //Password
    if(!this.state.password) {
      formIsValid = false;
      errors["password"] = "This field is required";
    }

    //Confirm
    if(!this.state.confirmpassword) {
      formIsValid = false;
      errors["confirm"] = "This field is required";
    }

    this.setState({validationError: errors}, () => {
      this.showValidation();
    });
    return formIsValid;
  }

  handleSignup() {
    if(this.handleValidation()) {
      this.setState({
        is_mentor:  this.props.isMentor, 
      }, () => {
        this.actionSignup();
      })
      
      // console.log(this.state)
    }
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
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close"/></Button>
          <ModalBody className="modal-content-class">
            <h1 className="content-center modal-header-class">Sign up</h1>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Full name</label>
              <FormInput
                id="name"
                type="text"
                placeholder="Full name"
                onChange={(e) => this.onChangeName(e)}
                onKeyDown={(e) => this.handleNameKeyDown(e)}
              />
              <label className="password-validation-err">{this.state.validationError['name']}</label>
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Email</label>
              <FormInput
                id="email"
                type="email"
                placeholder="Email"
                onChange={(e) => this.onChangeEmail(e)}
                onKeyDown={(e) => this.handleEmailKeyDown(e)}
                autoComplete="email"
              />
              <label className="password-validation-err">{this.state.validationError['email']}</label>
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Create password</label>
              <FormInput
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => this.onChangePassword(e)}
                onKeyDown={(e) => this.handlePasswordKeyDown(e)}
                autoComplete="password"
              />
              <label className="password-validation-err">{this.state.validationError['password']}</label>
            </div>
            <div className="content-center block-content-class modal-input-group-class">
              <label htmlFor="feEmail">Confirm password</label>
              <FormInput
                id="confirm"
                type="password"
                placeholder="Confirm password"
                onChange={(e) => this.onChangeConfirmPassword(e)}
                onKeyDown={(e) => this.handleConfirmKeyDown(e)}
                autoComplete="password"
              />
              <label className="password-validation-err">{this.state.validationError['confirm']}</label>
            </div>
            <div className="content-center block-content-class button-text-group-class">
              <label className="password-validation-err">{this.state.signUpError}</label>
              <Button onClick={() => this.handleSignup()}>Sign up</Button>
              <p>Already have an account?&nbsp;
                <a href="" onClick={ this.onClick }>Sign in</a>                
              </p>
            </div>
            <div className="content-center seperation-line-class">
              <hr />
              or
              <hr />
            </div>
            <div className="facebook-login-center">
              <Loginbyfacebook></Loginbyfacebook>
            </div>
            <div className="google-login-center">
              <Loginbygoogle></Loginbygoogle>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default withRouter(SignUp);