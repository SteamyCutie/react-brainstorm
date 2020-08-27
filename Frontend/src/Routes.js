import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, LandingPageLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import SetAvailability from "./views/SetAvailability";
import Errors from "./views/Errors";
import Wallet from "./views/Wallet";
import MySharePage from "./views/MySharePage";
import ScheduleLiveForum from "./views/ScheduleLiveForum";
import BlogPosts from "./views/BlogPosts";
import LandingPage from "./views/LandingPage";
import UpcommingSessionStu from "./views/UpcommingSessionStu";
import WalletStu from "./views/WalletStu";
import Trending from "./views/Trending";
import Subscriptions from "./views/Subscriptions";
import Library from "./views/Library";
import Recommended from "./views/Recommended";

export default [
  {
    path: "/",
    exact: true,
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
    component: SetAvailability
  },
  {
    path: "/wallet",
    layout: DefaultLayout,
    component: Wallet
  },
  {
    path: "/mySharePage",
    layout: DefaultLayout,
    component: MySharePage
  },
  {
    path: "/scheduleLiveForum",
    layout: DefaultLayout,
    component: ScheduleLiveForum
  },
  {
    path: "/upcomingSession-stu",
    layout: DefaultLayout,
    component: UpcommingSessionStu
  },
  {
    path: "/payment",
    layout: DefaultLayout,
    component: WalletStu
  },
  {
    path: "/trending",
    layout: DefaultLayout,
    component: Trending
  },
  {
    path: "/subscriptions",
    layout: DefaultLayout,
    component: Subscriptions
  },
  {
    path: "/library",
    layout: DefaultLayout,
    component: Library
  },
  {
    path: "/history",
    layout: DefaultLayout,
    component: Library
  },
  {
    path: "/recommended",
    layout: DefaultLayout,
    component: Recommended
  }
];
