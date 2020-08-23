import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormInput
} from "shards-react";

class CustomSearchInput extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <InputGroup seamless>
        <InputGroupAddon type="prepend">
          <InputGroupText>
            <FontAwesomeIcon icon={["fab", "twitter"]} />
          </InputGroupText>
        </InputGroupAddon>
        <FormInput />
      </InputGroup>
    );
  }
}

CustomSearchInput.propTypes = {
}

CustomSearchInput.defaultProps = {
}

export default CustomSearchInput;