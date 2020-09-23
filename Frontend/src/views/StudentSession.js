import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import SmallCard3 from "../components/common/SmallCard3"
import { getUpcomingSession, gettags, getweekdata } from '../api/api';
import LoadingModal from "../components/common/LoadingModal";

export default class StudentSession extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      sessionList: [],
      tags: [],
      weekList: [],
      param: {
        time: '',
        tag_id: '',
        email: localStorage.getItem('email')
      }
    }
  }

  componentWillMount() {
    this.getSessionList();
    this.getTags();
    this.getWeekData();
  }

  getSessionList = async() => {
    const { param } = this.state;
    try {
      this.setState({loading: true});
      const result = await getUpcomingSession(param);
      if(result.data.result === "success") {
        var sessionTemp = result.data.data;
        this.setState({
          sessionList: sessionTemp,
        });
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    }
  }

  getTags = async() => {
    try {
      const result = await gettags();
      if (result.data.result === "success") {
        this.setState({tags: result.data.data});
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
    } catch(err) {
      this.showFail("Something Went wrong");
    };
  }

  getWeekData = async() => {
    try {
      const result = await getweekdata();
      if (result.data.result === "success") {
        this.setState({weekList: result.data.data});
      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
          window.location.href = "/";
        } else {
          this.showFail(result.data.message);
        }
      }
    } catch(err) {
      this.showFail("Something Went wrong");
    };
  }

  onChangeTags = (e) => {
    const { param } = this.state;
    let temp = param;
    temp.tag_id = e.target.value;
    this.setState({param: temp});
    this.getSessionList();
  }

  onChangeDate = (e) => {
    const { param } = this.state;
    let temp = param;
    temp.time = e.target.value;
    this.setState({param: temp});
    this.getSessionList();
  }

  // findMentor = async() => {
    
  // }

  showSuccess(text) {
    store.addNotification({
      title: "Success",
      message: text,
      type: "success",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      },
    });
  }

  showFail(text) {
    store.addNotification({
      title: "Fail",
      message: text,
      type: "danger",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  showWarning(text) {
    store.addNotification({
      title: "Warning",
      message: text,
      type: "warning",
      insert: "top",
      container: "top-right",
      dismiss: {
        duration: 500,
        onScreen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  removeSession() {
    localStorage.clear();
  }

  render() {
    const {tags, weekList} = this.state;
    return (
      <>
      {this.state.loading && <LoadingModal open={true} />}
      <ReactNotification />
      <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
        <Row noGutters className="page-header py-4">
          <Col className="page-title">
            <h3>Upcoming session</h3>
          </Col>
          {/* <Button className="btn-add-payment" onClick={() => this.findMentor()}>Find a mentor</Button> */}
        </Row>
        <Card small className="history-card">
          <CardHeader className="history-card-header">
            <h5 className="history-card-header-title no-margin">Filter by:</h5>
            <div className="filter-items-group">
              <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Date:
              </label>
              <FormSelect style={{height: "30px", width: "200px", marginRight: "10px"}} onChange={(e) => this.onChangeDate(e)}>
                <option value="">Select Date</option>
                {weekList.map((item, idx) =>
                  <option key={idx}>{item}</option>
                )}
              </FormSelect>
              {/* <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Sessions:
              </label>
              <FormSelect style={{height: "30px", width: "80px", marginRight: "10px"}}>
                <option>All</option>
              </FormSelect> */}
              <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Tag:
              </label>
              <FormSelect style={{height: "30px", width: "130px", marginRight: "10px"}} onChange={(e) => this.onChangeTags(e)}>
                <option value="">Select tag</option>
                {tags.map((item, idx) =>
                  <option key={idx} value={item.id}>{item.name}</option>
                )}
              </FormSelect>
              {/* <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                Mentor:
              </label>
              <FormSelect style={{height: "30px", width: "120px", marginRight: "10px"}}>
                <option>Select mentor</option>
              </FormSelect> */}
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              {this.state.sessionList.map((session, idx) => {
                return (
                  <Col key={idx} xl="4" lg="4" sm="6">
                    <SmallCard3 key={idx} data={session}/>
                  </Col>
                )
              })}
            </Row>
          </CardBody>
        </Card>    
      </Container>
      </>
    )
  }
};
