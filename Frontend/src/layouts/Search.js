import React from "react";
import { Container, Row, Col } from "shards-react";
import MainNavbar from "../components/layout/SearchNavbar/MainNavbar";
import MainSidebar from "../components/layout/SearchSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
import SearchResult from "../views/SearchResult";
import LoadingModal from "../components/common/LoadingModal";
import { findmentors, signout } from '../api/api';
import { Store } from "../flux";
import { Dispatcher, Constants } from "../flux";
import { ToastsStore } from 'react-toasts';

export default class SearchLayout extends React.Component {
  constructor(props) {
    super(props);

    this.outcomingRef = React.createRef();

    this.state = {
      name: '',
      id: 1,
      totalCnt: 0,
      loading: false,
      mentors: [],
      pageNo: 1,
      noNavbar: false,
      filterType: Store.getUserType(),
      mentorUrl: Store.getMentorHistory(),
      studentUrl: Store.getStudentHistory(),
      noFooter: true,
      search_level: false,
      search_hourly: false
    }

    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
    let { pageNo } = this.state;
    this.menuClicked("", pageNo);
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

    if (!filterType)
      this.props.history.push(mentorUrl);
    else
      this.props.history.push(studentUrl);
  }

  menuClicked = async (id, pageNo) => {
    this.setState({ id: id });
    let { name, search_level, search_hourly } = this.state;
    let param = {
      tag_id: id,
      name: name,
      page: pageNo,
      rowsPerPage: 10,
      filterbylevel: search_level,
      filterbyhourly: search_hourly
    }
    try {
      this.setState({ loading: true });
      const result = await findmentors(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          mentors: result.data.data,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
        });
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
      console.log(err);
      this.setState({ loading: false });
      ToastsStore.error("Something Went wrong");
    };
  }

  onSearch = async (searchKey) => {
    this.setState({ name: searchKey });
    let { id, pageNo, search_level, search_hourly } = this.state;
    let param = {
      tag_id: id,
      name: searchKey,
      page: pageNo,
      rowsPerPage: 10,
      filterbylevel: search_level,
      filterbyhourly: search_hourly
    }
    try {
      this.setState({ loading: true });
      const result = await findmentors(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          mentors: result.data.data,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
        });
        // this.showInformation("Please Login");
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

  onChangePagination(pageNo) {
    this.setState({ pageNo: pageNo });
    const { id } = this.state;
    this.menuClicked(id, pageNo);
  }

  onSearchFilter = async (mentor_level, mentor_hourly) => {
    this.setState({
      search_hourly: mentor_hourly,
      search_level: mentor_level
    });

    let { id, pageNo, name } = this.state;
    let param = {
      tag_id: id,
      name: name,
      page: pageNo,
      rowsPerPage: 10,
      filterbylevel: mentor_level,
      filterbyhourly: mentor_hourly
    }
    try {
      this.setState({ loading: true });
      const result = await findmentors(param);
      if (result.data.result === "success") {
        this.setState({
          loading: false,
          mentors: result.data.data,
          totalCnt: result.data.totalRows % 10 === 0 ? result.data.totalRows / 10 : parseInt(result.data.totalRows / 10) + 1
        });
        // this.showInformation("Please Login");
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
    window.location.href = "/";
  }

  showInformation(text) {
    ToastsStore.info(text);
  }

  render() {
    const { noFooter, filterType, mentors, loading, totalCnt, pageNo } = this.state;

    return (
      <>
        {loading && <LoadingModal open={true} />}
        <Container fluid>
          <Row>
            <MainSidebar menuClicked={(id) => this.menuClicked(id, pageNo)} filterType={filterType} />
            <Col
              className="main-content p-0 main-content-class"
              tag="main"
            >
              <MainNavbar filterType={filterType} toggleType={() => this.handleClick()} onSearch={(searchKey) => this.onSearch(searchKey)} />
              <SearchResult item={mentors} count={totalCnt} pagination={(pageNo) => this.onChangePagination(pageNo)} showInfomation={(text) => this.showInformation(text)} searchFilter={(level, hourly) => this.onSearchFilter(level, hourly)}></SearchResult>
              {!noFooter && <MainFooter />}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
