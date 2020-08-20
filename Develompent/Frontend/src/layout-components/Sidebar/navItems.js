import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import PaymentRoundedIcon from '@material-ui/icons/PaymentRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined';
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';
import ImportContactsTwoToneIcon from '@material-ui/icons/ImportContactsTwoTone';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';

var iconsMap = {
  CalendarTodayOutlinedIcon: CalendarTodayOutlinedIcon,
  PaymentRoundedIcon: PaymentRoundedIcon,
  TrendingUpRoundedIcon: TrendingUpRoundedIcon,
  PermIdentityOutlinedIcon: PermIdentityOutlinedIcon,
  QueryBuilderOutlinedIcon: QueryBuilderOutlinedIcon,
  ShareOutlinedIcon: ShareOutlinedIcon,
  VideocamOutlinedIcon: VideocamOutlinedIcon,
  SyncOutlinedIcon: SyncOutlinedIcon,
  CachedOutlinedIcon: CachedOutlinedIcon,
  ImportContactsTwoToneIcon: ImportContactsTwoToneIcon,
  ThumbUpAltOutlinedIcon: ThumbUpAltOutlinedIcon
};

const mentor_json_string = `[
  {
    "label": " Upcoming sessions",
    "icon": "CalendarTodayOutlinedIcon",
    "to": "/upcomingSessions"
  },
  {
    "label": "Profile",
    "icon": "PermIdentityOutlinedIcon",
    "to": "/profile"
  },
  {
    "label": "Set availability",
    "icon": "QueryBuilderOutlinedIcon",
    "to": "/setAvailability"
  },
  {
    "label": "Wallet",
    "icon": "PaymentRoundedIcon",
    "to": "/wallet"
  },
  {
    "label": "My share page",
    "icon": "ShareOutlinedIcon",
    "to": "/mySharePage"
  },
  {
    "label": "Schedule live Forum",
    "icon": "VideocamOutlinedIcon",
    "to": "/scheduleLiveForum"
  }
]`;

const student_json_string = `[
  {
    "label": "Upcoming sessions",
    "icon": "CalendarTodayOutlinedIcon",
    "to": "/upcomingSessions"
  },
  {
    "label": "Payment",
    "icon": "PaymentRoundedIcon",
    "to": "/payment"
  },
  {
    "label": "Trending",
    "icon": "TrendingUpRoundedIcon",
    "to": "/trending"
  },
  {
    "label": "Subscriptions",
    "icon": "CachedOutlinedIcon",
    "to": "/subscriptions"
  },
  {
    "label": "Library",
    "icon": "ImportContactsTwoToneIcon",
    "to": "/library"
  },
  {
    "label": "History",
    "icon": "QueryBuilderOutlinedIcon",
    "to": "/history"
  },
  {
    "label": "Recommended",
    "icon": "ThumbUpAltOutlinedIcon",
    "to": "/recommended"
  }
]`;


export default [
  {
    label: '',
    content: JSON.parse(
      student_json_string,
      (key, value) => {
        if (key === 'icon') {
          return iconsMap[value];
        } else {
          return value;
        }
      }
    )
  }
];
