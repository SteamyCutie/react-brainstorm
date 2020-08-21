import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, LandingPageLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import LandingPage from "./views/LandingPage";

export default [
  {
    path: "/",
    exact: true,
    layout: LandingPageLayout,
    component: () => <Redirect to="/LandingPage" />
  },
  {
    path: "/LandingPage",
    layout: LandingPageLayout,
    component: LandingPage
  },
  {
    path: "/upcomingSession",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/profile",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/setAvailability",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/wallet",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/mySharePage",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/scheduleLiveForum",
    layout: DefaultLayout,
    component: Tables
  }
];
