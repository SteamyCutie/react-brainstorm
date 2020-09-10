import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import SmallCard3 from "../components/common/SmallCard3"
import { getHistory } from '../api/api';

export default class History extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      historyData: []
    }
  }

  componentWillMount() {
    this.getHistoryList();
  }

  getHistoryList = async() => {
    try {
      const result = await getHistory({email: localStorage.getItem('email')});
      
      if(result.data.result === "success") {
        var historyTemp = result.data.data;
        
        this.setState({
          historyData: historyTemp,
        });
      } else {

      }
    } catch(err) {
      alert(err);
    }
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
        <Row noGutters className="page-header py-4">
          <Col xs="12" sm="12" className="page-title">
            <h3>History</h3>
          </Col>
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
                <option>...</option>
              </FormSelect>
              <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Sessions:
              </label>
              <FormSelect style={{height: "30px", width: "80px", marginRight: "10px"}}>
                <option>All</option>
                <option>...</option>
              </FormSelect>
              <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Category:
              </label>
              <FormSelect style={{height: "30px", width: "130px", marginRight: "10px"}}>
                <option>Select category</option>
                <option>...</option>
              </FormSelect>
              <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Mentor:
              </label>
              <FormSelect style={{height: "30px", width: "120px", marginRight: "10px"}}>
                <option>Select mentor</option>
                <option>...</option>
              </FormSelect>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              {this.state.historyData.map((history, idx) => {
                return (
                  <Col xl="4" lg="4" sm="6">
                    <SmallCard3 id={idx} data={history} />
                  </Col>
                )
              })}
            </Row>
          </CardBody>
        </Card>    
      </Container>
    )
  }
}
