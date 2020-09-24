import React from "react";
import { Container, Row, Col, Button, Card, CardBody } from "shards-react";
import { Link } from "react-router-dom";
import { store } from 'react-notifications-component';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
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
import { getuserinfobyid } from '../api/api';

export default class Subscribe extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      subscriptionOpen: false,
      addnewcardModal: false,
      mentorData: {} 
    }
  }

  componentWillMount() {
    this.getUserInfo(this.props.match.params.id);
  }

  getUserInfo = async(id) => {
    try {
      this.setState({loading: true});
      const result = await getuserinfobyid({id: id});
      if (result.data.result === "success") {
        this.setState({mentorData: result.data.data});
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

  removeSession() {
    localStorage.clear();
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
    const { mentorData } = this.state;
    return (
      <>
      {this.state.loading && <LoadingModal open={true} />}
      <ReactNotification />
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
                  {mentorData.avatar && <img src={mentorData.avatar} style={{width: "206px", height: "206px"}} alt="User Avatar"/>}
                  {!mentorData.avatar && <img src={avatar} style={{width: "206px", height: "206px"}} alt="User Avatar"/>}
                  <div style={{display: "flex", padding: "20px 0px"}}>
                    <img src={SubscriperImg} style={{width: "22px", marginRight: "10px"}}  alt="Subscribe"/>
                    <h6 className="no-margin" style={{paddingRight: "70px"}}>Subscribers</h6>
                    <h6 className="no-margin"style={{fontWeight: "bold"}}>{mentorData.sub_count}</h6>
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
                      <div className="mentor-detail-name" style={{fontSize: "30px"}}>{mentorData.name}</div>
                      <div style={{fontSize: "20px", fontWeight: "bold", display: "flex" }}>
                        <img src={StarIcon} alt="star-icon" className="mentor-detail-score"/>
                        <h6 style={{paddingTop: "10px", fontSize: "20px", fontWeight: "bold", color: "#333333"}}>{mentorData.average_review}</h6>
                        <h6 style={{paddingTop: "10px", fontSize: "18px", paddingLeft: "5px", color: "#333333"}}>({mentorData.count_review} reviews)</h6>
                      </div>
                    </Row>
                    <Row className="mentor-detail-subject-tag">
                      <h5 className="tag-title mentor-detail-subject-title">Teaches: </h5>
                      {mentorData.tags && 
                        mentorData.tags.map((tag, idx) => {
                          if (idx < 3)
                            return <p key={idx} className="brainsshare-tag" title={tag}>{tag}</p>
                          else if (idx === 3)
                            return <p key={idx} href="#!">{mentorData.tags.length - 3} more</p>
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
                      <h5 className="tag-title mentor-detail-subject-title" style={{width: 150}}>Mentor Since: </h5>
                      
                    </Row>
                    <div className="mentor-detail-myself" style={{marginTop: 30}}>
                      <p>{mentorData.description}...</p>
                    </div>
                    <div className="mentor-detail-video">
                      <a href={mentorData.video_url} target="_blank" rel="noopener noreferrer"><img src={PlayIcon} alt="play-icon"/>Video presentation</a>
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
                        <img src={Lightening} alt="Lightening"/>
                        Available now
                      </Button> : <Button disabled className="btn-mentor-detail-instant">
                        <img src={Lightening} alt="Lightening" />
                        Available now
                      </Button>}
                    </Row>
                    <Row className="center">
                      <Button className="btn-mentor-detail-book">
                        <img src={Clock} alt="Clock" />
                        Book a session
                      </Button>
                    </Row>
                  </div>
                </div>
                <div style={{display: "flex", paddingLeft: "30px", paddingTop: "20px"}}>
                  <h6 style={{paddingTop: "10px", paddingRight: "20px", fontSize: "20px", fontWeight: "bold", color: "#333333"}}>Review</h6>
                  <img src={StarIcon} alt="star-icon" className="mentor-detail-score"/>
                  <h6 style={{paddingTop: "10px", fontSize: "20px", fontWeight: "bold", color: "#333333"}}>{mentorData.average_review}</h6>
                </div>
                <div className="reviews-container">
                {mentorData.student && 
                  mentorData.student.map((item, idx) => (
                    <Review key={idx} item={item}/>
                  ))
                }
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <SubscribeModal item={mentorData} open={this.state.subscriptionOpen} actionSuccess={this.actionSuccess} toggle_modal={() => this.toggle_modal()} toggle={() => this.toggle_unsubscribe()} />
        <AddNewCard toggle={() => this.toggle_addnewcardmodal()} open={this.state.addnewcardModal}></AddNewCard>
      </Container>
      </>
    );
  }
}