import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button, Image } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';
import Jdenticon from '../../components/Jdenticon';
import getSummary from '../../utils/get-campaign-summary';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await getSummary(campaign);
    return Object.assign(summary, { address: props.query.address });
  }

  renderCards() {
    const {
      title,
      description,
      address,
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount
    } = this.props;

    const items = [];

    items.push({
      header: manager,
      meta: 'Address of Manager',
      description:
        'The manager created this campaign and can create requests to withdraw money',
      style: { overflowWrap: 'break-word' }
    });

    items.push({
      header: minimumContribution,
      meta: 'Minimum Contribution (wei)',
      description:
        'You must contribute at least this much wei to become an approver'
    });

    items.push({
      header: requestsCount,
      meta: 'Number of Requests',
      description:
        'A request tries to withdraw money from the contract. Requests must be approved by approvers'
    });

    items.push({
      header: approversCount,
      meta: 'Number of Approvers',
      description: 'Number of people who have already donated to this campaign'
    });

    items.push({
      header: web3.utils.fromWei(balance, 'ether'),
      meta: 'Campaign Balance (ether)',
      description:
        'The balance is how much money this campaign has left to spend.'
    });

    return (
      <Card.Group>
        <Card fluid style={{ maxWidth: '594px' }}>
          <Card.Content>
            <Image floated="left">
              <Jdenticon value={address} size={50} />
            </Image>
            <Card.Header>{title}</Card.Header>
            <Card.Meta>{address}</Card.Meta>
            <Card.Description>{description}</Card.Description>
          </Card.Content>
        </Card>
        {items.map(item => {
          return (
            <Card
              header={item.header}
              meta={item.meta}
              description={item.description}
              style={item.style}
            />
          );
        })}
      </Card.Group>
    );
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
