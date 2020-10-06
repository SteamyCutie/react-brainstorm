import React, { Component } from 'react';
import { Modal, Button } from "shards-react";
import { PlaidLink } from 'react-plaid-link';
import axios from 'axios';
import Close from '../../images/Close.svg'

class Link extends Component {
  constructor() {
    super();

    this.state = {
      transactions: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

  toggle() {
    const { toggle } = this.props;
    toggle();    
  }

  handleOnSuccess(public_token, metadata) {
    // send token to client server
    axios.post("/auth/public_token", {
      public_token: public_token
    });
  }

  handleOnExit() {
    // handle the case when your user exits Link
    // For the sake of this tutorial, we're not going to be doing anything here.
  }

  handleClick(res) {
    axios.get("/transactions").then(res => {
      this.setState({ transactions: res.data });
    });
  }

  render() {
    const { open } = this.props;
    return (
      <div>
        <Modal size="md" open={open} type="backdrop" toggle={() => this.toggle()} className="modal-class" backdrop={true} backdropClassName="backdrop-class">
          <Button onClick={() => this.toggle()} className="close-button-class"><img src={Close} alt="Close" /></Button>
          <PlaidLink
            clientName="React Plaid Setup"
            env="sandbox"
            product={["auth", "transactions"]}
            publickey="add your public key here"
            onExit={this.handleOnExit}
            onSuccess={this.handleOnSuccess}
            className="test">
              Open Link and connect your bank!
          </PlaidLink>
          <div>
            <button onClick={this.handleClick}>Get Transactions</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Link;