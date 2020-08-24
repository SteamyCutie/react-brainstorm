import React from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  NavItem,
  ButtonGroup,
  Button
} from "shards-react";

export default class UserType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    return (
        <ButtonGroup className="mr-2 user-type-group">
          <div className="user-type-active">Mentor</div>
          <div className="user-type-deactive">Student</div>
        </ButtonGroup>
    );
  }
}
