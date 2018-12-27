import React, { Component } from 'react';
import factory from '../../ethereum/factory';
import { Item, Button, Icon, Message, Loader } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Jdenticon from '../../components/Jdenticon';
import { Link } from '../../routes';
import getSummary from '../../utils/get-campaign-summary';
import Campaign from '../../ethereum/campaign';

class CampaignIndex extends Component {
  state = {
    campaignsInfo: []
  };

  async componentDidMount() {
    const campaignAddresses = await factory.methods.getDeployedCampaigns().call();
    const campaignsInfo = await Promise.all(
      campaignAddresses.map(async (address) => {
        const campaign = Campaign(address);
        const summary = await getSummary(campaign);
        return Object.assign(summary, { address: address });
      })
    );
    this.setState({ campaignsInfo: campaignsInfo });
  }

  // Create a list of Cards
  renderCampaigns() {

    if (this.state.campaignsInfo.length === 0) {
      return (
        <Message color="blue">
          <div><Loader active inline style={{ marginRight: 10 }}/> Loading campaigns</div>
        </Message>
      );
    }

    const timestampStyle = {
      position: 'absolute',
      right: '0px',
      left: 'auto',
      width: '200px',
      marginTop: '15px',
      textAlign: 'right'
    };

    // display the latest campaign first.
    const items = [];
    for (let i = this.state.campaignsInfo.length - 1; i >= 0; i--) {
      const info = this.state.campaignsInfo[i];
      items.push(
        <Item key={`campaign-${i}`} style={{ position: 'relative' }}>
          <Item.Image>
            <Jdenticon value={info.address} size={150} />
          </Item.Image>
          <Item.Content>
            <Item.Header style={{ marginTop: '15px' }}>{info.title}</Item.Header>
            <Item.Meta>
              <span>{info.address}</span>
            </Item.Meta>
            <Item.Description>{info.description}</Item.Description>
            <Item.Extra>
              <Link route={`/campaigns/${info.address}`}>
                <a>
                  <Button primary floated='right'>
                    View Campaign
                    <Icon name='right chevron' />
                  </Button>
                </a>
              </Link>
            </Item.Extra>
            <Item.Extra style={timestampStyle}>
              {new Date(info.creationTime * 1000).toLocaleString()}
            </Item.Extra>
          </Item.Content>
        </Item>
      );
    }
    return (
      <Item.Group divided>
        {items}
      </Item.Group>
    );
  }

  render() {
    return (
      <Layout>
        <h3>Campaigns</h3>
        <Link route="/campaigns/new">
          <a>
            <Button
              content="Create Campaign"
              icon="add circle"
              primary={true}
              floated="right"
            />
          </a>
        </Link>
        {this.renderCampaigns()}

        <Message hidden={this.state.campaignsInfo.length === 0} info style={{ marginTop: 30, marginBottom:10 }}>
          <p>* Identicon powered by <a href="https://jdenticon.com">Jdenticon</a>. Copyright (c) 2014-2018 Daniel Mester Pirttijärvi</p>
        </Message>
      </Layout>
    );
  }
}

export default CampaignIndex;
