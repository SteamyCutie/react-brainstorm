import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';
import SmallCard3 from "../components/common/SmallCard3"
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { getHistory, getweekdata, gettags, getallmentors } from '../api/api';

export default class History extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      totalCnt: 0,
      loading: false,
      historyData: [],
      weekList: [],
      tags: [],
      mentors: []
    }
  }

  componentWillMount() {
    this.getHistoryList(1);
    this.getWeekData();
    this.getTags();
    this.getMentors();
  }

  getHistoryList = async(pageNo) => {
    let param = {
      email: localStorage.getItem('email'),
      page: pageNo,
      rowsPerPage: 10
    }
    try {
      this.setState({loading: true});
      const result = await getHistory(param);
      if(result.data.result === "success") {
        var historyTemp = result.data.data;
        this.setState({
          historyData: historyTemp,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
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

  getMentors = async(pageNo) => {
    let param = {
      email: localStorage.getItem('email'),
      page: pageNo,
      rowsPerPage: 10
    }
    try {
      this.setState({loading: true});
      const result = await getallmentors(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          mentors: result.data.data,
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
    };
  }

  getHistoryList(e, value) {
    this.getMentors(value);
  }

  removeSession() {
    localStorage.clear();
  }

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

  render() {
    const {loading, historyData, weekList, tags, totalCnt, mentors} = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
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
                  <option>Select Date</option>
                  {weekList.map((item, idx) =>
                    <option key={idx}>{item}</option>
                  )}
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
                  {tags && tags.map((item, idx) =>
                    <option key={idx}>{item.name}</option>
                  )}
                </FormSelect>
                <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                  Mentor:
                </label>
                <FormSelect style={{height: "30px", width: "120px", marginRight: "10px"}}>
                  <option>Select mentor</option>
                  {mentors && mentors.map((item, idx) =>
                    <option key={idx} value={item.name}>{item.name}</option>
                  )}
                </FormSelect>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                {historyData.map((history, idx) => {
                  return (
                    <Col xl="4" lg="4" sm="6">
                      <SmallCard3 id={idx} data={history} />
                    </Col>
                  )
                })}
              </Row>
            </CardBody>
          </Card>    
          {historyData.length > 0 && <Row className="pagination-center">
            <Pagination count={totalCnt} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
          </Row>}
        </Container>
      </>
    )
  }
}