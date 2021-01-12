export default function() {
  return [
    {
      title: "Mentor Dashboard",
      htmlBefore: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none"><path d="M1 8L10 1L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 21V11H13V21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      to: "/mentordashboard",
      filter: true,
    },
    {
      title: "Upcoming Session",
      to: "/mentorSession",
      htmlBefore: '<svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 1V5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 1V5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 9H19" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: true
    },
    {
      title: "Set availability",
      htmlBefore: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 5V11L15 13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      to: "/setAvailability",
      filter: true,
    },
    {
      title: "Wallet",
      htmlBefore: '<svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 1H3C1.89543 1 1 1.89543 1 3V15C1 16.1046 1.89543 17 3 17H21C22.1046 17 23 16.1046 23 15V3C23 1.89543 22.1046 1 21 1Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 7H23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      to: "/mentorWallet",
      filter: true,
    },
    {
      title: "My share page",
      htmlBefore: '<svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.6668 7.66667C19.5078 7.66667 21.0002 6.17428 21.0002 4.33333C21.0002 2.49238 19.5078 1 17.6668 1C15.8259 1 14.3335 2.49238 14.3335 4.33333C14.3335 6.17428 15.8259 7.66667 17.6668 7.66667Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.33333 15.4444C6.17428 15.4444 7.66667 13.9521 7.66667 12.1111C7.66667 10.2702 6.17428 8.77777 4.33333 8.77777C2.49238 8.77777 1 10.2702 1 12.1111C1 13.9521 2.49238 15.4444 4.33333 15.4444Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.6668 23.2222C19.5078 23.2222 21.0002 21.7298 21.0002 19.8889C21.0002 18.0479 19.5078 16.5556 17.6668 16.5556C15.8259 16.5556 14.3335 18.0479 14.3335 19.8889C14.3335 21.7298 15.8259 23.2222 17.6668 23.2222Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.21143 13.7889L14.8003 18.2111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.7892 6.01112L7.21143 10.4333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      to: "/mySharePage",
      filter: true,
    },
    {
      title: "Associations",
      htmlBefore: '<svg width="23" height="28" viewBox="0 0 23 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.194 20.2708V17.7959C10.0937 17.6087 9.26161 16.7415 9.26161 15.7C9.26161 15.2684 9.40452 14.8667 9.65022 14.5309L7.32917 12.9969L5.00812 14.5309C5.25383 14.8667 5.39674 15.2684 5.39674 15.7C5.39674 16.1347 5.25176 16.5391 5.00281 16.8763L10.2823 20.6149C10.551 20.447 10.8602 20.3276 11.194 20.2708ZM12.0859 20.2708C12.4198 20.3276 12.729 20.447 12.9977 20.6149L18.2772 16.8763C18.0282 16.5391 17.8832 16.1347 17.8832 15.7C17.8832 15.2684 18.0261 14.8667 18.2718 14.5309L15.9508 12.9969L13.6297 14.5309C13.8754 14.8667 14.0184 15.2684 14.0184 15.7C14.0184 16.7415 13.1863 17.6087 12.0859 17.7959V20.2708ZM13.6244 21.1903C13.8734 21.5276 14.0184 21.9319 14.0184 22.3667C14.0184 23.5449 12.9535 24.5 11.64 24.5C10.3264 24.5 9.26161 23.5449 9.26161 22.3667C9.26161 21.9319 9.40658 21.5276 9.65554 21.1903L4.3761 17.4518C3.99111 17.6923 3.5231 17.8333 3.01836 17.8333C1.70482 17.8333 0.639984 16.8782 0.639984 15.7C0.639984 14.6585 1.47203 13.7913 2.57242 13.6041V11.3959C1.47203 11.2087 0.639984 10.3415 0.639984 9.3C0.639984 8.12179 1.70482 7.16667 3.01836 7.16667C3.5231 7.16667 3.99111 7.30769 4.3761 7.54821L9.65554 3.80966C9.40658 3.47244 9.26161 3.06807 9.26161 2.63333C9.26161 1.45513 10.3264 0.5 11.64 0.5C12.9535 0.5 14.0184 1.45513 14.0184 2.63333C14.0184 3.06807 13.8734 3.47244 13.6244 3.80966L18.9039 7.54821C19.2889 7.30769 19.7569 7.16667 20.2616 7.16667C21.5751 7.16667 22.64 8.12179 22.64 9.3C22.64 10.3415 21.8079 11.2087 20.7076 11.3959V13.6041C21.8079 13.7913 22.64 14.6585 22.64 15.7C22.64 16.8782 21.5751 17.8333 20.2616 17.8333C19.7569 17.8333 19.2889 17.6923 18.9039 17.4518L13.6244 21.1903ZM4.38129 13.9515L6.57741 12.5L4.38129 11.0485C4.11136 11.2181 3.80035 11.3387 3.46431 11.3959V13.6041C3.80035 13.6613 4.11136 13.7819 4.38129 13.9515ZM5.00812 10.4691L7.32917 12.0031L9.65022 10.4691C9.40452 10.1333 9.26161 9.73164 9.26161 9.3C9.26161 8.25851 10.0937 7.39134 11.194 7.20411V4.72923C10.8602 4.67242 10.551 4.55301 10.2823 4.38512L5.00281 8.12367C5.25176 8.46089 5.39674 8.86526 5.39674 9.3C5.39674 9.73164 5.25383 10.1333 5.00812 10.4691ZM18.8987 13.9515C19.1686 13.7819 19.4796 13.6613 19.8157 13.6041V11.3959C19.4796 11.3387 19.1686 11.2181 18.8987 11.0485L16.7026 12.5L18.8987 13.9515ZM18.2772 8.12367L12.9977 4.38512C12.729 4.55301 12.4198 4.67242 12.0859 4.72923V7.20411C13.1863 7.39134 14.0184 8.25851 14.0184 9.3C14.0184 9.73164 13.8754 10.1333 13.6297 10.4691L15.9508 12.0031L18.2718 10.4691C18.0261 10.1333 17.8832 9.73164 17.8832 9.3C17.8832 8.86526 18.0282 8.46089 18.2772 8.12367ZM10.2771 13.9515C10.663 13.709 11.133 13.5667 11.64 13.5667C12.147 13.5667 12.6169 13.709 13.0029 13.9515L15.199 12.5L13.0029 11.0485C12.6169 11.291 12.147 11.4333 11.64 11.4333C11.133 11.4333 10.663 11.291 10.2771 11.0485L8.08094 12.5L10.2771 13.9515ZM11.64 10.6333C12.4609 10.6333 13.1265 10.0364 13.1265 9.3C13.1265 8.56362 12.4609 7.96667 11.64 7.96667C10.819 7.96667 10.1535 8.56362 10.1535 9.3C10.1535 10.0364 10.819 10.6333 11.64 10.6333ZM11.64 17.0333C12.4609 17.0333 13.1265 16.4364 13.1265 15.7C13.1265 14.9636 12.4609 14.3667 11.64 14.3667C10.819 14.3667 10.1535 14.9636 10.1535 15.7C10.1535 16.4364 10.819 17.0333 11.64 17.0333ZM20.2616 10.6333C21.0826 10.6333 21.7481 10.0364 21.7481 9.3C21.7481 8.56362 21.0826 7.96667 20.2616 7.96667C19.4406 7.96667 18.7751 8.56362 18.7751 9.3C18.7751 10.0364 19.4406 10.6333 20.2616 10.6333ZM20.2616 17.0333C21.0826 17.0333 21.7481 16.4364 21.7481 15.7C21.7481 14.9636 21.0826 14.3667 20.2616 14.3667C19.4406 14.3667 18.7751 14.9636 18.7751 15.7C18.7751 16.4364 19.4406 17.0333 20.2616 17.0333ZM3.01836 10.6333C3.83933 10.6333 4.50485 10.0364 4.50485 9.3C4.50485 8.56362 3.83933 7.96667 3.01836 7.96667C2.1974 7.96667 1.53188 8.56362 1.53188 9.3C1.53188 10.0364 2.1974 10.6333 3.01836 10.6333ZM3.01836 17.0333C3.83933 17.0333 4.50485 16.4364 4.50485 15.7C4.50485 14.9636 3.83933 14.3667 3.01836 14.3667C2.1974 14.3667 1.53188 14.9636 1.53188 15.7C1.53188 16.4364 2.1974 17.0333 3.01836 17.0333ZM11.64 23.7C12.4609 23.7 13.1265 23.103 13.1265 22.3667C13.1265 21.6303 12.4609 21.0333 11.64 21.0333C10.819 21.0333 10.1535 21.6303 10.1535 22.3667C10.1535 23.103 10.819 23.7 11.64 23.7ZM11.64 3.96667C12.4609 3.96667 13.1265 3.36971 13.1265 2.63333C13.1265 1.89695 12.4609 1.3 11.64 1.3C10.819 1.3 10.1535 1.89695 10.1535 2.63333C10.1535 3.36971 10.819 3.96667 11.64 3.96667Z" fill="#999999"/></svg>',
      to: "/associations",
      filter: true,
    },
    {
      title: "Schedule Live Forum",
      htmlBefore: '<svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 3L16 8L23 13V3Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 1H3C1.89543 1 1 1.89543 1 3V13C1 14.1046 1.89543 15 3 15H14C15.1046 15 16 14.1046 16 13V3C16 1.89543 15.1046 1 14 1Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      to: "/scheduleLiveForum",
      filter: true,
    },
    {
      title: "Student Dashboard",
      htmlBefore: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none"><path d="M1 8L10 1L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 21V11H13V21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      to: "/studentdashboard",
      filter: false,
    },
    {
      title: "Upcoming Session",
      to: "/studentSession",
      htmlBefore: '<svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 1V5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 1V5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 9H19" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: false,
    },
    {
      title: "Wallet",
      to: "/studentWallet",
      htmlBefore: '<svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 1H3C1.89543 1 1 1.89543 1 3V15C1 16.1046 1.89543 17 3 17H21C22.1046 17 23 16.1046 23 15V3C23 1.89543 22.1046 1 21 1Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 7H23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: false,
    },
    {
      title: "Trending",
      to: "/trending",
      htmlBefore: '<svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 1L13.5 10.5L8.5 5.5L1 13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 1H23V7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: false,
    },
    {
      title: "Subscriptions",
      to: "/subscriptions",
      htmlBefore: '<svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 1.99756V7.99756H17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 17.9976V11.9976H7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 6.99763C4.01717 5.56442 4.87913 4.28304 6.01547 3.27305C7.1518 2.26307 8.52547 1.5574 10.0083 1.22189C11.4911 0.886385 13.0348 0.931975 14.4952 1.35441C15.9556 1.77684 17.2853 2.56235 18.36 3.63763L23 7.99763M1 11.9976L5.64 16.3576C6.71475 17.4329 8.04437 18.2184 9.50481 18.6409C10.9652 19.0633 12.5089 19.1089 13.9917 18.7734C15.4745 18.4379 16.8482 17.7322 17.9845 16.7222C19.1209 15.7122 19.9828 14.4308 20.49 12.9976" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: false,
    },
    {
      title: "Library",
      to: "/library",
      htmlBefore: '<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1H7C8.06087 1 9.07828 1.42143 9.82843 2.17157C10.5786 2.92172 11 3.93913 11 5V19C11 18.2044 10.6839 17.4413 10.1213 16.8787C9.55871 16.3161 8.79565 16 8 16H1V1Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 1H15C13.9391 1 12.9217 1.42143 12.1716 2.17157C11.4214 2.92172 11 3.93913 11 5V19C11 18.2044 11.3161 17.4413 11.8787 16.8787C12.4413 16.3161 13.2044 16 14 16H21V1Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: false,
    },
    {
      title: "History",
      to: "/history",
      htmlBefore: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 5V11L15 13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: false,
    },
    {
      title: "History",
      to: "/mentorhistory",
      htmlBefore: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 5V11L15 13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: true,
    },
    {
      title: "Recommended",
      to: "/recommended",
      htmlBefore: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V12C1 11.4696 1.21071 10.9609 1.58579 10.5858C1.96086 10.2107 2.46957 10 3 10H6M13 8V4C13 3.20435 12.6839 2.44129 12.1213 1.87868C11.5587 1.31607 10.7956 1 10 1L6 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H13Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: false,
    }
  ];
}
