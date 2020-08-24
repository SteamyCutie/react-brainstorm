import React from "react";

import {
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  Button
} from "shards-react";

import SearchIcon from '../../../images/SearchIcon.svg'

export default () => (
  <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
    <InputGroup seamless className="ml-3 search-bar">
      <FormInput
        className="navbar-search"
        placeholder="Enter the category or mentor's name"
      />
      <InputGroupAddon type="append">
        <Button className="navbar-search btn-search">
          <InputGroupText>
            <img src={SearchIcon}/>
          </InputGroupText>
        </Button>
      </InputGroupAddon>
    </InputGroup>
  </Form>
);
