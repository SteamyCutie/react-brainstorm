import React from "react";
import { Container, Row, Col, Button, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import SmallCard3 from "../components/common/SmallCard3"
import { getUpcomingSession } from '../api/api';

export default class StudentSession extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionList: []
    }
  }

  componentWillMount() {
    this.getSessionList();
  }

  getSessionList = async() => {
    try {
      const result = await getUpcomingSession({email: localStorage.getItem('email')});
      console.log(result, "+++++");
      if(result.data.result === "success") {
        var sessionTemp = result.data.data;

        this.setState({
          sessionList: sessionTemp,
        });
        console.log(this.state.sessionList);
      } else {

      }
    } catch(err) {
      this.setState({
        errorMsg: "Error is occured"
      })
    }
  }

  findMentor = async() => {
    
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
        <Row noGutters className="page-header py-4">
          <Col className="page-title">
            <h3>Upcoming session</h3>
          </Col>
          <Button className="btn-add-payment" onClick={() => this.findMentor()}>Find a mentor</Button>
        </Row>
        <Card small className="history-card">
          <CardHeader className="history-card-header">
            <h5 className="history-card-header-title no-margin">Filter by:</h5>
            <div className="filter-items-group">
              <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Date:
              </label>
              <FormSelect style={{height: "30px", width: "180px", marginRight: "10px"}}>
                <option>Augut 10 - August 16</option>
              </FormSelect>
              <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Sessions:
              </label>
              <FormSelect style={{height: "30px", width: "80px", marginRight: "10px"}}>
                <option>All</option>
              </FormSelect>
              <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Category:
              </label>
              <FormSelect style={{height: "30px", width: "130px", marginRight: "10px"}}>
                <option>Select category</option>
              </FormSelect>
              <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Mentor:
              </label>
              <FormSelect style={{height: "30px", width: "120px", marginRight: "10px"}}>
                <option>Select mentor</option>
              </FormSelect>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              {this.state.sessionList.map((session, idx) => {
                return (
                  <Col xl="4" lg="4" sm="6">
                    <SmallCard3 id={idx} data={session}/>
                  </Col>
                )
              })}
            </Row>
          </CardBody>
        </Card>    
      </Container>
    )
  }
};
