import React from "react";
import {
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormInput
} from "shards-react";

class CustomSearchInput extends React.Component {

  render() {
    return (
      <InputGroup seamless>
        <InputGroupAddon type="prepend">
          <InputGroupText>
            {/* <FontAwesomeIcon icon={["fab", "twitter"]} /> */}
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