import { DefaultLayout, LandingPageLayout, ExtraPageLayout } from "./layouts";

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
import Subscribe from "./views/Subscribe";
import Library from "./views/Library";
import History from "./views/History";
import Recommended from "./views/Recommended";
import EmailVerify from "./views/EmailVerify"
import ForgetPassword from "./views/ForgetPassword"
import ResetPassword from "./views/ResetPassword"
import EmailSent from "./views/EmailSent"

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
    path: "/unsubscription-specific/:id", /* specific must be user id on this system */
    layout: DefaultLayout,
    component: SpecificSubscription
  },
  {
    path: "/subscribe-specific/:id", /* specific must be user id on this system */
    layout: DefaultLayout,
    component: Subscribe
  },
  {
    path: "/library",
    layout: DefaultLayout,
    component: Library
  },
  {
    path: "/history",
    layout: DefaultLayout,
    component: History
  },
  {
    path: "/recommended",
    layout: DefaultLayout,
    component: Recommended
  },
  {
    path: "/verification",
    layout: ExtraPageLayout,
    component: EmailVerify 
  },
  {
    path: "/forgetpassword",
    layout: ExtraPageLayout,
    component: ForgetPassword
  },
  {
    path: "/resetpassword",
    layout: ExtraPageLayout,
    component: ResetPassword
  },
  {
    path: "/emailsent",
    layout: ExtraPageLayout,
    component: EmailSent
  }
];
