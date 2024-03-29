import React from "react";
import { Container, Row, Col, Button, Card, CardBody } from "shards-react";
import { Link } from "react-router-dom";
import { ToastsStore } from 'react-toasts';
import Review from "../components/common/Review"
import SubscribeModal from "../components/common/SubscribeModal"
import LoadingModal from "../components/common/LoadingModal";
import AddNewCard from "../components/common/AddNewCard";
import StarIcon from "../images/star_icon.svg";
import Lightening from "../images/Lightening.svg";
import PlayIcon from "../images/Play_icon.svg";
import Clock from "../images/Clock.svg";
import SubscriperImg from "../images/Users.svg"
import avatar from "../images/avatar.jpg"
import { getuserinfobyid, signout } from '../api/api';

export default class Subscribe extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      subscriptionOpen: false,
      addnewcardModal: false,
      mentorData: {},
    }
  }

  componentWillMount() {
    this.getUserInfo(this.props.match.params.id);
  }

  getUserInfo = async (id) => {
    try {
      this.setState({ loading: true });
      const result = await getuserinfobyid({ id: id });
      if (result.data.result === "success") {
        this.setState({ mentorData: result.data.data });
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
    };
  }

  toggle_unsubscribe() {
    this.setState({
      subscriptionOpen: !this.state.subscriptionOpen
    });
  }

  toggle_modal() {
    this.setState({
      addnewcardModal: !this.state.addnewcardModal,
      subscriptionOpen: !this.state.subscriptionOpen
    });
  }

  toggle_addnewcardmodal() {
    this.setState({
      addnewcardModal: !this.state.addnewcardModal,
    });
  }

  actionSuccess() {

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
    const { mentorData, loading, subscriptionOpen, addnewcardModal } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <Card small className="specific-subsciption-card">
            <CardBody>
              <Row>
                <Link to="/subscriptions" className="hidden-underline">
                  <Button className="btn-back-scriptions">
                    Back
                </Button>
                </Link>
              </Row>
              <Row>
                <Col xl="3" className="subscription-mentor-detail">
                  <div>
                    {mentorData.avatar && <img src={mentorData.avatar} style={{ width: "206px", height: "206px" }} alt="User Avatar" />}
                    {!mentorData.avatar && <img src={avatar} style={{ width: "206px", height: "206px" }} alt="User Avatar" />}
                    <div style={{ display: "flex", padding: "20px 0px" }}>
                      <img src={SubscriperImg} style={{ width: "22px", marginRight: "10px" }} alt="Subscribe" />
                      <h6 className="no-margin" style={{ paddingRight: "70px" }}>Subscribers</h6>
                      <h6 className="no-margin" style={{ fontWeight: "bold" }}>{mentorData.sub_count}</h6>
                    </div>
                    <Button className="btn-subscription-unsubscribe" onClick={() => this.toggle_unsubscribe()}>
                      Subscription ${mentorData.sub_plan_fee}/month
                  </Button>
                  </div>
                </Col>
                <Col xl="9" lg="12" className="subscription-mentor-videos no-padding-left">
                  <div className="subscription-mentor-desc no-padding">
                    <div className="mentor-detail-desc">
                      <Row className="metor-detail-name-score">
                        <div className="mentor-detail-name" style={{ fontSize: "30px" }}>{mentorData.name}</div>
                        <div style={{ fontSize: "20px", fontWeight: "bold", display: "flex" }}>
                          <img src={StarIcon} alt="star-icon" className="mentor-detail-score" />
                          <h6 style={{ paddingTop: "10px", fontSize: "20px", fontWeight: "bold", color: "#333333" }}>{mentorData.average_mark}</h6>
                          <h6 style={{ paddingTop: "10px", fontSize: "18px", paddingLeft: "5px", color: "#333333" }}>({mentorData.review_count} reviews)</h6>
                        </div>
                      </Row>
                      <Row className="mentor-detail-subject-tag">
                        <h5 className="tag-title mentor-detail-subject-title">Teaches: </h5>
                        {mentorData.tags &&
                          mentorData.tags.map((tag, idx) => {
                            if (idx < 3)
                              return <p key={idx} className="brainsshare-tag" title={tag}>{tag}</p>
                            else if (idx === 3)
                              return <p key={idx}>{mentorData.tags.length - 3} more</p>
                            else
                              return <></>;
                          })}
                      </Row>
                      <Row className="mentor-detail-subject-tag">
                        <h5 className="tag-title mentor-detail-subject-title">Level: </h5>
                        {mentorData.expertise === 1 && <p>Entry Level</p>}
                        {mentorData.expertise === 2 && <p>Intermediate</p>}
                        {mentorData.expertise === 3 && <p>Expert</p>}
                      </Row>
                      <Row className="mentor-detail-subject-tag">
                        <h5 className="tag-title mentor-detail-subject-title" style={{ width: 150 }}>Mentor Since: </h5>

                      </Row>
                      <div className="mentor-detail-myself" style={{ marginTop: 30 }}>
                        {mentorData.description !== "" && <p>{mentorData.description}...</p>}
                        <p>{mentorData.description}</p>
                      </div>
                      <div className="mentor-detail-video">
                        <a href={mentorData.video_url} target="_blank" rel="noopener noreferrer"><img src={PlayIcon} alt="play-icon" />Video presentation</a>
                      </div>
                    </div>
                    <div className="mentor-deatail-rate-buttons">
                      <Row className="center">
                        <p>
                          $ {mentorData.hourly_price} / 60 min
                      </p>
                      </Row>
                      <Row className="center">
                        {mentorData.instant_call ? <Button className="btn-mentor-detail-instant" onClick={() => this.handleAvailableNow()}>
                          <img src={Lightening} alt="Lightening" />
                        Available now
                      </Button> : <></>}
                      </Row>
                      <Row className="center">
                        <Button className="btn-mentor-detail-book">
                          <img src={Clock} alt="Clock" />
                        Book a session
                      </Button>
                      </Row>
                    </div>
                  </div>
                  <div style={{ display: "flex", paddingLeft: "30px", paddingTop: "20px" }}>
                    <h6 style={{ paddingTop: "10px", paddingRight: "20px", fontSize: "20px", fontWeight: "bold", color: "#333333" }}>Review</h6>
                    <img src={StarIcon} alt="star-icon" className="mentor-detail-score" />
                    <h6 style={{ paddingTop: "10px", fontSize: "20px", fontWeight: "bold", color: "#333333" }}>{mentorData.average_mark}</h6>
                  </div>
                  <div className="reviews-container">
                    {mentorData.student &&
                      mentorData.student.map((item, idx) => (
                        <Review key={idx} item={item} />
                      ))
                    }
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          {/* <SubscribeModal item={mentorData} open={subscriptionOpen} actionSuccess={this.actionSuccess} toggle_modal={() => this.toggle_modal()} toggle={() => this.toggle_unsubscribe()} /> */}
          {subscriptionOpen &&
            <SubscribeModal item={mentorData} open={subscriptionOpen} actionSuccess={this.actionSuccess} toggle_modal={() => this.toggle_modal()} toggle={() => this.toggle_unsubscribe()} />
          }
          <AddNewCard toggle={() => this.toggle_addnewcardmodal()} open={addnewcardModal}></AddNewCard>
        </Container>
      </>
    );
  }
}