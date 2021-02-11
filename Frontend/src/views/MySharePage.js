import React from "react";
import { Container, Row, Col, Card, CardBody } from "shards-react";
import moment from "moment";
import { getuserinfobyid, signout } from '../api/api';
import LoadingModal from "../components/common/LoadingModal";
import { ToastsStore } from 'react-toasts';
import MentorVideo from "../components/common/MentorVideo";
import avatar from "../images/avatar.jpg";
import SubscriperImg from "../images/Users.svg";
import LinkImg from "../images/Link.svg";

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

  getuserinfo = async () => {
    let param = {
      id: localStorage.getItem('user_id')
    }
    try {
      this.setState({ loading: true });
      const result = await getuserinfobyid(param);
      if (result.data.result === "success") {
        this.setState({ userInfo: result.data.data });
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

  copyLink = () => {
    const link = window.location.protocol + '//' + window.location.host + '/person/' + this.state.userInfo.alias;
    var textField = document.createElement('textarea');
    textField.innerText = link;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    ToastsStore.info("Link Copied");
  };

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

  getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  isImage(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
        //etc
        return true;
      default:
    }
    return false
  }

  isVideo(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        // etc
        return true;
      default:
    }
    return false
  }

  render() {
    const { userInfo, loading } = this.state;
    return (
      <div style={{marginTop: "40px"}}>
        {loading && <LoadingModal open={true} />}
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
                    {userInfo.avatar && <img className="avatar" src={userInfo.avatar} alt="avatar" />}
                    {!userInfo.avatar && <img className="avatar" src={avatar} alt="avatar" />}
                    <div style={{ display: "flex", padding: "20px 0px" }}>
                      <img src={SubscriperImg} style={{ width: "22px", marginRight: "10px" }} alt="icon" />
                      <h6 className="no-margin" style={{ paddingRight: "70px" }}>Subscribers</h6>
                      <h6 className="no-margin" style={{ fontWeight: "bold" }}>{userInfo.sub_count}</h6>
                    </div>
                  </div>
                </Col>
                <Col xl="9" lg="12" className="subscription-mentor-videos">
                  <h6 className="profile-link-url">
                    <a href="javascript:void(0)" onClick={() => this.copyLink()} title="Copy Link"><img src={LinkImg} alt="link" className="profile-link-image" /></a>
                    <a href="javascript:void(0)" style={{ color: '#018ac0' }}>www.Brainsshare.com/{localStorage.getItem("user_name")}</a>
                  </h6>
                  {userInfo.share_info && userInfo.share_info.map((item, idx) =>
                    <MentorVideo key={idx} item={item} />
                  )}
                  {userInfo.forum_info && userInfo.forum_info.map((item, idx) => {
                    return (
                      <div key={idx} className="open-forum">
                        <div style={{display: "flex"}}>
                          <label className="title">{item.title}</label>
                          <label className="price">20$</label>
                        </div>
                        <div style={{paddingLeft: "10px"}}>
                          <label className="description">{item.description}</label>
                          <label>Age Limitation: <label className="content">{item.age_limitation}</label></label>
                          <div>
                            <label className="time">From: <label className="content">{moment.unix(parseInt(item.forum_start)).format("YYYY-MM-DD hh:mm")}</label></label>
                            <label className="time">To: <label className="content">{moment.unix(parseInt(item.forum_end)).format("YYYY-MM-DD hh:mm")}</label></label>
                          </div>
                          <label>Language: <label className="content">{item.language}</label></label>
                          <div style={{display: "flex"}}>
                            <label style={{marginRight: "15px"}}>Categories: </label>
                            {item.tags_name.map((tag, idx) => {
                              return <p key={idx} className="tag content" title={tag}>{tag}</p>;
                            })}
                          </div>
                          <div style={{display: "flex"}}>
                            <label style={{marginRight: "15px"}}>Files: </label>
                            {item.attachments.map((attachment, idx) => {
                              return (
                                <div style={{display: "grid", margin: "2px 5px"}}>
                                  {this.isImage(attachment.origin_name) && <img src={attachment.path} alt={attachment.origin_name} className="open-forum-file-preview"/>}
                                  {this.isVideo(attachment.origin_name) && <video src={attachment.path} />}
                                  {(!this.isImage(attachment.origin_name) && !this.isVideo(attachment.origin_name)) && <div className="open-forum-file-preview">{this.getExtension(attachment.origin_name)}</div>}
                                  <a download href={attachment.path} key={idx} className="attachment" title={attachment.origin_name}>{attachment.origin_name}</a>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="sperator"/>
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
};
