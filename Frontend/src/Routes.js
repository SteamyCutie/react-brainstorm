import React from "react";
import { Redirect } from "react-router-dom";

import { DefaultLayout, LandingPageLayout } from "./layouts";

import MentorSession from "./views/MentorSession";
import Profile from "./views/Profile";
import SetAvailability from "./views/SetAvailability";
import MentorWallet from "./views/MentorWallet";
import MySharePage from "./views/MySharePage";
import ScheduleLiveForum from "./views/ScheduleLiveForum";
import LandingPage from "./views/LandingPage";
import StudentSession from "./views/StudentSession";
import StudentWallet from "./views/StudentWallet";
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
    component: MentorSession
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
    component: MentorWallet
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
    component: StudentSession
  },
  {
    path: "/studentWallet",
    layout: DefaultLayout,
    component: StudentWallet
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
