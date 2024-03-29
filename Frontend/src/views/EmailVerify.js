import React from "react";
import { Container, Row, Card, CardBody, CardHeader, FormInput, CardFooter, Button } from "shards-react";
import { verifyCode } from '../api/api';
import { withRouter } from 'react-router-dom';

class EmailVerify extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      errorMsg: '',
      code: '',
    }
  }

  componentWillMount() {
    
  }

  actionVerifyCode = async() => {
    try {
      const result = await verifyCode({code: this.state.code});

      if(result.data.result === "success") {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('email', result.data.user.email);
        localStorage.setItem('user_id', result.data.user.id);
        localStorage.setItem('avatar', result.data.user.avatar);
        localStorage.setItem('user_name', result.data.user.name);
        localStorage.setItem('pay_verified', result.data.user.pay_verified);
        localStorage.setItem('user-type', (result.data.user.is_mentor === 1 ? true : false));
        if(result.data.user.is_mentor) {
          this.props.history.push('/mentorWallet');
        } else {
          this.props.history.push('/studentWallet');
        }
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
    localStorage.removeItem('password');
  }

  handleVerifyCode() {
      this.actionVerifyCode();
  }

  onChangeCode = (e) => {
    this.setState({
      code: e.target.value,
      errorMsg: ''
    });
  }

  onKeydownEmail = (e) => {
    if (e.key === 'Enter') {
      this.handleVerifyCode();
    }
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin center">
        <Card small className="forget-password-card">
          <CardHeader>
            <label className="center forget-password-label">Email Verification</label>
          </CardHeader>
          <CardBody>
              <label className="forget-password-input-label">Verification Code</label>
              <Row className="center">
                <FormInput
                  id="email-input"
                  className="forget-password-input"
                  placeholder="Verification Code"
                  onChange={e => this.onChangeCode(e)}
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
              onClick={() => this.handleVerifyCode()}
            >
              Verify Code
            </Button>
          </CardFooter>
        </Card>    
      </Container>
    )
  }
}

export default withRouter(EmailVerify);