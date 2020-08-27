import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Row, Col, Button } from "shards-react";

import VideoImage from "../../images/Video-img.jpg"
import MoreButtonImage from "../../images/more.svg"

import Video from "../../video/video.mp4"

class MentorVideo extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { title, content, image } = this.props;
    return (
      // <Card small className="small-card2" >
      //   <CardBody className="no-padding">
      //     <Row>
      //       <Col xl="3" sm="3" className="small-card2-icon">
      //           <img src={image} />
      //       </Col>
      //       <Col xl="9" sm="9" className="small-card2-desc">
      //           <h4 className="small-card2-title no-margin">{title}</h4>
      //           <h6 className="small-card2-content no-margin">{content}</h6>
      //       </Col>
      //     </Row>
      //   </CardBody>
      // </Card>
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
