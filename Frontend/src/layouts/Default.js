import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import SubMainNavbar from "../components/layout/MainNavbar/SubMainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";


import { Store } from "../flux";
import { Dispatcher, Constants } from "../flux";
    
export default class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      noNavbar: false,
      filterType: Store.getUserType(),
      mentorUrl: Store.getMentorHistory(),
      studentUrl: Store.getStudentHistory(),
      noFooter: true
    }

    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
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

    if ( !filterType ) this.props.history.push(mentorUrl);
    else this.props.history.push(studentUrl);
  }

  render() {

    const { children } = this.props;
    const { noFooter, noNavbar, filterType } = this.state;

    return (
      <Container fluid>
        <Row>
          <MainSidebar filterType={filterType}/>
          <Col
            className="main-content p-0 main-content-class"
            tag="main"
          >
            {!noNavbar && <MainNavbar filterType={filterType} toggleType={() => this.handleClick()} />}
            {filterType && <SubMainNavbar/>}
            {children}
            {!noFooter && <MainFooter />}
          </Col>
        </Row>
      </Container>
    );
  }
}
