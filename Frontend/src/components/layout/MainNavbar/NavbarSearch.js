import React from "react";
import {
  Form,
  InputGroup,
  FormInput,
  Button
} from "shards-react";

export default () => (
  <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
    <InputGroup seamless className="ml-3 header-search-input-class">
      <FormInput
        className="navbar-search"
        placeholder="Search"
      />
      <Button className="header-search-button-class">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.7778 20.5555C16.1779 20.5555 20.5555 16.1779 20.5555 10.7778C20.5555 5.37765 16.1779 1 10.7778 1C5.37765 1 1 5.37765 1 10.7778C1 16.1779 5.37765 20.5555 10.7778 20.5555Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22.9998 23L17.6831 17.6833" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </Button>
    </InputGroup>
  </Form>
);
