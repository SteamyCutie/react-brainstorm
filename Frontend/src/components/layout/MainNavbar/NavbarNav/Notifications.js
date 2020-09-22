import React from "react";
import { Dropdown, DropdownToggle } from "shards-react";

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  }

  render() {
    return (

      <Dropdown open={this.state.open} toggle={this.toggle}>
        <DropdownToggle style={{paddingTop: 15}} >
          <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5029 7.60117C17.5029 5.85043 16.8074 4.1714 15.5695 2.93344C14.3315 1.69548 12.6525 1 10.9018 1C9.15102 1 7.47198 1.69548 6.23402 2.93344C4.99606 4.1714 4.30058 5.85043 4.30058 7.60117C4.30058 15.3025 1 17.5029 1 17.5029H20.8035C20.8035 17.5029 17.5029 15.3025 17.5029 7.60117Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.8047 21.9037C12.6113 22.2371 12.3337 22.5139 11.9996 22.7063C11.6656 22.8987 11.2869 23 10.9014 23C10.5159 23 10.1372 22.8987 9.80314 22.7063C9.4691 22.5139 9.19147 22.2371 8.99805 21.9037" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* <Badge pill theme="danger badge-class">0</Badge>{" "} */}
        </DropdownToggle>
        {/* <DropdownMenu>
          
        </DropdownMenu> */}
      </Dropdown>
    );
  }
}
