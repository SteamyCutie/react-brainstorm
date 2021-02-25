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
              <div className="margin-right-class">
                {JSON.parse(localStorage.getItem('user-type')) ? 
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H17C18.1046 19 19 18.1046 19 17V3C19 1.89543 18.1046 1 17 1Z" stroke="#018ac0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" stroke="#018ac0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 13L14 8L3 19" stroke="#018ac0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> : 
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H17C18.1046 19 19 18.1046 19 17V3C19 1.89543 18.1046 1 17 1Z" stroke="#04B5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" stroke="#04B5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 13L14 8L3 19" stroke="#04B5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              </div>
              <div className="margin-right-class">
                <label onClick={() => this.toggle_openmodal()} className={JSON.parse(localStorage.getItem('user-type')) ? "upload-video-photo-color-mentor" : "upload-video-photo-color" }>Upload video</label>
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