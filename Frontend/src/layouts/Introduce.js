import React from "react";
import { Container, Row, Col } from "shards-react";
    
export default class IntroduceLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    const { children } = this.props;
    return (
      <>
        <Container fluid>
          <Row>
            <Col>
              {children}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
