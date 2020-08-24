import React from "react";
import { ButtonGroup, Button, Row, Col } from "shards-react";
import CarouselComponent from "./CarouselComponent";
import AwesomeSlider from 'react-awesome-slider';
import AwesomeSliderStyles from 'react-awesome-slider/src/styles';
import PropTypes from "prop-types";

import "../../assets/landingpage.css"
import StarIcon from "../../images/star_icon.svg";
import PlayIcon from "../../images/Play_icon.svg";
import Online from "../../images/Online.svg";
import Lightening from "../../images/Lightening.svg";
import Clock from "../../images/Clock.svg";

const FeaturedMentors = ({carouselDatas}) => (
  <div className="featured-mentors">
    <h1>Featured mentors</h1>
    <AwesomeSlider cssModule={AwesomeSliderStyles} bullets={false}>
      {carouselDatas.map((data, idx) => (
        <div className="carousel-component" key={idx}>
          <div style={{position: "relative"}}>
            <img src={data.image} alt={data.name} className="carousel-component-img-class" />
            {
              data.online && <img src={Online} alt="Online" className="carousel-component-online-class" />
            }
          </div>
          <div className="carousel-component-body-class">
            <Row className="carousel-component-body-header-class">
              <Col lg={6}>{data.name}</Col>
              <Col lg={6}><img src={StarIcon} alt="star-icon"/>{data.score}</Col>
            </Row>
            <Row className="carousel-component-body-teach-class">
              <Col lg={2}>Teaches: </Col>
              {data.teaches.map((teach, idk) => (
                <p key={idk} className="carousel-component-body-teach-list-class">{teach}</p>
              ))
              }
            </Row>
            <div className="carousel-component-body-desc-class">
              <p>{data.description.slice(0,214)}...</p>
              <a>Read more</a>
            </div>
            <div className="carousel-component-body-play-class"><img src={PlayIcon} alt="play-icon"/>Video presentation</div>
          </div>
          <div className="carousel-component-footer-class">
            <Row className="center-class">
              <p>
                $ {data.rate} / {data.time} min
              </p>
            </Row>
            <Row className="center-class">
              <Button className="carousel-component-footer-instant-class">
                <img src={Lightening} alt="Lightening" />
                Instant Call
              </Button>
            </Row>
            <Row className="center-class">
              <Button className="carousel-component-footer-book-class">
                <img src={Clock} alt="Clock" />
                Book Call
              </Button>
            </Row>
          </div>
        </div>
      ))}
      {/* {carouselDatas.map((data, idx) => (
          <CarouselComponent data="111" key={idx} />
      ))} */}
      {/* <div><h1>1</h1></div>
      <div><h1>2</h1></div>
      <div><h1>3</h1></div>
      <div><h1>4</h1></div> */}
    </AwesomeSlider>
  </div>
);

FeaturedMentors.propTypes = {
  carouselDatas: PropTypes.array,
};

FeaturedMentors.defaultProps = {
  carouselDatas: [
    {
      name: "Kianna Press",
      score: 4.8,
      image: require("../../images/Rectangle_Kianna_big.png"),
      teaches: [
        "Algebra",
        "Mathematics",
      ],
      online: true,
      description: "I'm currently doing my PhD in statistical Physics. I can help you with conceptual and mathematical aspects of classical mechanics, quantum mechanics, statistical mechanics, electrodynamics, mathematical methods for every students and subjects.",
      rate: 25,
      time: 60,
    },
    {
      name: "Rayna Korsgaard",
      score: 4.8,
      image: require("../../images/Rectangle_Rayna_big.png"),
      teaches: [
        "Algebra",
        "Mathematics",
      ],
      online: false,
      description: "I'm currently doing my PhD in statistical Physics. I can help you with conceptual and mathematical aspects of classical mechanics, quantum mechanics, statistical mechanics, electrodynamics, mathematical methods for every students and subjects.",
      rate: 35,
      time: 60,
    },
    {
      name: "Malcom Wiliam",
      score: 5.0,
      image: require("../../images/Rectangle_K.jpg"),
      teaches: [
        "Physics",
        "Mathematics",
      ],
      online: true,
      description: "I'm currently doing my PhD in statistical Physics. I can help you with conceptual and mathematical aspects of classical mechanics, quantum mechanics, statistical mechanics, electrodynamics, mathematical methods for every students and subjects.",
      rate: 35,
      time: 60,
    }
  ]
};

export default FeaturedMentors;
