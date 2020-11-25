import React from "react";
import { Container, Row, Col, Button, FormSelect } from "shards-react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Pagination from '@material-ui/lab/Pagination';
import BookSession from "./../components/common/BookSession";
import LoadingModal from "../components/common/LoadingModal";
import OutcomingCallDesc from "./../components/common/OutcomingCallDesc";
import { ToastsStore } from 'react-toasts';
import MentorDetailCardStudentDashboard from "./../components/common/MentorDetailCardStudentDashboard";
import { findmentorsbytagsorname, signout } from '../api/api';
import media_url from "../video/video.mp4";
import DashboardVideoAvatar from "../images/dashboard-video-avatar.svg"
import DashboardVideoAvatarMini from "../images/dashboard-video-avatar-mini.svg"
import MiniEndCall from '../images/many2many-mini-end.svg'
import MiniFullScreen from '../images/maximize.png'
import MiniMuteMic from '../images/many2many-mini-mute-mic.svg'
import MiniMuteVideo from '../images/many2many-mini-mute-video.svg'
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
import defaultavatar from "../images/avatar.jpg";

export default class MentorDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.mentorRef = React.createRef();

    this.state = {
      id: 0,
      ModalOpen: false,
      totalCnt: 0,
      loading: false,
      mentors: [],
      width: '100%',
      height: '450',
      ModalCallWithDescOpen: false,
      callDescription: '',
      participantSelected: false,
      participantData: {},
      pageCount: 1, 
      hasMore: true, 
      sortby: "",
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
      for (var i = 0; i < categories.length; i++) {
        searchParams.push(categories[i].value);
      }
    }

    this.getParticipants(searchParams, searchKey, 1);
    this.setState({
      pageCount: 2, 
    })
  }

  componentWillMount() {
    let categories = JSON.parse(localStorage.getItem('search-category'));
    let searchKey = (localStorage.getItem('search-key') === null ? "" : localStorage.getItem('search-key'));
    let searchParams = [];
    if (categories === null) {
      searchParams = [];
    } else {
      for (var i = 0; i < categories.length; i++) {
        searchParams.push(categories[i].value);
      }
    }

    this.getParticipants(searchParams, searchKey, 1);
    this.setState({
      pageCount: 2, 
    })
  }

  componentDidMount() {
    window.addEventListener('mousewheel', this.handleScroll);
  }

  handleScroll(event) {
    if (window.location.pathname === "/mentordashboard") {
      if (event.deltaY < 0) {
        if (window.pageYOffset <= 200) {
          document.getElementById("dashboard-video-ads-container").style = "display: block";
          document.getElementById("dashboard-video-ads-container-small").style = "display: none";
        }
      } else if (event.deltaY > 0) {
        let headerHeight = 94;
        if (document.getElementById("dashboard-video-ads-container")) {
          var height = document.getElementById("dashboard-video-ads-container").clientHeight - window.pageYOffset - headerHeight;
          document.getElementById("dashboard-video-ads-container").style.height = height + 'px';
          if (document.getElementById("dashboard-video-ads-container").clientHeight <= 288) {
            document.getElementById("dashboard-video-ads-container").style = "display: none";
            document.getElementById("dashboard-video-ads-container-small").style = "display: block";
          }
        }
      }
    }
  }

  sendUser(to, avatar, name) {
    this.props.setUser(to, avatar, name);
  }

  getParticipants = async (category, searchKey, pageNo) => {
    let param = {
      user_id: localStorage.getItem('user_id'),
      tags_id: category,
      name: searchKey,
      page: pageNo,
      rowsPerPage: 5, 
      sortby: this.state.sortby, 
    }

    try {
      this.setState({ loading: true });
      const result = await findmentorsbytagsorname(param);
      if (result.data.result === "success") {
        const { mentors } = this.state;
        var temp = mentors;
        temp = temp.concat(result.data.data);
        this.setState({
          loading: false,
          mentors: temp,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
        }, () => {
          if (this.state.mentors.length >= result.data.totalRows) {
            this.setState({
              hasMore: false, 
            })
          }
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

  onChangePagination(e, value) {
    let categories = JSON.parse(localStorage.getItem('search-category'));
    let searchKey = (localStorage.getItem('search-key') === null ? "" : localStorage.getItem('search-key'));
    let searchParams = [];
    if (categories === null) {
      searchParams = [];
    } else {
      for (var i = 0; i < categories.length; i++) {
        searchParams.push(categories[i].value);
      }
    }

    this.getParticipants(searchParams, searchKey, value);
  }

  fetchMoreData = () => {
    let categories = JSON.parse(localStorage.getItem('search-category'));
    let searchKey = (localStorage.getItem('search-key') === null ? "" : localStorage.getItem('search-key'));
    let searchParams = [];
    if (categories === null) {
      searchParams = [];
    } else {
      for (var i = 0; i < categories.length; i++) {
        searchParams.push(categories[i].value);
      }
    }

    this.getParticipants(searchParams, searchKey, this.state.pageCount);
    this.setState({
      pageCount: this.state.pageCount + 1,
    })
    
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

  handleCall() {
    var callerInfo = {};
    var index;

    for (index = 0; index < this.state.mentors.length; index++) {
      if (this.state.mentors[index].id === this.state.id) {
        callerInfo = this.state.mentors[index];
      }
    }

    this.toggle_callwithdesc();

    this.props.setUser(callerInfo.email, callerInfo.avatar, callerInfo.name, callerInfo.channel_name, this.state.callDescription);
  }

  handleCallEnd() {
    this.toggle_callwithdesc();

    this.setState({
      callDescription: '',
    });
  }

  handleCancel() {
    this.toggle_callwithdesc();

    this.setState({
      callDescription: '',
    });
  }

  handleMentorDetailCardClick(mentorData) {
    this.setState({
      participantSelected: true,
      participantData: mentorData,
    })
  }

  handleAdsCall() {
    this.toggle_callwithdesc(this.state.participantData.id)
  }

  handleAdsBook() {
    this.toggle(this.state.participantData.id);
  }

  onChangeTags = (e) => {
    if (e.target.value === "Language") {
      return;
    }

    this.setState({
      mentors: [], 
      sortby: e.target.value, 
      pageCount: 1, 
    }, () => {
      this.fetchMoreData();
    });
  }

  render() {
    const { loading, mentors, totalCnt, ModalOpen, id, ModalCallWithDescOpen, participantSelected, participantData, width } = this.state;
    return (
      <>
        {loading && <LoadingModal open={true} />}
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
        <Container fluid className="main-content-container px-4 pb-4 main-content-container-class page-basic-margin">
          <div>
            <div id="dashboard-video-ads-container" className="dashboard-video-ads-container">
              <img src={DashboardVideoAvatar} alt="Brains Share" className="dashboard-video-ads-avatar" />
              {participantSelected ?
                <div className="dashboard-participant-infor">
                  <img src={participantData.avatar ? participantData.avatar : defaultavatar} alt={participantData.name} />
                  <label style={{ position: "absolute", top: "35px", left: "20px", fontSize: "80px", fontWeight: "bold", width: "650px", textAlign: "center" }}>{participantData.name}</label>
                  <label style={{ position: "absolute", left: "50px", top: "260px", fontSize: "40px" }}>{participantData.description}</label>
                </div>
                :
                <video id="video" autoPlay>
                  <source src={media_url} type="video/mp4"></source>
                </video>
              }
            </div>
            {participantSelected ?
              <div id="dashboard-video-ads-container-controls" className="dashboard-video-ads-container-controls">
                {participantData.instant_call ?
                  <Button className="btn-dashboard-ads-button" onClick={() => this.handleAdsCall()}>
                    Available now
                  </Button>
                  : null
                }
                <Button className="btn-dashboard-ads-button2" onClick={() => this.handleAdsBook()}>
                  Book a session
                </Button>
              </div>
              :
              <div id="dashboard-video-ads-container-controls" className="dashboard-video-ads-container-controls">
                <Button className="btn-dashboard-control margin-right-auto">
                  <img src={FullScreen} alt="Full Screen" />
                </Button>

                <div className="">
                  <Button className="btn-dashboard-control float-center">
                    <img src={MuteMic} alt="Mute mic" />
                  </Button>
                  <Button className="btn-dashboard-control float-center">
                    <img src={MuteVideo} alt="Mute video" />
                  </Button>
                  <Button className="btn-dashboard-control float-center">
                    <img src={Chat} alt="Chat" />
                  </Button>
                  <Button className="btn-dashboard-control float-center">
                    <img src={ScreenShare} alt="Screen Share" />
                  </Button>
                  <Button className="btn-dashboard-control float-center">
                    <img src={AddUser} alt="Add User" />
                  </Button>
                </div>

                <Button className="btn-room-call-decline margin-left-auto" style={{ marginRight: "10px", padding: "0px" }}>
                  <img src={EndCall} alt="End" />
                </Button>
              </div>
            }
          </div>
          <div id="dashboard-video-ads-container-small" className="dashboard-video-ads-container-small">
            <img src={DashboardVideoAvatarMini} alt="Brains Share" className="dashboard-video-ads-mini-avatar" />
            {participantSelected ?
              <div className="dashboard-participant-infor-small">
                <div>
                  <img src={participantData.avatar ? participantData.avatar : defaultavatar} alt={participantData.name} />
                  <label style={{ fontSize: "38px", fontWeight: "bold", position: "absolute", top: "45px", left: "15px", width: "290px", textAlign: "center" }}>{participantData.name}</label>
                </div>
                <label style={{ fontSize: "20px", position: "absolute", top: "130px", fontWeight: "normal", left: "15px", width: "420px" }}>{participantData.description}</label>
              </div>
              :
              <video width={width} id="video-small" autoPlay>
                <source src={media_url} type="video/mp4"></source>
              </video>
            }
            {participantSelected ?
              <div id="dashboard-video-ads-container-small-controls" className="dashboard-video-ads-container-small-controls">
                {participantData.instant_call ?
                  <Button className="btn-dashboard-ads-button-small" onClick={() => this.handleAdsCall()}>
                    Available now
                  </Button>
                  : null
                }
                <Button className="btn-dashboard-ads-button2-small" onClick={() => this.handleAdsBook()}>
                  Book a call
                </Button>
              </div>
              :
              <div id="dashboard-video-ads-container-small-controls" className="dashboard-video-ads-container-small-controls">
                <Button className="btn-dashboard-control-mini margin-right-auto">
                  <img src={MiniFullScreen} alt="Full Screen" />
                </Button>

                <div className="">
                  <Button className="btn-dashboard-control-mini float-center">
                    <img src={MiniMuteMic} alt="Mute mic" />
                  </Button>
                  <Button className="btn-dashboard-control-mini float-center">
                    <img src={MiniMuteVideo} alt="Mute video" />
                  </Button>
                  <Button className="btn-dashboard-control-mini float-center">
                    <img src={MiniChat} alt="Chat" />
                  </Button>
                  <Button className="btn-dashboard-control-mini float-center">
                    <img src={MiniScreenshare} alt="Screen Share" />
                  </Button>
                  <Button className="btn-dashboard-control-mini float-center">
                    <img src={MiniAddUser} alt="Add User" />
                  </Button>
                </div>

                <Button className="btn-room-call-decline-mini margin-left-auto" style={{ marginRight: "10px", padding: "0px" }}>
                  <img src={MiniEndCall} alt="End" />
                </Button>
              </div>
            }
          </div>
          <Row noGutters className="page-header py-4">
            <Col className="page-title">
              <h3 id="search-result-label">My Share Page</h3>
              <div style={{padding: "5px 0px"}}>
                <label style={{marginRight: "15px", fontWeight: "bold", color: "#333333"}}>Sort by: </label>
                <FormSelect style={{ height: "40px", width: "150px", marginRight: "10px", fontSize: "15px" }} onChange={(e) => this.onChangeTags(e)}>
                  <option value="">Select</option>
                  <option key="1" value="Hourly" >Hourly Rate</option>
                  <option key="1" value="Language" >Language</option>
                </FormSelect>
              </div>
            </Col>
          </Row>
          <InfiniteScroll
            dataLength={mentors.length}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={<h4>Loading...</h4>}
          >
            {mentors.map((data, idx) => (
              <MentorDetailCardStudentDashboard
                key={idx}
                ref={this.mentorRef}
                mentorData={data}
                sendUser={this.sendUser}
                toggle={(id) => this.toggle(id)}
                callwithdescription={(id) => this.toggle_callwithdesc(id)}
                onMentorDetailCardClick={(mentorData) => this.handleMentorDetailCardClick(mentorData)}
              />
            ))}
          </InfiniteScroll>
        </Container>
      </>
    )
  };
};