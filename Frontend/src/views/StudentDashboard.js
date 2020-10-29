import React from "react";
import { Container, Row, Col, Button } from "shards-react";
import Pagination from '@material-ui/lab/Pagination';
import AdSense from 'react-adsense';
import MentorDetailCardStudentDashboard from "./../components/common/MentorDetailCardStudentDashboard";
import BookSession from "./../components/common/BookSession";
import OutcomingCallDesc from "./../components/common/OutcomingCallDesc";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

import media_url from "../video/video.mp4";
import DashboardVideoAvatar from "../images/dashboard-video-avatar.svg"
import DashboardVideoAvatarMini from "../images/dashboard-video-avatar-mini.svg"
import MiniEndCall from '../images/many2many-mini-end.svg'
import MiniFullScreen from '../images/maximize.png'
import MiniMuteMic from '../images/many2many-mini-mute-mic.svg'
import MiniMutedMic from '../images/many2many-mini-muted-mic.svg'
import MiniMuteVideo from '../images/many2many-mini-mute-video.svg'
import MiniMutedVideo from '../images/many2many-mini-muted-video.svg'
import MiniChat from "../images/many2many-mini-chat.svg"
import MiniScreenshare from "../images/many2many-mini-screenshare.svg"
import MiniAddUser from "../images/many2many-mini-adduser.svg"
import FullScreen from "../images/dashboard-fullscreen.svg"
import MuteMic from "../images/dashboard-mute-mic.svg"
import MuteVideo from "../images/dashboard-mute-video.svg"
import Chat from "../images/dashboard-mute-video.svg"
import ScreenShare from "../images/dashboard-mute-screenshare.svg"
import AddUser from "../images/dashboard-mute-add-user.svg"
import EndCall from "../images/dashboard-mute-end.svg"

import { findmentorsbytagsorname, signout } from '../api/api';
export default class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.mentorRef = React.createRef();
    this.state = {
      id: 0,
      ModalOpen: false, 
      ModalCallWithDescOpen: false,
      totalCnt: 0,
      loading: false,
      mentors: [],
      callDescription: '', 
      width: '100%',
      height: '450'
    };

    this.sendUser = this.sendUser.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let categories = JSON.parse(localStorage.getItem('search-category'));
    let searchKey = (localStorage.getItem('search-key') === null ? "" : localStorage.getItem('search-key'));
    let searchParams = [];
    if (categories === null) {
      searchParams = [];
    } else {
      for (var i = 0; i < categories.length; i ++) {
        searchParams.push(categories[i].value);
      }
    }

    this.getParticipants(searchParams, searchKey, 1);
  }

  componentWillMount() {
    let categories = JSON.parse(localStorage.getItem('search-category'));
    let searchKey = (localStorage.getItem('search-key') === null ? "" : localStorage.getItem('search-key'));
    let searchParams = [];
    if (categories === null) {
      searchParams = [];
    } else {
      for (var i = 0; i < categories.length; i ++) {
        searchParams.push(categories[i].value);
      }
    }

    this.getParticipants(searchParams, searchKey, 1);
  }

  componentDidMount() {
    window.addEventListener('mousewheel', this.handleScroll);
  }

  handleScroll(event) {
    if (window.location.pathname === "/studentDashboard") {
      if (event.deltaY < 0)
      {
        if (window.pageYOffset <= 200) {
          if (!document.getElementById("video")) {
            if (document.getElementById("small-video"))
              document.getElementById("small-video").remove();

            var header = document.getElementsByClassName("page-header");
            var container = document.getElementsByClassName("main-content-container");
            var mainDiv = document.createElement("div");
            mainDiv.id = "dashboard-video-ads-container";
            mainDiv.className = "dashboard-video-ads-container";

            var participantVideo = document.createElement("video");
            var source = document.createElement("source");

            participantVideo.height = window.pageYOffset;
            participantVideo.controls = true;
            participantVideo.id = 'video';
            participantVideo.style = 'width: 100%';

            source.src = media_url;
            source.type = "video/mp4";
            participantVideo.appendChild(source);

            mainDiv.appendChild(participantVideo);

            container[0].insertBefore(mainDiv, header[0]);
          } else {
            var video = document.getElementById("video");
            video.height = 450;
          }
        }
      } else if (event.deltaY > 0) {
        let headerHeight = 94;
        if (document.getElementById("video")) {
          document.getElementById("video").height = document.getElementById("video").height - window.pageYOffset - headerHeight;

          if (document.getElementById("video").height <= 0) {
            document.getElementById("video").remove();

            var header = document.getElementsByClassName("page-header");
            var container = document.getElementsByClassName("main-content-container");
            var participantVideo = document.createElement("video");
            var source = document.createElement("source");
            participantVideo.style = "right: 24px; position: fixed; overflow-y: scroll; overflow-x: hidden; z-index: 100";
            participantVideo.controls = true;
            participantVideo.id = "small-video";

            source.src = media_url;
            source.type = "video/mp4";
            participantVideo.appendChild(source);

            container[0].insertBefore(participantVideo, header[0]);
          }
        }
      }
    }
  }

  sendUser(to, avatar, name) {
    this.props.setUser(to, avatar, name);
  }

  getParticipants = async(category, searchKey, pageNo) => {
    let param = {
      user_id: localStorage.getItem('user_id'),
      name: searchKey,
      tags_id: category,
      page: pageNo,
      rowsPerPage: 10
    }

    try {
      this.setState({loading: true});
      const result = await findmentorsbytagsorname(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          mentors: result.data.data,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
        });

        if (category.length) {
          document.getElementById("search-result-label").textContent = JSON.parse(localStorage.getItem('search-category'))[0].label + " mentors (" + result.data.data.length + ")";
        } else {
          if (searchKey) {
            document.getElementById("search-result-label").textContent = searchKey;
          } else {
            document.getElementById("search-result-label").textContent = "Top BrainsShare Mentors"
          }
        }

      } else if (result.data.result === "warning") {
        this.showWarning(result.data.message);
      } else {
        if (result.data.message === "Token is Expired") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.showFail(result.data.message);
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.showFail(result.data.message);
          this.signout();
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

  onChangePagination(e, value) {
    let categories = JSON.parse(localStorage.getItem('search-category'));
    let searchKey = (localStorage.getItem('search-key') === null ? "" : localStorage.getItem('search-key'));
    let searchParams = [];
    if (categories === null) {
      searchParams = [];
    } else {
      for (var i = 0; i < categories.length; i ++) {
        searchParams.push(categories[i].value);
      }
    }

    this.getParticipants(searchParams, searchKey, value);
  }

  signout = async() => {
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
    } catch(error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
    window.location.href = "/";
  }

  toggle(id) {
    this.setState({
      ModalOpen: !this.state.ModalOpen,
      id: id
    });
  }

  toggle_callwithdesc(id) {
    this.setState({
      ModalCallWithDescOpen: !this.state.ModalCallWithDescOpen,
      id: id
    });
  }

  setDescription(description) {
    this.setState({
      callDescription: description, 
    }, () => this.handleCall());
  }

  handleCall(){
    var callerInfo = {};
    var index;

    for (index = 0; index < this.state.mentors.length; index ++) {
      if(this.state.mentors[index].id === this.state.id) {
        callerInfo = this.state.mentors[index];
      }
    }

    console.log(callerInfo, this.state.callDescription);
    this.toggle_callwithdesc();
    
    this.props.setUser(callerInfo.email, callerInfo.avatar, callerInfo.name, callerInfo.channel_name, this.state.callDescription);
  }

  handleCancel(){
    this.toggle_callwithdesc();

    this.setState({
      callDescription: '', 
    });
  }

  handleCallEnd() {
    this.toggle_callwithdesc();

    this.setState({
      callDescription: '', 
    });
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
    const { loading, mentors, totalCnt, ModalOpen, ModalCallWithDescOpen, id, width, height } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <BookSession open={ModalOpen} toggle={() => this.toggle()} id={id}></BookSession>
        <OutcomingCallDesc 
          id={id}
          open={ModalCallWithDescOpen} 
          // onCall={() => this.handleCall()}
          onCancel={() => this.handleCancel()}
          onCallEnd={() => this.handleCallEnd()}
          // callwithdescription={() => this.toggle_callwithdesc()} 
          setDescription={(description) => this.setDescription(description)} 
        />
        <Container fluid className="main-content-container px-4 main-content-container-class">
          
          <div id="dashboard-video-ads-container" className="dashboard-video-ads-container">
            <img src={DashboardVideoAvatar} alt="Brains Share" className="dashboard-video-ads-avatar"/>
            <video id="video" autoPlay>
              <source src={media_url} type="video/mp4"></source>
            </video>  
            <div id="dashboard-video-ads-container-controls" className="dashboard-video-ads-container-controls">
              <Button className="btn-dashboard-control margin-right-auto">
                <img src={FullScreen} alt="Full Screen"/>
              </Button>
              
              <div className="">
                <Button className="btn-dashboard-control float-center">
                  <img src={MuteMic} alt="Mute mic"/>
                </Button>
                <Button className="btn-dashboard-control float-center">
                  <img src={MuteVideo} alt="Mute video"/>
                </Button>
                <Button className="btn-dashboard-control float-center">
                  <img src={Chat} alt="Chat"/>
                </Button>
                <Button className="btn-dashboard-control float-center">
                  <img src={ScreenShare} alt="Screen Share"/>
                </Button>
                <Button className="btn-dashboard-control float-center">
                  <img src={AddUser} alt="Add User"/>
                </Button>
              </div>
              
              <Button className="btn-room-call-decline margin-left-auto" style={{marginRight: "10px", padding: "0px"}}>
                <img src={EndCall} alt="End"/>
              </Button>
            </div>
          </div>
          <div id="dashboard-video-ads-container-small" className="dashboard-video-ads-container-small">
            <img src={DashboardVideoAvatarMini} alt="Brains Share" className="dashboard-video-ads-mini-avatar"/>
            <video width={width} id="video-small" autoPlay>
              <source src={media_url} type="video/mp4"></source>
            </video>
            <div id="dashboard-video-ads-container-small-controls" className="dashboard-video-ads-container-small-controls">
              <Button className="btn-dashboard-control-mini margin-right-auto">
                <img src={MiniFullScreen} alt="Full Screen"/>
              </Button>
              
              <div className="">
                <Button className="btn-dashboard-control-mini float-center">
                  <img src={MiniMuteMic} alt="Mute mic"/>
                </Button>
                <Button className="btn-dashboard-control-mini float-center">
                  <img src={MiniMuteVideo} alt="Mute video"/>
                </Button>
                <Button className="btn-dashboard-control-mini float-center">
                  <img src={MiniChat} alt="Chat"/>
                </Button>
                <Button className="btn-dashboard-control-mini float-center">
                  <img src={MiniScreenshare} alt="Screen Share"/>
                </Button>
                <Button className="btn-dashboard-control-mini float-center">
                  <img src={MiniAddUser} alt="Add User"/>
                </Button>
              </div>
              
              <Button className="btn-room-call-decline-mini margin-left-auto" style={{marginRight: "10px", padding: "0px"}}>
                <img src={MiniEndCall} alt="End"/>
              </Button>
            </div>
          </div>
          <Row noGutters className="page-header py-4">
            <Col xs="12" sm="12" className="page-title">
              <h3 id="search-result-label">Top Brainsshare mentors</h3>
            </Col>
            <AdSense.Google
              client='ca-pub-8022559137099901'
              slot='7806394673'
              style={{ width: 500, height: 300}}
              format='auto'
            />
          </Row>
          <Row className="no-padding">
            <Col lg="12" md="12" sm="12">
              {mentors.map((data, idx) =>(
                <MentorDetailCardStudentDashboard key={idx} ref={this.mentorRef} mentorData={data} sendUser={this.sendUser} toggle={(id) => this.toggle(id)} callwithdescription={(id) => this.toggle_callwithdesc(id)}/>
              ))}
            </Col>
          </Row>
          {mentors.length > 0 && <Row className="pagination-center">
            <Pagination count={totalCnt} onChange={(e, v) => this.onChangePagination(e, v)} color="primary" />
          </Row>}
        </Container>
      </>
    )
  };
};