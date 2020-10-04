export default function() {
  return [
    {
      title: "Mentor Dashboard",
      htmlBefore: 
        '<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="63.699px" height="63.699px" viewBox="0 0 63.699 63.699" xml:space="preserve"><path d="M63.663,29.424c-0.143-1.093-0.701-2.065-1.575-2.737l-11.715-9.021V8.608c0-2.275-1.851-4.126-4.125-4.126   c-2.273,0-4.125,1.851-4.125,4.126v2.705l-7.758-5.975c-0.718-0.551-1.612-0.856-2.517-0.856c-0.906,0-1.801,0.304-2.519,0.857   L1.606,26.687c-1.802,1.389-2.139,3.983-0.751,5.785c0.788,1.022,1.979,1.608,3.271,1.608c0.664,0,1.302-0.153,1.88-0.451V55.09   c0,2.275,1.851,4.127,4.126,4.127h18.534V39.732h6.351v19.482h18.271c2.274,0,4.125-1.85,4.125-4.127V33.472   c0.649,0.399,1.387,0.608,2.157,0.608c1.289,0,2.482-0.586,3.27-1.606C63.514,31.601,63.807,30.518,63.663,29.424z M59.819,30.144   c-0.08,0.105-0.189,0.122-0.247,0.122c-0.069,0-0.132-0.021-0.188-0.065L53.6,25.748V55.09c0,0.173-0.14,0.312-0.311,0.312H38.832   l0.001-19.484H24.852v19.484H10.132c-0.171,0-0.31-0.141-0.31-0.312V25.96L4.315,30.2c-0.056,0.043-0.119,0.065-0.188,0.065   c-0.059,0-0.167-0.017-0.248-0.121c-0.065-0.084-0.07-0.171-0.062-0.229c0.007-0.058,0.034-0.141,0.118-0.205L31.661,8.363   c0.138-0.105,0.239-0.106,0.379,0l13.899,10.703V8.608c0-0.172,0.14-0.311,0.311-0.311s0.312,0.139,0.312,0.311v10.935   l13.205,10.166c0.084,0.064,0.108,0.147,0.116,0.205C59.891,29.975,59.885,30.062,59.819,30.144z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
      title: "Schedule Live Forum",
      htmlBefore: '<svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 3L16 8L23 13V3Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 1H3C1.89543 1 1 1.89543 1 3V13C1 14.1046 1.89543 15 3 15H14C15.1046 15 16 14.1046 16 13V3C16 1.89543 15.1046 1 14 1Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      to: "/scheduleLiveForum",
      filter: true,
    },
    {
      title: "Student Dashboard",
      htmlBefore: '<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="63.699px" height="63.699px" viewBox="0 0 63.699 63.699" xml:space="preserve"><g><path d="M63.663,29.424c-0.143-1.093-0.701-2.065-1.575-2.737l-11.715-9.021V8.608c0-2.275-1.851-4.126-4.125-4.126   c-2.273,0-4.125,1.851-4.125,4.126v2.705l-7.758-5.975c-0.718-0.551-1.612-0.856-2.517-0.856c-0.906,0-1.801,0.304-2.519,0.857   L1.606,26.687c-1.802,1.389-2.139,3.983-0.751,5.785c0.788,1.022,1.979,1.608,3.271,1.608c0.664,0,1.302-0.153,1.88-0.451V55.09   c0,2.275,1.851,4.127,4.126,4.127h18.534V39.732h6.351v19.482h18.271c2.274,0,4.125-1.85,4.125-4.127V33.472   c0.649,0.399,1.387,0.608,2.157,0.608c1.289,0,2.482-0.586,3.27-1.606C63.514,31.601,63.807,30.518,63.663,29.424z M59.819,30.144   c-0.08,0.105-0.189,0.122-0.247,0.122c-0.069,0-0.132-0.021-0.188-0.065L53.6,25.748V55.09c0,0.173-0.14,0.312-0.311,0.312H38.832   l0.001-19.484H24.852v19.484H10.132c-0.171,0-0.31-0.141-0.31-0.312V25.96L4.315,30.2c-0.056,0.043-0.119,0.065-0.188,0.065   c-0.059,0-0.167-0.017-0.248-0.121c-0.065-0.084-0.07-0.171-0.062-0.229c0.007-0.058,0.034-0.141,0.118-0.205L31.661,8.363   c0.138-0.105,0.239-0.106,0.379,0l13.899,10.703V8.608c0-0.172,0.14-0.311,0.311-0.311s0.312,0.139,0.312,0.311v10.935   l13.205,10.166c0.084,0.064,0.108,0.147,0.116,0.205C59.891,29.975,59.885,30.062,59.819,30.144z"/></g></svg>',
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
      title: "Recommended",
      to: "/recommended",
      htmlBefore: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V12C1 11.4696 1.21071 10.9609 1.58579 10.5858C1.96086 10.2107 2.46957 10 3 10H6M13 8V4C13 3.20435 12.6839 2.44129 12.1213 1.87868C11.5587 1.31607 10.7956 1 10 1L6 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H13Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      htmlAfter: "",
      filter: false,
    }
  ];
}
