import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "shards-react";
import visa from '../../images/VisaCard-logo.png';
import master from '../../images/Mastercard-logo.png';
import travel from '../../images/Travelcard-logo.jpg';
import discover from '../../images/Discovercard-logo.jpg';

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

  setAsDefault(id) {
    const { setAsDefault } = this.props;
    setAsDefault(id);
    console.log(id);
  }

  deleteStudentCard(id) {
    const { deleteStudentCard } = this.props;
    deleteStudentCard(id);
    console.log(id);
  }

  render() {
    const { title, type, expireDate, isPrimary, id } = this.props;
    const { open } = this.state;
    return (
      <Card small className="small-card-payment" >
        <CardBody className="no-padding">
          <div className="items-container">
            <div className="no-padding">
              {type === 3 && <img src={travel} className="small-card-payment-logo" alt="card"/>}
              {type === 4 && <img src={visa} className="small-card-payment-logo" alt="card"/>}
              {type === 5 && <img src={master} className="small-card-payment-logo" alt="card"/>}
              {type === 6 && <img src={discover} className="small-card-payment-logo" alt="card"/>}              
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
              <Dropdown open={open} toggle={this.toggle}>
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
                  <DropdownItem onClick={() => this.setAsDefault(id)}>
                    Set As Default
                  </DropdownItem>
                  <DropdownItem onClick={() => this.deleteStudentCard(id)}>
                    Delete
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
