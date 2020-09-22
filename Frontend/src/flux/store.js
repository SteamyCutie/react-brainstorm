import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";
import getSearchSidebarNavItems from "../data/search-sidebar-nav-items";

let _store = {
  menuVisible: false,
  userType: true,
  mentorUrl: "/mentorSession",
  studentUrl: "/studentSession",
  navItems: getSidebarNavItems(),
  searchItems: getSearchSidebarNavItems()
};

class Store extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);

    Dispatcher.register(this.registerToActions.bind(this));
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;
      case Constants.TOGGLE_USER_TYPE:
        this.setUserType();
        break;
      case Constants.MENTOR_URL:
        this.setMentorHistory(payload);
        break;
      case Constants.STUDENT_URL:
        this.setStudentHistory(payload);
        break;
      default:
    }
  }

  toggleSidebar() {
    _store.menuVisible = !_store.menuVisible;
    this.emit(Constants.CHANGE);
  }

  getMenuState() {
    return _store.menuVisible;
  }

  getMentorHistory() {
    return _store.mentorUrl;
  }

  setMentorHistory(url) {
    _store.mentorUrl = url;
    this.emit(Constants.CHANGE);
  }
  
  getStudentHistory() {
    return _store.studentUrl;
  }
  
  setStudentHistory(url) {
    _store.studentUrl = url;
    this.emit(Constants.CHANGE);
  }

  getSidebarItems() {
    return _store.navItems;
  }

  getSearchSidebarItems() {
    return _store.searchItems;
  }

  getUserType() {
    return _store.userType;
  }

  setUserType() {
    _store.userType = !_store.userType;
    this.emit(Constants.CHANGE);
  }

  addChangeListener(callback) {
    this.on(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }
}

export default new Store();
