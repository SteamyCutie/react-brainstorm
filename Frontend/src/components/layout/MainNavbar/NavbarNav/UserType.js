import React from "react";
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

export default class UserType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alignment: "left",
    }
  }

  componentWillMount() {
    const { filterType } = this.props;
    let tmp_ali = "left";
    if (filterType === false) tmp_ali = "right";
    this.setState({
      alignment: tmp_ali,
    });
  }

  setAlignment(newAlignment) {
    this.setState({
      alignment: newAlignment,
    });
  }

  handleAlignment = (event, newAlignment) => {
    this.setAlignment(newAlignment);
    const { toggleType } = this.props;
    toggleType();
  };

  render() {
    const { alignment } = this.state;
    return (
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={(event, newAlignment) => this.handleAlignment(event, newAlignment)}
        aria-label="text alignment"
      >
        <ToggleButton value="left" aria-label="left aligned" className="toggle-button-class mentor-toggle-class">
          Mentor
        </ToggleButton>
        <ToggleButton value="right" aria-label="right aligned" className="toggle-button-class student-toggle-class">
          Student
        </ToggleButton>
      </ToggleButtonGroup>
    );
  }
}
