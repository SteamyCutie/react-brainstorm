import React from "react";
import PropTypes from "prop-types";
import { Container, Navbar } from "shards-react";
import CreateMyShare from "../../common/CreateMyShare";

export default class SubMainNavbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ModalOpen: false,
      ModalOpenReview: false,
    };
  }

  componentWillMount() {
  }

  toggle_openmodal() {
    this.setState({
      ModalOpen: !this.state.ModalOpen
    });
  }

  toggle_modal() {
    this.setState({
      ModalOpen: !this.state.ModalOpen,
    });
  }

  render() {
    const { ModalOpen } = this.state;
    return (
      <div className="main-navbar bg-white sub-main-nav-bar-class">
        <CreateMyShare open={ModalOpen} toggle={() => this.toggle_openmodal()} toggle_modal={() => this.toggle_modal()}></CreateMyShare>
        <Container className="p-0 fix-position">
          <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
            <div className="sub-main-nav-bar-div-class">
              {/* <div className="margin-right-class">
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.998 10.07C12.1026 10.07 12.998 9.17458 12.998 8.07001C12.998 6.96544 12.1026 6.07001 10.998 6.07001C9.89348 6.07001 8.99805 6.96544 8.99805 8.07001C8.99805 9.17458 9.89348 10.07 10.998 10.07Z" stroke="#04B5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.2379 3.83C15.7957 4.38724 16.2383 5.04897 16.5402 5.77736C16.8422 6.50575 16.9976 7.28651 16.9976 8.075C16.9976 8.86349 16.8422 9.64425 16.5402 10.3726C16.2383 11.101 15.7957 11.7628 15.2379 12.32M6.75786 12.31C6.20001 11.7528 5.75745 11.091 5.45551 10.3626C5.15356 9.63425 4.99814 8.85349 4.99814 8.065C4.99814 7.27651 5.15356 6.49575 5.45551 5.76736C5.75745 5.03897 6.20001 4.37724 6.75786 3.82M18.0679 1C19.9426 2.87528 20.9957 5.41836 20.9957 8.07C20.9957 10.7216 19.9426 13.2647 18.0679 15.14M3.92786 15.14C2.05315 13.2647 1 10.7216 1 8.07C1 5.41836 2.05315 2.87528 3.92786 1" stroke="#04B5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="margin-double-right-class">
                <a href="#!">Go Live Now</a>
              </div> */}
              <div className="margin-right-class">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H17C18.1046 19 19 18.1046 19 17V3C19 1.89543 18.1046 1 17 1Z" stroke="#04B5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" stroke="#04B5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 13L14 8L3 19" stroke="#04B5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="margin-right-class">
                <a href="#!" onClick={() => this.toggle_openmodal()}>Upload photo/video</a>
              </div>
            </div>
          </Navbar>
        </Container>
      </div>
    )
  };
};

SubMainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

SubMainNavbar.defaultProps = {
  stickyTop: true
};