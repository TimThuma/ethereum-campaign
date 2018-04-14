import React, { Component } from 'react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

import { Table, Button } from 'semantic-ui-react';

class RequestRow extends Component {

  onApprove = async event => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
  };

  onFinalize = async event => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });
  }

  render() {
    const { Row, Cell } = Table;
    const { description, value, approvalCount, recipient, complete } = this.props.request;
    const readyToFinalize = approvalCount > this.props.approversCount / 2;
    return (
      <Row disabled={complete} positive={readyToFinalize && !complete}>
        <Cell>{`#${this.props.id + 1}`}</Cell>
        <Cell>{description}</Cell>
        <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>{`${approvalCount}/${this.props.approversCount}`}</Cell>
        <Cell>
          {
            complete ? null : (
              <Button color="green" basic onClick={this.onApprove}>
                Approve
              </Button>
            )
          }
        </Cell>
        <Cell>
          {
            complete ? null : (
              <Button color="teal" basic onClick={this.onFinalize}>
                Finalize
              </Button>
            )
          }
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
