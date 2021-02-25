import React from "react";
import { Card, CardBody } from "shards-react";
import bank from '../../images/Bank-logo.png';

class SmallCardPayment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    }
  }

  render() {    
    return (
      <Card small className="small-card-payment" >
        <CardBody className="no-padding">
          <div className="items-container">
            <div className="no-padding">
              <img src={bank} className="small-card-payment-logo" alt="Bank"/>
            </div>
            <div className="small-card-payment-desc">
                <h1 className="small-bank-payment-title"> Bank</h1>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default SmallCardPayment;
