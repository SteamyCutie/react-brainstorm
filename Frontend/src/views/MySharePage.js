import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card, CardBody } from "shards-react";
import { mysharepage } from '../api/api';
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import MentorVideo from "../components/common/MentorVideo";

import MentorAvatar from "../images/Rectangle_Rayna_big.png"
import SubscriperImg from "../images/Users.svg"
import LinkImg from "../images/Link.svg"

export default class MySharePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      infoList: []
    };
  }

  componentWillMount() {
    this.getMyInformation();
  }

  getMyInformation = async() => {
    try {
      this.setState({loading: true});
      const result = await mysharepage({email: localStorage.getItem('email')});
      if (result.data.result == "success") {
        this.setState({infoList: result.data.data});
      } else {
        this.showFail();
      }
      this.setState({loading: false});
    } catch(err) {
      this.setState({loading: false});
      this.showFail();
    };
  }
  
  copyLink = () => {
    const link = window.location.protocol + '//' + window.location.host;
    var textField = document.createElement('textarea');
    textField.innerText = link;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  showSuccess() {
    store.addNotification({
      title: "Success",
      message: "Action Success!",
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

  showFail() {
    store.addNotification({
      title: "Success",
      message: "Action Success!",
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

  render() {
    return (
      <>
      {this.state.loading && <LoadingModal open={true} />}
      <ReactNotification />
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <Row noGutters className="page-header py-4">
            <Col className="page-title">
              <h3>My share page</h3>
            </Col>
          </Row>
          <Card small className="share-page-card">
            <CardBody>
              <Row>
                <Col xl="3" className="subscription-mentor-detail">
                  <div>
                    <img src={MentorAvatar} />
                    <div style={{display: "flex", padding: "20px 0px"}}>
                      <img src={SubscriperImg} style={{width: "22px", marginRight: "10px"}}/>
                      <h6 className="no-margin" style={{paddingRight: "70px"}}>Subscribers</h6>
                      <h6 className="no-margin"style={{fontWeight: "bold"}}>24</h6>
                    </div>
                  </div>
                </Col>
                <Col xl="9" lg="12" className="subscription-mentor-videos">
                  <h6 className="profile-link-url">
                    <a href="javascript:void(0)" onClick={() => this.copyLink()} title="Copy Link"><img src={LinkImg} alt="link" className="profile-link-image" /></a>
                    <a href="javascript:void(0)">www.brainsshare.com/kiannapress</a>
                  </h6>
                  {this.state.infoList.map((item, idx) => 
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
