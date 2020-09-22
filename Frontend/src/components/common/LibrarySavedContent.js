import React from "react";
import PropTypes from "prop-types";
import { Button } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Video from "../../video/video.mp4"
import ReivewImage from "../../images/Review.jpg"

class LibrarySavedContent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="library-saved-content">
        <div>
          <video className="mentor-video-tag" controls>
            <source src={Video} type="video/mp4" />
          </video>
        </div>
        <div className="library-saved-content-desc">
          {/* <h6 className="video-upload-time no-margin">08/09/20 at 12:04pm</h6> */}
          <div style={{display: "flex", float: "left"}}>
            <img src={ReivewImage} className="saved-content-avatar" alt="avatar" />
            <div>
              <h6 className="library-content-name">Kaylynn Curtis</h6>
            </div>
          </div>
          <Button className="btn-video-desc-more no-padding">
            <img src={MoreButtonImage} alt="more"/>
          </Button>
        </div>
        <div>
          <h6 className="mentor-desc-video-detail no-margin">
            My Video
          </h6>
        </div>
      </div>
    );
  }
}

LibrarySavedContent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

LibrarySavedContent.defaultProps = {
  value: 0,
  label: "Label",
};

export default LibrarySavedContent;
