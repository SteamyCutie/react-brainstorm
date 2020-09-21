import React from "react";
import { Container, Card, CardBody, CardHeader, CardFooter, Button } from "shards-react";

export default class EmailSent extends React.Component {

  componentWillMount() {
    
  }

  handleGoBack() {
    window.location.href = '/';
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin center">
        <Card small className="forget-password-card">
          <CardHeader>
            <label className="center forget-password-label">Email Sent</label>
          </CardHeader>
          <CardBody className="center">
              <label className="email-sent-label">Check your email for a message with a link to update your password. This link will expire in 4 hours.</label>
          </CardBody>
          <CardFooter className="center">
            <Button
              className="btn-general btn-send-email"
              onClick={() => this.handleGoBack()}
            >
              Go back to Landing page
            </Button>
          </CardFooter>
        </Card>    
      </Container>
    )
  }
}
