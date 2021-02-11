import React, {Component} from "react";
import { Button, Col, Row } from "shards-react";

import "../../assets/landingpage.css"

import DiscoverImage1 from '../../images/discover1.jpg'
// import DiscoverImage2 from '../../images/discover2.jpg'
// import DiscoverImage3 from '../../images/discover3.jpg'
// import DiscoverImageAvatar1 from '../../images/discover-avatar1.jpg'
// import DiscoverImageAvatar2 from '../../images/discover-avatar2.jpg'
// import DiscoverImageAvatar3 from '../../images/discover-avatar3.jpg'
import Slider from "react-slick";
import { getopenedforum } from '../../api/api';

export default class Discover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forums: []
    }
  }

  componentWillMount() {
    this.getForums();
  }

  getForums = async() => {
    try {
      const result = await getopenedforum();
      if (result.data.result === "success") {
        this.setState({
          forums: result.data.data
        });
      } else {
      }
    } catch(err) {
    };
  }

  handleImageErr(idx) {
    console.log(idx, "+++++++++++++++++");
    let { forums } = this.state;
    forums[idx].path = DiscoverImage1;

    this.setState({forums});
  }

  getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  isImage(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
        //etc
        return true;
      default:
    }
    return false
  }

  isVideo(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        // etc
        return true;
      default:
    }
    return false
  }

  render() {
    const { forums } = this.state;
    let sliderSettings = {
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
    };

    return (
      <div className="discover">
        <Col>
          <div className="center">
            <h1 className="desc-title-discover">Discover</h1>
          </div>
          <div className="center">
            <h3 className="desc-content-discover">See upcoming events from Brainsshare mentors</h3>
          </div>
        </Col>
        <Slider {...sliderSettings}>
          {forums.map((forum, idx) => {
            return (
              <div key={idx}>
                <Col>
                  <Row>
                    <h1 className="desc-title-discover">{forum.title}</h1>
                  </Row>
                  <Row>
                    {forum.tags.map((tag, idx) => {
                      return <h5 className="brainsshare-tag" key={idx}>{tag}</h5>;
                    })}
                  </Row>
                  <Row>
                    <h4 className="discover-detail-content">
                      {forum.description}
                    </h4>
                  </Row>
                  <Row>
                    {forum.type === "image" &&
                      <img
                        className="img-discover-detail-content"
                        src={forum.path}
                        // src="/images/Brainsshare.jpg"
                        placeholder="Mentor Active Image"
                        alt="category"
                        onError={() => this.handleImageErr(idx)}
                      />
                    }
                    {forum.type === "video" &&
                      <video
                        className="img-discover-detail-content"
                        src={forum.path}
                        placeholder="Mentor Active Image"
                        alt="category"
                        onError={() => this.handleImageErr(idx)}
                        autoPlay
                        loop
                      />
                    }
                    {forum.type === "other" &&
                      <img
                        className="img-discover-detail-content"
                        src="/images/Brainsshare.jpg"
                        placeholder="Mentor Active Image"
                        alt="category"
                        onError={() => this.handleImageErr(idx)}
                      />
                    }
                  </Row>
                  <Row>
                    <img
                      className="img-discover-detail-content-avatar"
                      src={forum.avatar}
                      placeholder="Mentor Active Image"
                      alt="avatar"
                    />
                    <h3 className="discover-detail-content">
                      {forum.name}
                    </h3>
                  </Row>
                  <Row>
                    <Button theme="primary" className="mb-2 mr-3 btn-learn-more">
                      Learn more
                    </Button>
                  </Row>
                </Col>
              </div>
            );
          })}
        </Slider>
        <div style={{width: "100%", height: "30px"}}></div>
      </div>
    );
  }
}
