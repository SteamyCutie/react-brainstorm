import React from "react";

import {
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  Button
} from "shards-react";
import MultiSelect from "react-multi-select-component";
import { gettags } from '../../../api/api';

import SearchIcon from '../../../images/SearchIcon.svg'

// export default () => (
export default class NavbarSearch extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      searchKey: (localStorage.getItem('searchKey') === null || localStorage.getItem('searchKey') === undefined) ? "" : localStorage.getItem('searchKey'),
      selectedTags: [],
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
          this.removeSession();
          window.location.href = "/";
        } else if (result.data.message === "Token is Invalid") {
          this.removeSession();
          window.location.href = "/";
        } else if (result.data.message === "Authorization Token not found") {
          this.removeSession();
          window.location.href = "/";
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
    this.setState({selectedTags: temp});

    if (e.length > 0) {
      const { param } = this.state;
      let temp1 = param;
      temp1.tags = [];
      for(var i = 0; i < e.length; i ++) {
        temp1.tags.push(e[i].value);
      }
      this.setState({param: temp1});
    } else {
      const { param } = this.state;
      let temp1 = param;
      temp1.tags = [];
      this.setState({param: temp1});
    }
  }

  removeSession() {
    localStorage.clear();
  }

  onSearch() {
    const { toggle_search } = this.props;
    const { param } = this.state;
    toggle_search(param)
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
