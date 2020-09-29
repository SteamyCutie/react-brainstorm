import React from "react";
import PropTypes from "prop-types";
import { Button } from "shards-react";
import { Player } from 'video-react';

import MoreButtonImage from "../../images/more.svg"
import ReivewImage from "../../images/Review.jpg"
import background from "../../images/background.jpeg"

class LibrarySavedContent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    const { media_url, mentor_name } = this.props.item;
    return (
      <div className="library-saved-content">
        <div>
          <Player
            playsInline
            poster={background}
            src={media_url}
          />
        </div>
        <div className="library-saved-content-desc" style={{marginTop: 10}}>
          <div style={{display: "flex", float: "left"}}>
            <img src={ReivewImage} className="saved-content-avatar" alt="avatar" />
            <div>
              <h6 className="library-content-name">{mentor_name}</h6>
            </div>
          </div>
          <Button className="btn-video-desc-more no-padding" style={{marginTop: 10}}>
            <img src={MoreButtonImage} alt="more"/>
          </Button>
        </div>
        <div>
          <br></br>
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
