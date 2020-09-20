import React from "react";
import { Container, Row, Col, Button, Card, CardBody } from "shards-react";
import { Link } from "react-router-dom";
import { getuserinfobyid, unsubscription } from '../api/api';
import MentorVideo from "../components/common/MentorVideo";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import avatar from "../images/avatar.jpg"
import SubscriperImg from "../images/Users.svg"

export default class SpecificSubscription extends React.Component {
  constructor(props) {
    super(props);

      this.state = {
        loading: false,
        userInfo: {},
      }
    }

    componentWillMount() {
      this.getUserInfo(this.props.match.params.id);
    }

    getUserInfo = async(id) => {
      let param = {id: id};

      try {
        this.setState({loading: true});
        const result = await getuserinfobyid(param);
        if (result.data.result === "success") {
          this.setState({
            userInfo: result.data.data
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

    handleUnSub = async() => {
      let param = {
        mentor_id: this.props.match.params.id,
        email: localStorage.getItem('email')
      };

      try {
        this.setState({loading: true});
        const result = await unsubscription(param);
        if (result.data.result === "success") {
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
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      localStorage.removeItem('user-type');
      localStorage.removeItem('ws');
    }

    render() {
      const {loading, userInfo} = this.state;
      return (
        <>
          {loading && <LoadingModal open={true} />}
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
                      <h2>{userInfo.name}</h2>
                      {userInfo.avatar && <img className="avatar" src={userInfo.avatar} alt="avatar"/>}
                      {!userInfo.avatar && <img className="avatar" src={avatar} alt="avatar"/>}
                      <div style={{display: "flex", padding: "20px 0px"}}>
                        <img src={SubscriperImg} style={{width: "22px", marginRight: "10px"}}/>
                        <h6 className="no-margin" style={{paddingRight: "70px"}}>Subscribers</h6>
                        <h6 className="no-margin"style={{fontWeight: "bold"}}>{userInfo.sub_count}</h6>
                      </div>
                      <Button className="btn-subscription-unsubscribe" onClick={() => this.handleUnSub()}>
                        Unsubscribe
                      </Button>
                    </div>
                  </Col>
                  <Col xl="9" lg="12" className="subscription-mentor-videos">
                    {userInfo.share_info && userInfo.share_info.map((item, idx) =>
                      <MentorVideo key={idx} item={item} />
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>    
          </Container>
        </>
      )
    }
  }