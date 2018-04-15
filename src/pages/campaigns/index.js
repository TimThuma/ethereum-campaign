import React, { Component } from 'react';
import factory from '../../ethereum/factory';
import { Item, Button, Icon, Message, Loader } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Jdenticon from '../../components/Jdenticon';
import { Link } from '../../routes';

class CampaignIndex extends Component {
  state = {
    campaigns: []
  };

  async componentDidMount() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    this.setState({ campaigns: campaigns });
  }

  // Create a list of Cards
  renderCampaigns() {

    if (this.state.campaigns.length === 0) {
      return (
        <Message color="blue">
          <p><Loader active inline style={{ marginRight: 10 }}/> Loading campaigns</p>
        </Message>
      );
    }

    const items = this.state.campaigns.map(address => {
      return (
        <Item>
          <Item.Image>
            <Jdenticon value={address} size={150} />
          </Item.Image>

          <Item.Content>
            <Item.Header>Campaign Title</Item.Header>
            <Item.Meta>
              <span>{address}</span>
            </Item.Meta>
            <Item.Description>Description of the campaign.</Item.Description>
            <Item.Extra>
              <Link route={`/campaigns/${address}`}>
                <a>
                  <Button primary floated='right'>
                    View Campaign
                    <Icon name='right chevron' />
                  </Button>
                </a>
              </Link>
            </Item.Extra>
          </Item.Content>
        </Item>
      );
    });
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

        <Message hidden={this.state.campaigns.length === 0} info style={{ marginTop: 30, marginBottom:10 }}>
          <p>* Identicon powered by <a href="https://jdenticon.com">Jdenticon</a>. Copyright (c) 2014-2018 Daniel Mester Pirttijärvi</p>
        </Message>
      </Layout>
    );
  }
}

export default CampaignIndex;
