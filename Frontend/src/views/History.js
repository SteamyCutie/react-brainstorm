import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import HistoryCard from "../components/common/HistoryCard"
import LoadingModal from "../components/common/LoadingModal";
import { getHistory, getweekdata, gettags, getallmentors, signout } from '../api/api';
import { ToastsStore } from 'react-toasts';

export default class History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      historyData: [],
      weekList: [],
      tags: [],
      // mentors: [],
      param: {
        time: '',
        tag_id: '',
        // mentor_id: '',
        email: localStorage.getItem('email')
      }
    }
  }

  componentWillMount() {
    this.getHistoryList();
    this.getWeekData();
    this.getTags();
    // this.getMentors();
  }

  getHistoryList = async () => {
    let { param } = this.state;
    try {
      this.setState({ loading: true });
      const result = await getHistory(param);
      if (result.data.result === "success") {
        var historyTemp = result.data.data;
        this.setState({
          historyData: historyTemp
        });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    }
  }

  getWeekData = async () => {
    try {
      const result = await getweekdata();
      if (result.data.result === "success") {
        this.setState({ weekList: result.data.data });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
    } catch (err) {
      ToastsStore.error("Something Went wrong");
    };
  }

  getTags = async () => {
    try {
      const result = await gettags();
      if (result.data.result === "success") {
        this.setState({ tags: result.data.data });
      } else if (result.data.result === "warning") {
        ToastsStore.warning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          ToastsStore.error(result.data.message);
          this.signout();
        } else {
          ToastsStore.error(result.data.message);
        }
      }
    } catch (err) {
      ToastsStore.error("Something Went wrong");
    };
  }

  // getMentors = async() => {
  //   let param = {
  //     email: localStorage.getItem('email')
  //   }
  //   try {
  //     this.setState({loading: true});
  //     const result = await getallmentors(param);
  //     if (result.data.result === "success") {
  //       this.setState({
  //         loading: false,
  //         mentors: result.data.data,
  //       });
  //     } else if (result.data.result === "warning") {
  //       ToastsStore.warning(result.data.message);
  //     } else {
  //       if (result.data.message === "Token is Expired") {
  //         ToastsStore.error(result.data.message);
  //         this.signout();
  //       } else if (result.data.message === "Token is Invalid") {
  //         ToastsStore.error(result.data.message);
  //         this.signout();
  //       } else if (result.data.message === "Authorization Token not found") {
  //         ToastsStore.error(result.data.message);
  //         this.signout();
  //       } else {
  //         ToastsStore.error(result.data.message);
  //       }
  //     }
  //     this.setState({loading: false});
  //   } catch(err) {
  //     this.setState({loading: false});
  //     ToastsStore.error("Something Went wrong");
  //   };
  // }

  // getHistoryList(e, value) {
  //   this.getMentors(value);
  // }

  onChangeMentor(e) {
    const { param } = this.state;
    let temp = param;
    temp.mentor_id = e.target.value;
    this.setState({ param: temp });
    this.getHistoryList();
  }

  onChangeCategory(e) {
    const { param } = this.state;
    let temp = param;
    temp.tag_id = e.target.value;
    this.setState({ param: temp });
    this.getHistoryList();
  }

  onChangeDate(e) {
    const { param } = this.state;
    let temp = param;
    temp.time = e.target.value;
    this.setState({ param: temp });
    this.getHistoryList();
  }

  signout = async () => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        this.removeSession();
      } else if (result.data.result === "warning") {
        this.removeSession();
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
        } else if (result.data.message === "Token is Invalid") {
          this.removeSession();
        } else if (result.data.message === "Authorization Token not found") {
          this.removeSession();
        } else {
          this.removeSession();
        }
      }
    } catch (error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
    this.props.history.push('/');
  }

  render() {
    const { loading, historyData, weekList, tags, mentors } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
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
                <label style={{ paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px" }}>
                  Date:
                </label>
                <FormSelect style={{ height: "30px", width: "180px", marginRight: "10px" }} onChange={(e) => this.onChangeDate(e)}>
                  <option>Select Date</option>
                  {weekList.map((item, idx) =>
                    <option key={idx}>{item}</option>
                  )}
                </FormSelect>
                {/* <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                  Sessions:
                </label>
                <FormSelect style={{height: "30px", width: "80px", marginRight: "10px"}}>
                  <option>All</option>
                  <option>...</option>
                </FormSelect> */}
                <label style={{ paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px" }}>
                  Category:
                </label>
                <FormSelect style={{ height: "30px", width: "130px", marginRight: "10px" }} onChange={(e) => this.onChangeCategory(e)}>
                  <option>Select category</option>
                  {tags && tags.map((item, idx) =>
                    <option key={idx}>{item.name}</option>
                  )}
                </FormSelect>
                {/* <label style={{paddingTop: "5px", fontSize: "14px", color: "#333333", paddingRight: "10px"}}>
                  Mentor:
                </label>
                <FormSelect style={{height: "30px", width: "120px", marginRight: "10px"}} onChange={(e) => this.onChangeMentor(e)}>
                  <option>Select mentor</option>
                  {mentors && mentors.map((item, idx) =>
                    <option key={idx} value={item.id}>{item.name}</option>
                  )}
                </FormSelect> */}
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                {historyData.map((history, idx) => {
                  return (
                    <Col xl="4" lg="4" sm="6">
                      <HistoryCard id={idx} data={history} />
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
}