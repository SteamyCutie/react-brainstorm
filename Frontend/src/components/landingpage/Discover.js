import React from "react";
import { Button, Col, Row } from "shards-react";

import "../../assets/landingpage.css"

import DiscoverImage1 from '../../images/discover1.jpg'
import DiscoverImage2 from '../../images/discover2.jpg'
import DiscoverImage3 from '../../images/discover3.jpg'
import DiscoverImageAvatar1 from '../../images/discover-avatar1.jpg'
import DiscoverImageAvatar2 from '../../images/discover-avatar2.jpg'
import DiscoverImageAvatar3 from '../../images/discover-avatar3.jpg'

const Discover = () => (
  <div className="discover">
    <Col>
      <div className="center">
        <h1 className="desc-title-discover">Discover</h1>
      </div>
      <div className="center">
        <h3 className="desc-content-discover">See upcoming events from Brainsshare mentors</h3>
      </div>
    </Col>
    <Col className="border-top-bottom">
      <div className="center">
        <Row className="discover-part">
          <Col>
            <Row>
              <h1 className="desc-title-discover">Algebra for begginers</h1>
            </Row>
            <Row>
              <h5 className="brainsshare-tag">Algebra</h5>
              <h5 className="brainsshare-tag">Mathematics</h5>
            </Row>
            <Row>
              <h4 className="discover-detail-content">
                Mauris dictumst vel eu, mus cras massa neque ipsum ante, justo sapien ipsum cras vitae nibh
              </h4>
            </Row>
            <Row>
              <img
                className="img-discover-detail-content"
                src={DiscoverImage1}
                placeholder="Mentor Active Image"
                alt="category"
                />
            </Row>
            <Row>
              <img
                className="img-discover-detail-content-avatar"
                src={DiscoverImageAvatar1}
                placeholder="Mentor Active Image"
                alt="avatar"
              />
              <h3 className="discover-detail-content">
                Kianna Press
              </h3>
            </Row>
            <Row>
              <Button theme="primary" className="mb-2 mr-3 btn-learn-more">
                Learn more
              </Button>
            </Row>
          </Col>
        </Row>
        <Row className="discover-part border-left-right">
          <Col>
            <Row>
              <h1 className="desc-title-discover">Linear Programming</h1>
            </Row>
            <Row>
              <h5 className="brainsshare-tag">Java</h5>
              <h5 className="brainsshare-tag">Programming</h5>
            </Row>
            <Row>
              <h4 className="discover-detail-content">
                Mauris dictumst vel eu, mus cras massa neque ipsum ante, justo sapien ipsum cras vitae nibh
              </h4>
            </Row>
            <Row>
              <img
                className="img-discover-detail-content"
                src={DiscoverImage2}
                placeholder="Mentor Active Image"
                alt="category"
              />
            </Row>
            <Row>
              <img
                className="img-discover-detail-content-avatar"
                src={DiscoverImageAvatar2}
                placeholder="Mentor Active Image"
                alt="avatar"
              />
              <h3 className="discover-detail-content">
                Leo Passaquindici Arcand
              </h3>
            </Row>
            <Row>
              <Button theme="primary" className="mb-2 mr-3 btn-learn-more">
                Learn more
              </Button>
            </Row>
          </Col>
        </Row>  
        <Row className="discover-part">
          <Col>
            <Row>
              <h1 className="desc-title-discover">Street art</h1>
            </Row>
            <Row>
              <h5 className="brainsshare-tag">Art</h5>
              <h5 className="brainsshare-tag">Graphics</h5>
            </Row>
            <Row>
              <h4 className="discover-detail-content">
                Mauris dictumst vel eu, mus cras massa neque ipsum ante, justo sapien ipsum cras vitae nibh
              </h4>
            </Row>
            <Row>
              <img
                className="img-discover-detail-content"
                src={DiscoverImage3}
                placeholder="Mentor Active Image"
                alt="category"
              />
            </Row>
            <Row>
              <img
                className="img-discover-detail-content-avatar"
                src={DiscoverImageAvatar3}
                placeholder="Mentor Active Image"
                alt="avatar"
              />
              <h3 className="discover-detail-content">
                Lindsey Donin
              </h3>
            </Row>
            <Row>
              <Button theme="primary" className="mb-2 mr-3 btn-learn-more">
                Learn more
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
    </Col>
  </div>
);

export default Discover;
