import React from "react";
import { Container, Row, Card, CardBody, CardHeader, FormInput, CardFooter, Button } from "shards-react";
import { forgetPassword } from '../api/api';

export default class ForgetPassword extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      historyData: [],
      email: '',
      validationErrorMsg: '',
      vCode: '',
      errorMsg: ''
    }
  }

  componentWillMount() {
    
  }

  showValidation() {
    var emailInput = document.getElementById("email-input");
    
    if(this.state.validationErrorMsg) {
      emailInput.classList.add("sign-has-err");
    } else {
      emailInput.classList.remove("sign-has-err");
    }
  }

  checkValidation() {
    let error = '';
    let formIsValid = true;

    if(!this.state.email){
      formIsValid = false;
      error = "This field is required";
    } else {
      if(this.state.email !== "undefined"){
        let lastAtPos = this.state.email.lastIndexOf('@');
        let lastDotPos = this.state.email.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') === -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
          formIsValid = false;
          error = "Email is incorrect";
        }
      }
    }

    this.setState({validationErrorMsg: error}, () => {
      this.showValidation();
    });
    return formIsValid;
  }

  actionForgetPassword = async() => {
    try {
      const result = await forgetPassword({email: localStorage.getItem('email')});

      if(result.data.result === "success") {
        window.location.href = '/emailsent';
      } else {
        this.setState({
          errorMsg: result.data.message
        })
      }
    } catch(err) {
      // alert(err);
      this.setState({
        errorMsg: "Error is occured"
      })
    }
  }

  handleSendEmail() {
    if(this.checkValidation())
    {
      localStorage.setItem('email', this.state.email);
      this.actionForgetPassword();
    }
  }

  onChangeEmail = (e) => {
    this.setState({
      email: e.target.value,
      errorMsg: ''
    });
  }

  onKeydownEmail = (e) => {
    if (e.key === 'Enter') {
      this.handleSendEmail();
    }
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin center">
        <Card small className="forget-password-card">
          <CardHeader>
            <label className="center forget-password-label">Forgot Password</label>
          </CardHeader>
          <CardBody>
              <label className="forget-password-input-label">Username or Email</label>
              <Row className="center">
                <FormInput
                  id="email-input"
                  className="forget-password-input"
                  placeholder="Username or Email"
                  onChange={e => this.onChangeEmail(e)}
                  onKeyDown={e => this.onKeydownEmail(e)}
                >
                </FormInput>
              </Row>
              <label style={{marginLeft: "80px"}} className="validation-err">{this.state.validationErrorMsg}</label>
              <label className="sign-in-err">{this.state.errorMsg}</label>
          </CardBody>
          <CardFooter className="center">
            <Button
              className="btn-general btn-send-email"
              onClick={() => this.handleSendEmail()}
            >
              Send Reset Email
            </Button>
          </CardFooter>
        </Card>    
      </Container>
    )
  }
}
