import React from "react";

import {
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button
} from "shards-react";
import MultiSelect from "react-multi-select-component";
import { gettags, signout } from '../../../api/api';

import SearchIcon from '../../../images/SearchIcon.svg'

// export default () => (
export default class NavbarSearch extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      searchKey: (localStorage.getItem('searchKey') === null || localStorage.getItem('searchKey') === undefined) ? "" : localStorage.getItem('searchKey'),
      selectedTags: (localStorage.getItem('search-category') === null ? [] : JSON.parse(localStorage.getItem('search-category'))),
      tags: [],
      param: {
        tags: []
      }
    }
  }

  componentWillMount() {
    this.getAllTags();
  }

  onChangeSearchText(e) {
    this.setState({searchKey: e.target.value});
  }

  getAllTags = async() => {
    try {
      const result = await gettags();
      if (result.data.result === "success") {
        let param = {
          label: '',
          value: ''
        };

        let params = [];

        for (var i = 0; i < result.data.data.length; i ++) {
          param.label = result.data.data[i].name;
          param.value = result.data.data[i].id;
          params.push(param);
          param = {};
        }
        this.setState({tags: params});
      } else if (result.data.result === "warning") {
      } else {
        if (result.data.message === "Token is Expired") {
          this.signout();
        } else if (result.data.message === "Token is Invalid") {
          this.signout();
        } else if (result.data.message === "Authorization Token not found") {
          this.signout();
        } else {
          this.showFail(result.data.message);
        }
      }
    } catch(err) {
      this.showFail("Something Went wrong");
    };
  }

  onChangeTags = (e) => {
    const {selectedTags} = this.state;
    let temp = selectedTags;
    temp = e;
    localStorage.removeItem('search-category');
    localStorage.setItem('search-category', JSON.stringify(temp));
    this.setState({selectedTags: temp});
  }

  signout = async() => {
    const param = {
      email: localStorage.getItem('email')
    }

    try {
      const result = await signout(param);
      if (result.data.result === "success") {
        this.removeSession();
      } else if (result.data.result === "warning") {
        this.removeSession();
      } else {
        if (result.data.message === "Token is Expired") {
          this.removeSession();
        } else if (result.data.message === "Token is Invalid") {
          this.removeSession();
        } else if (result.data.message === "Authorization Token not found") {
          this.removeSession();
        } else {
          this.removeSession();
        }
      }
    } catch(error) {
      this.removeSession();
    }
  }

  removeSession() {
    localStorage.clear();
    window.location.href = "/";
  }

  onSearch() {
    const { toggle_search } = this.props;
    const { selectedTags } = this.state;
    toggle_search(selectedTags)
  }

  render() {
    const { tags, selectedTags } = this.state;
    return (
      <>
      <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
        <InputGroup seamless className="ml-3 search-bar">
          <MultiSelect
            hasSelectAll={false}
            options={tags}
            value={selectedTags}
            onChange={(e) => this.onChangeTags(e)}
            labelledBy={"Enter the category"}
            className="top-navbar-search"
            overrideStrings={{
              selectSomeItems: "Enter the category",
              allItemsAreSelected: "All Items are Selected",
              selectAll: "Select All",
              search: "Search",
            }}
          />
          <InputGroupAddon type="append">
            <Button className={JSON.parse(localStorage.getItem('user-type')) ? "navbar-search btn-search-mentor" : "navbar-search btn-search" } onClick={() => this.onSearch()}>
              <InputGroupText>
                <img src={SearchIcon} alt="search-icon"/>
              </InputGroupText>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </Form>
      </>
    )
  }
};
