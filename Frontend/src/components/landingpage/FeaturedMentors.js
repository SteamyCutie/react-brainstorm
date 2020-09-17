import React from "react";
import { Button, Row, Col } from "shards-react";
import AwesomeSlider from 'react-awesome-slider';
import AwesomeSliderStyles from 'react-awesome-slider/src/styles';
import PropTypes from "prop-types";
import withAutoplay from 'react-awesome-slider/dist/autoplay';

import "../../assets/landingpage.css"
import StarIcon from "../../images/star_icon.svg";
import PlayIcon from "../../images/Play_icon.svg";
import Lightening from "../../images/Lightening.svg";
import Clock from "../../images/Clock.svg";
import { getallmentors } from '../../api/api';

const AutoplaySlider = withAutoplay(AwesomeSlider);

export default class FeaturedMentors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      more: false,
      carouselDatas: []
    };
  }

  componentWillMount() {
    // this.getMentors();
  }

  getMentors = async() => {
    try {
      const result = await getallmentors({email: localStorage.getItem('email')});
      if (result.data.result == "success") {
        this.setState({
          carouselDatas: result.data.data
        });
      } else {
      }
    } catch(err) {
    };
  }

  readMore() {
    this.setState({more: true});
  }

  readLess() {
    this.setState({more: false});
  }

  render() {
    const {carouselDatas} = this.state;
    return (
      <div className="featured-mentors">
        <h1>Featured mentors</h1>
        <AutoplaySlider cssModule={AwesomeSliderStyles} bullets={false} play={true} cancelOnInteraction={false} interval={3000} showTimer={false}>
          {carouselDatas.map((data, idx) => (
            <div className="carousel-component" key={idx}>
              <div style={{position: "relative"}}>
                <img src={data.avatar} alt={data.name} className="carousel-component-img-class" />
                {
                  data.online && <div className="carousel-component-online-class"></div>
                }
              </div>
              <div className="carousel-component-body-class">
                <Row className="carousel-component-body-header-class">
                  <div className="carousel-component-body-header-class-name">{data.name}</div>
                  {/* <div><img src={StarIcon} alt="star-icon"/>{data.score}</div> */}
                  <div><img src={StarIcon} alt="star-icon"/>5</div>
                </Row>
                <Row className="carousel-component-body-teach-class">
                  <Col lg={2} className="tag-title">Teaches: </Col>
                  {data.tag_name.map((teach, idk) => (
                    <p key={idk} className="brainsshare-tag">{teach}</p>
                  ))
                  }
                </Row>
                <div className="carousel-component-body-desc-class">
                  {this.state.more ? <p>{data.description}</p> : <p>{data.description.slice(0,100)}...</p>}
                  {this.state.more ? <a href="javascript:void(0)" className="read-more" onClick={() => this.readLess()}>Read less</a> : <a href="javascript:void(0)" className="read-more" onClick={() => this.readMore()}>Read more</a>}
                </div>
                <div className="carousel-component-body-play-class">
                  <a href={data.video_url} target="_blank"><img src={PlayIcon} alt="play-icon"/>Video presentation</a>
                </div>
              </div>
              <div className="carousel-component-footer-class">
                <Row className="center-class">
                  <p>
                    $ {data.hourly_price} / {data.time} min
                  </p>
                </Row>
                <Row className="center-class">
                  {data.instant_call ? 
                  <Button className="carousel-component-footer-instant-class">
                    <img src={Lightening} alt="Lightening" />
                    Instant Call
                  </Button> :
                  <Button disabled className="carousel-component-footer-instant-class">
                  <img src={Lightening} alt="Lightening" />
                  Instant Call
                </Button>}
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
        </AutoplaySlider>
      </div>
    )
  }
};