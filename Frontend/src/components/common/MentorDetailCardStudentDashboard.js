import React from "react";
import { Button, Row, Col, Card, CardBody } from "shards-react";
import MentorVideo from "../../components/common/MentorVideo";
import SubscribeModal from "../../components/common/SubscribeModal";
import AddNewCard from "../../components/common/AddNewCard";
import StarIcon from "../../images/star_icon.svg";
import PlayIcon from "../../images/Play_icon.svg";
import Lightening from "../../images/Lightening.svg";
import SubscriperImg from "../../images/Users.svg";
import Clock from "../../images/Clock.svg";
import defaultavatar from "../../images/avatar.jpg";
import { unsubscription, accociateUser } from '../../api/api';
import LoadingModal from "../../components/common/LoadingModal";
import { ToastsStore } from 'react-toasts';

class MentorDetailCardStudentDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      more: false,
      teaches: [],
      subscriptionOpen: false,
      addnewcardModal: false,
      loading: false,
    }
  }

  componentWillMount() {
  }

  handleInstantLive(id) {
    const { callwithdescription } = this.props;
    callwithdescription(id);
  }

  handleBookSession(id) {
    const { toggle } = this.props;
    toggle(id);
  }

  handleAssociate = async (id) => {
    let param ={
      request_id: localStorage.getItem('user_id'),
      response_id: id
    };

    try {
      this.setState({ loading: true });
      const result = await accociateUser(param);
      if (result.data.result === "success") {
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

  readMore() {
    this.setState({ more: true });
  }

  readLess() {
    this.setState({ more: false });
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

  handleUnSub = async (id) => {
    let param = {
      mentor_id: id,
      email: localStorage.getItem('email')
    };

    try {
      this.setState({ loading: true });
      const result = await unsubscription(param);
      if (result.data.result === "success") {
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

  actionSuccess() {
  }

  onDetailCardClick() {
    const { onMentorDetailCardClick } = this.props;
    onMentorDetailCardClick(this.props.mentorData);
  }

  render() {
    const { id, name, avatar, tag_name, is_mentor, status, description, hourly_price, instant_call, video_url, average_mark, share_info, sub_count, sub_plan_fee, sub_id, subscribe, associate } = this.props.mentorData;
    const { subscriptionOpen, loading } = this.state;

    return (
      <>
        {loading && <LoadingModal open={true} />}
        <div className="mentor-detail-card" onClick={() => this.onDetailCardClick()}>
          <div style={{ position: "relative" }} className="mentor-detail-avatar">
            {avatar && <img src={avatar} alt={name} className="mentor-detail-avatar-img" />}
            {!avatar && <img src={defaultavatar} alt={name} className="mentor-detail-avatar-img" />}
            {
              status === 1 && <div className="carousel-component-online-class"></div>
            }
          </div>
          <div className="mentor-detail-desc">
            <Row className="metor-detail-name-score">
              <div className="mentor-detail-name">{name}</div>
              {is_mentor ? <div><img src={StarIcon} alt="star-icon" className="mentor-detail-score"/>{average_mark}</div> : null}
            </Row>
            {is_mentor ? 
              <Row className="mentor-detail-subject-tag">
                <h5 className="tag-title mentor-detail-subject-title">Teaches: </h5>
                {tag_name && tag_name.map((teach, idx) => {
                  if (idx < 3)
                    return <p key={idx} className="brainsshare-tag" title={teach}>{teach}</p>;
                  else if (idx === 3)
                    return <p key={idx}>{tag_name.length - 3} more</p>
                  else 
                    return <></>;
                })}
              </Row>
              : null 
            }
            <div className="mentor-detail-myself">
              {!this.state.more && (description.length > 200 ? <p>{description.slice(0,200)}...</p> : <p>{description}</p>)}
              {this.state.more && <p>{description}</p>}
              {description.length > 200 && (this.state.more ? <a href="javascript:void(0)" className="read-more" onClick={() => this.readLess()}>Read less</a> : <a href="javascript:void(0)" className="read-more" onClick={() => this.readMore()}>Read more</a>)}
            </div>
            {is_mentor ?
              <div className="mentor-detail-video">
                <a href={video_url} target="_blank" rel="noopener noreferrer" ><img src={PlayIcon} alt="play-icon" />Video presentation</a>
              </div>
              : null
            }
          </div>
          {/* {is_mentor ? */}
          <div className="mentor-deatail-rate-buttons">
            <Row className="center">
              <p>
                $ {hourly_price} / 60 min
              </p>
            </Row>
            {status ?
              <Row className="center">
                {instant_call ? <Button className="btn-mentor-detail-instant" onClick={() => this.handleInstantLive(id)}>
                  <img src={Lightening} alt="Lightening" />
                  Available now
                </Button> : <></>}
              </Row>
              : null
            }
            <Row className="center">
              <Button style={{ marginBottom: 10 }} className="btn-mentor-detail-book" onClick={() => this.handleBookSession(id)}>
                <img src={Clock} alt="Clock" />
                Book a session
              </Button>
            </Row>
            {!associate ? 
              <Row className="center">
                <Button style={{ marginBottom: 10 }} className="btn-mentor-detail-book" onClick={() => this.handleAssociate(id)}>
                  <img src={Clock} alt="Clock" />
                  Associate
                </Button>
              </Row>
              : null
            }
          </div>
          {/* //   : null
        // } */}
        </div>
        {/* {is_mentor ? */}
        <div style={{ paddingRight: 0, paddingLeft: 0, marginBottom: "20px" }}>
          <Card small className="share-page-card">
            <CardBody style={{ paddingLeft: 0 }}>
              <Row>
                <Col xl="3" className="subscription-mentor-detail">
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: 30, fontWeight: 'bold', color: '#333333' }}>{name}</h3>
                    <h3 style={{ fontSize: 30, fontWeight: 'bold', color: '#333333' }}>Share Page</h3>
                    {avatar && <img className="mentor-detail-avatar-img" src={avatar} alt="avatar" />}
                    {!avatar && <img className="mentor-detail-avatar-img" src={defaultavatar} alt="avatar" />}
                    <div style={{ display: "flex", padding: "20px 0px" }}>
                      <img src={SubscriperImg} style={{ width: "22px", marginRight: "10px" }} alt="icon" />
                      <h6 className="no-margin" style={{ paddingRight: "70px" }}>Subscribers</h6>
                      <h6 className="no-margin" style={{ fontWeight: "bold" }}>{sub_count}</h6>
                    </div>
                    {!subscribe ?
                      <Button className="btn-subscription-unsubscribe" onClick={() => this.toggle_unsubscribe()}>
                        Subscription ${sub_plan_fee}/month </Button>
                      : <Button className="btn-subscription-unsubscribe" onClick={() => this.handleUnSub(id)}>
                        Unsubscription
                      </Button>
                    }
                  </div>
                </Col>
                <Col xl="9" lg="12" className="subscription-mentor-videos">
                  {share_info && share_info.map((item, idx) =>
                    <MentorVideo key={idx} item={item} />
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
        {/* : null
      } */}
        {/* <SubscribeModal item={this.props.mentorData} open={subscriptionOpen} actionSuccess={this.actionSuccess} toggle_modal={() => this.toggle_modal()} toggle={() => this.toggle_unsubscribe()} /> */}
        {subscriptionOpen &&
          <SubscribeModal item={this.props.mentorData} open={subscriptionOpen} actionSuccess={this.actionSuccess} toggle_modal={() => this.toggle_modal()} toggle={() => this.toggle_unsubscribe()} />
        }
        <AddNewCard toggle={() => this.toggle_addnewcardmodal()} open={this.state.addnewcardModal}></AddNewCard>
      </>
    );
  }
}

export default MentorDetailCardStudentDashboard;
