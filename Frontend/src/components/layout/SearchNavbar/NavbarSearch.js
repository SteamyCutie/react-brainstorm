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

// export default () => (
export default class NavbarSearch extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      searchKey: (localStorage.getItem('searchKey') === null || localStorage.getItem('searchKey') === undefined) ? "" : localStorage.getItem('searchKey')
    }
  }

  componentWillMount() {
    this.onSearch();
  }

  onChangeSearchText(e) {
    this.setState({searchKey: e.target.value});
  }

  onSearch() {
    const { toggle_search } = this.props;
    const { searchKey } = this.state;
    toggle_search(searchKey)
  }

  render() {
    const { searchKey } = this.state;
    return (
      <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
        <InputGroup seamless className="ml-3 search-bar">
          <FormInput
            className="navbar-search"
            placeholder="Enter the category or mentor's name"
            onChange={(e) => this.onChangeSearchText(e)}
            value={searchKey}
          />
          <InputGroupAddon type="append">
            <Button className="navbar-search btn-search" onClick={() => this.onSearch()}>
              <InputGroupText>
                <img src={SearchIcon} alt="search-icon"/>
              </InputGroupText>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </Form>
    )
  }
};
