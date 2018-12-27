import React, { Component } from 'react';
import Layout from '../../components/Layout';
import {
  Button,
  Form,
  Input,
  Message,
  TextArea,
  Label
} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    campaignTitle: '',
    minimumContribution: '',
    campaignDescription: '',
    errorMessage: '',
    loading: false
  };

  // submit the form for creating a new campaign.
  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: ''
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(
          this.state.campaignTitle,
          this.state.campaignDescription,
          this.state.minimumContribution
        )
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/campaigns');
    } catch (err) {
      this.setState({ errorMessage: err.message.substring(0, 200) });
    }
    this.setState({ loading: false });
  };

  getDescriptionField() {
    const wordCountStyle = {
      position: 'absolute',
      top: '-2px',
      right: '0px'
    };
    const charCount = this.state.campaignDescription.length;
    const wordCountColor = 200 > charCount ? 'teal' : 'red';
    return (
      <Form.Field>
        <Form.Field style={{ position: 'relative' }}>
          <label>Description</label>
          <Label pointing="below" style={wordCountStyle} color={wordCountColor}>
            {200 - this.state.campaignDescription.length}
          </Label>
        </Form.Field>
        <Form.Field>
          <TextArea
            placeholder="Describe the campaign..."
            value={this.state.campaignDescription}
            onChange={event =>
              this.setState({ campaignDescription: event.target.value })
            }
          />
        </Form.Field>
      </Form.Field>
    );
  }

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Title</label>
              <Input
                value={this.state.campaignTitle}
                placeholder="Title of Campaign"
                onChange={event =>
                  this.setState({ campaignTitle: event.target.value })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Minimum Contribution</label>
              <Input
                label="wei"
                labelPosition="right"
                placeholder="Minimum Contribution"
                value={this.state.minimumContribution}
                onChange={event =>
                  this.setState({ minimumContribution: event.target.value })
                }
              />
            </Form.Field>
          </Form.Group>
          {this.getDescriptionField()}
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
