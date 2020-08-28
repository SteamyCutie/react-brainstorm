import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import routes from "./Routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "../src/assets/mentorWallet.css";
import "../src/assets/student.css";

import Video from "./video/video.mp4"

export default class App extends React.Component{
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <Router basename={process.env.REACT_APP_BASENAME || ""}>
        <div>
          <div style={{zIndex: 99999, bottom: "0px", right: "0px", position: "fixed"}}>
            <video controls>
              <source src={Video} type="video/mp4" />
            </video>
          </div>
          {routes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={withTracker(props => {
                  return (
                    <route.layout {...props}>
                      <route.component {...props} />
                    </route.layout>
                  );
                })}
              />
            );
          })}
        </div>
      </Router>
    );
  }
};
