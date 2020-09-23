import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "shards-react";

import MoreButtonImage from "../../images/more.svg"

class SmallCardPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
  }

  toggle() {
    this.setState(prevState => {
      return { open: !prevState.open };
    });
  }

  render() {
    const { title, image, expireDate, isPrimary } = this.props;
    const { open } = this.state;
    return (
      <Card small className="small-card-payment" >
        <CardBody className="no-padding">
          <div className="items-container">
            <div className="no-padding">
                <img src={image} className="small-card-payment-logo" alt="card"/>
            </div>
            <div className="small-card-payment-desc">
                <h4 className="small-card-payment-title no-margin">{title}</h4>
                <h6 className="small-card-payment-expiredate no-margin">Expires: {expireDate}</h6>
            </div>
            <div className="no-padding">
              {
                isPrimary ?
                  <div className="small-card-payment-private">
                    Primary
                  </div>
                :
                null
              }
              <Dropdown open={this.state.open} toggle={this.toggle}>
                <DropdownToggle className="no-padding" style={{marginTop: 20}}>
                  <div className="nav-link-icon__wrapper">
                    <img
                      className="user-avatar mr-2"
                      src={MoreButtonImage}
                      alt="User Avatar"
                    />{" "}
                  </div>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    Edit
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

SmallCardPayment.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SmallCardPayment.defaultProps = {
  value: 0,
  label: "Label",
};

export default SmallCardPayment;
