import React from "react";
import { Container, Row, Col } from "shards-react";
import MainNavbar from "../components/layout/SearchNavbar/MainNavbar";
import MainSidebar from "../components/layout/SearchSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
import SearchResult from "../views/SearchResult";
import LoadingModal from "../components/common/LoadingModal";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { findmentors } from '../api/api';

import { Store } from "../flux";
import { Dispatcher, Constants } from "../flux";

export default class SearchLayout extends React.Component {
  constructor(props) {
    super(props);

    this.outcomingRef = React.createRef();
    
    this.state = {
      id: 1,
      totalCnt: 0,
      loading: false,
      mentors: [],
      noNavbar: false,
      filterType: Store.getUserType(),
      mentorUrl: Store.getMentorHistory(),
      studentUrl: Store.getStudentHistory(),
      noFooter: true,
    }

    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    if(!localStorage.getItem('token')) {
      window.location.href = '/';
      return;
    }

    Store.addChangeListener(this.onChange);
    this.menuClicked("", 1);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      filterType: Store.getUserType(),
      mentorUrl: Store.getMentorHistory(),
      studentUrl: Store.getStudentHistory(),
    });
  }

  handleClick() {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_USER_TYPE,
    });

    const { filterType, mentorUrl, studentUrl } = this.state;

    if ( !filterType ) 
      this.props.history.push(mentorUrl);
    else 
      this.props.history.push(studentUrl);
  }

  menuClicked = async(id, pageNo) => {
    this.setState({id: id});
    let param = {
      tag_id: id,
      name: "",
      page: pageNo,
      rowsPerPage: 10
    }
    try {
      this.setState({loading: true});
      const result = await findmentors(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          mentors: result.data.data,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
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
      console.log(err);
      this.setState({loading: false});
      this.showFail("Something Went wrong");
    };
  }

  onChangePagination(pageNo) {
    const {id} = this.state;
    this.menuClicked(id, pageNo);
  }

  removeSession() {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('user-type');
    localStorage.removeItem('user_name');
    localStorage.removeItem('ws');
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
    // const { children } = this.props;
    const { noFooter, filterType, mentors, loading, totalCnt } = this.state;

    return (
      <>
        {loading && <LoadingModal open={true} />}
        <ReactNotification />
        <Container fluid>
          <Row>
            <MainSidebar menuClicked={(id) => this.menuClicked(id)} filterType={filterType}/>
            <Col
              className="main-content p-0 main-content-class"
              tag="main"
            >
              <MainNavbar filterType={filterType} toggleType={() => this.handleClick()} />
              {/* {children} */}
              <SearchResult item={mentors} count={totalCnt} pagination={(pageNo) => this.onChangePagination(pageNo)}></SearchResult>
              
              {!noFooter && <MainFooter />}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
