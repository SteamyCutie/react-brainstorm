import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, LandingPageLayout } from "./layouts";

// Route Views
import UpcomingSession from "./views/UpcomingSession";
import Profile from "./views/Profile";
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
import SpecificSubscription from "./views/SpecificSubscription";
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
    path: "/mentorSession",
    layout: DefaultLayout,
    component: UpcomingSession
  },
  {
    path: "/profile",
    layout: DefaultLayout,
    component: Profile
  },
  {
    path: "/setAvailability",
    layout: DefaultLayout,
    component: SetAvailability
  },
  {
    path: "/mentorWallet",
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
    path: "/studentSession",
    layout: DefaultLayout,
    component: UpcommingSessionStu
  },
  {
    path: "/studentWallet",
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
    path: "/subscription-specific", /* specific must be user id on this system */
    layout: DefaultLayout,
    component: SpecificSubscription
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
