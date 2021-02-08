import React from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, FormSelect } from "shards-react";
import HistoryCard from "../components/common/HistoryCard"
import SmallCardForum from "../components/common/SmallCardForum";
import LoadingModal from "../components/common/LoadingModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { getHistory, getweekdata, gettags, signout } from '../api/api';
import { ToastsStore } from 'react-toasts';
import moment from 'moment';
moment.locale('en');

export default class MentorHistory extends React.Component {
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
      }, 
      ModalConfirmOpen: false, 
      id: '', 
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
        var historyTemps = result.data.data;
        historyTemps.forEach(historyTemp => {
          historyTemp.from = moment(historyTemp.forum_start * 1000).format("YYYY-MM-DD h:mm:ss");
          historyTemp.to = moment(historyTemp.forum_end * 1000).format("YYYY-MM-DD h:mm:ss");
          historyTemp.day = moment(historyTemp.forum_start * 1000).format("DD/MM/YY");
          historyTemp.from_time = moment(historyTemp.forum_start * 1000).format("h:mm a");          
          historyTemp.to_time = moment(historyTemp.forum_end * 1000).format("h:mm a");
        });
        this.setState({
          historyData: historyTemps
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

  onChangeMentor(e) {
    let { param } = this.state;
    param.mentor_id = e.target.value;
    this.setState({ param });
    this.getHistoryList();
  }

  onChangeCategory(e) {
    let { param } = this.state;
    param.tag_id = e.target.value;
    this.setState({ param });
    this.getHistoryList();
  }

  onChangeDate(e) {
    let { param } = this.state;
    param.time = e.target.value;
    this.setState({ param });
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

  toggle_remove(id) {    
    this.setState({
      ModalConfirmOpen: !this.state.ModalConfirmOpen,
      id: id
    });
    // this.getForums();
  }

  toggle_confirm(id) {    
    this.setState({
      ModalConfirmOpen: !this.state.ModalConfirmOpen,
      id: id
    });
    // this.getForums();
  }

  render() {
    const { loading, historyData, weekList, tags, ModalConfirmOpen, id } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <Row noGutters className="page-header py-4">
            <Col xs="12" sm="12" className="mentor-history-page-title">
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
                      <SmallCardForum 
                        id={idx}
                        item={history}
                        history={true}
                        toggle_confirm={(id) => this.toggle_remove(id)}
                      />
                    </Col>
                  )
                })}
              </Row>
            </CardBody>
          </Card>
        </Container>
        <ConfirmModal open={ModalConfirmOpen} id={id} toggle={() => this.toggle_confirm()} toggle_remove = {() => this.toggle_remove() }></ConfirmModal>
      </>
    )
  }
}