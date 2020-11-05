import React from "react";
import { Container, Row, Col, Card, CardBody } from "shards-react";
import { getintroduceinfo } from '../api/api';
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import MentorVideo from "../components/common/MentorVideo";
import avatar from "../images/avatar.jpg"

import SubscriperImg from "../images/Users.svg"

export default class MySharePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userInfo: []
    };
  }

  componentWillMount() {
    this.getuserinfo();
  }

  getuserinfo = async() => {
    console.log(window.location.pathname);
    let param = {
      alias: window.location.pathname.split("/person/")[1]
    }
    try {
      this.setState({loading: true});
      const result = await getintroduceinfo(param);
      if (result.data.result === "success") {
        this.setState({userInfo: result.data.data});
      } else if (result.datat.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
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
  
  copyLink = () => {
    const link = window.location.protocol + '//' + window.location.host + '/name/' + localStorage.getItem("user_name");
    var textField = document.createElement('textarea');
    textField.innerText = link;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

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
        onScreeen: false,
        waitForAnimation: false,
        showIcon: false,
        pauseOnHover: false
      }
    });
  }

  render() {
    const { userInfo, loading } = this.state;
    return (
      <>
      {loading && <LoadingModal open={true} />}
      <ReactNotification />
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <Row noGutters className="page-header py-4">
            <Col className="page-title">
              <h3>{userInfo.name}</h3>
            </Col>
          </Row>
          <Card small className="share-page-card">
            <CardBody>
              <Row>
                <Col xl="3" className="subscription-mentor-detail">
                  <div>
                    {userInfo.avatar && <img className="avatar" src={userInfo.avatar} alt="avatar"/>}
                    {!userInfo.avatar && <img className="avatar" src={avatar} alt="avatar"/>}
                    <div style={{display: "flex", padding: "20px 0px"}}>
                      <img src={SubscriperImg} style={{width: "22px", marginRight: "10px"}} alt="icon"/>
                      <h6 className="no-margin" style={{paddingRight: "70px"}}>Subscribers</h6>
                      <h6 className="no-margin"style={{fontWeight: "bold"}}>{userInfo.sub_count}</h6>
                    </div>
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
};
