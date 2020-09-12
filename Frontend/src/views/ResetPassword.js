import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormSelect, FormInput, CardFooter, Button } from "shards-react";
import { resetPassword } from '../api/api';

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      historyData: [],
      password: '',
      confirm: '',
      validationErrorMsg: {
        password: '',
        confirm: ''
      },
      resetErrorMsg: ''
    }
  }

  componentWillMount() {

    let token = this.props.location.search.split('=')[1];

    console.log(token);
  }

  showValidation() {
    var passowrd = document.getElementById("password-input");
    var confirm = document.getElementById("confirm-input");
    
    if(this.state.validationErrorMsg['password']) {
      passowrd.classList.add("sign-has-err");
    } else {
      passowrd.classList.remove("sign-has-err");
    }

    if(this.state.validationErrorMsg['confirm']) {
      confirm.classList.add("sign-has-err");
    } else {
      confirm.classList.remove("sign-has-err");
    }
  }

  checkValidation() {
    let errors = {};
    let formIsValid = true;

    if(!this.state.password){
      formIsValid = false;
      errors['password'] = "This field is required";
    }

    if(!this.state.confirm){
      formIsValid = false;
      errors['confirm'] = "This field is required";
    }

    if(this.state.password && this.state.confirm && this.state.password !== this.state.confirm) {
      formIsValid = false;
      errors['confirm'] = "The password does not match";
    }

    this.setState({validationErrorMsg: errors}, () => {
      this.showValidation();
    });
    return formIsValid;
  }

  actionResetPassword = async() => {
    try {
      const result = await resetPassword({email: localStorage.getItem('email'), passowrd: this.state.password, confirm: this.state.confirm});

      if(result.data.result === "success") {
        
      } else {

      }
    } catch(err) {
      alert(err);
    }
  }

  handleResetPassword() {
    if(this.checkValidation())
      this.actionResetPassword();
  }

  onChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  onKeydownPassword = (e) => {
    if (e.key === 'Enter') {
      document.getElementById("confirm-input").focus();
    }
  }

  onChangeConfirm = (e) => {
    this.setState({
      confirm: e.target.value,
    });
  }

  onKeydownConfirm = (e) => {
    if (e.key === 'Enter') {
      this.handleResetPassword();
    }
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin center">
        <Card small className="reset-password-card">
          <CardHeader>
            <label className="center forget-password-label">Reset your password</label>
          </CardHeader>
          <CardBody>
            <div>
              <label className="forget-password-input-label">Password</label>
              <Row className="center">
                <FormInput
                  id="password-input"
                  type="password"
                  className="forget-password-input no-margin"
                  placeholder="Password"
                  onChange={e => this.onChangePassword(e)}
                  onKeyDown={e => this.onKeydownPassword(e)}
                >
                </FormInput>
              </Row>
              <label style={{marginLeft: "80px"}} className="validation-err">{this.state.validationErrorMsg['password']}</label>
            </div>
            <div>
              <label className="forget-password-input-label">Confirm password</label>
              <Row className="center">
                <FormInput
                  id="confirm-input"
                  type="password"
                  className="forget-password-input no-margin"
                  placeholder="Confirm password"
                  onChange={e => this.onChangeConfirm(e)}
                  onKeyDown={e => this.onChangeConfirm(e)}
                >
                </FormInput>
              </Row>
              <label style={{marginLeft: "80px"}} className="validation-err">{this.state.validationErrorMsg['confirm']}</label>
            </div>
            <label style={{marginLeft: "80px"}}>{this.state.resetErrorMsg}</label>
          </CardBody>
          <CardFooter className="center">
            <Button
              className="btn-general btn-send-email"
              onClick={() => this.handleResetPassword()}
            >
              Reset password
            </Button>
          </CardFooter>
        </Card>    
      </Container>
    )
  }
}
