import React from "react";
import PropTypes from "prop-types";
import { Button } from "shards-react";

import MoreButtonImage from "../../images/more.svg"
import Video from "../../video/video.mp4"

class MentorVideo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="mentor-desc-video">
        <div className="mentor-desc-video-header">
          <h6 className="video-upload-time no-margin">08/09/20 at 12:04pm</h6>
          <Button className="btn-video-desc-more no-padding">
            <img src={MoreButtonImage} />
          </Button>
        </div>
        <div>
          <h6 className="mentor-desc-video-detail no-margin">
            Lorem ipsum dolor sit amet, sapien ultrices potenti dictum nec, varius erat eu. Volutpat tempor, amet urna. Sit porro ipsum amet cras elementum condimentum, mi urna ut nulla luctus habitasse faucibus, porttitor lectus vestibulum nascetur quam faucibus.
          </h6>
        </div>
        <div>
          <video className="mentor-video-tag" controls>
            <source src={Video} type="video/mp4" />
          </video>
        </div>
      </div>
    );
  }
}

MentorVideo.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

MentorVideo.defaultProps = {
  value: 0,
  label: "Label",
};

export default MentorVideo;
