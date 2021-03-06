const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[1], gas: '3000000' });

  await factory.methods.createCampaign('Some campaign', 'Some description', '100').send({
    from: accounts[0],
    gas: '3000000'
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '1000'
    });

    await campaign.methods.contribute().send({
      from: accounts[2],
      value: '10000'
    });

    assert.equal(2, await campaign.methods.approversCount().call());
    assert(await campaign.methods.approvers(accounts[1]).call());
    assert(await campaign.methods.approvers(accounts[2]).call());
    assert(!(await campaign.methods.approvers(accounts[3]).call()));
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '50'
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.contribute().send({
      from: accounts[2],
      value: '100000'
    });

    await campaign.methods
      .createRequest('a testing request', '1000', accounts[3])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    const request = await campaign.methods.requests(0).call();
    assert.ok(request);
    assert.equal(request.description, 'a testing request');
  });

  it('requires request payment value less than Campaign balance', async () => {
    try {
      await campaign.methods
        .createRequest('a request', '1000', accounts[3])
        .send({
          from: accounts[0],
          gas: '1000000'
        });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('3', 'ether')
    });

    await campaign.methods
      .createRequest('test', web3.utils.toWei('2', 'ether'), accounts[3])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: '1000000'
    });

    const initBalance = parseInt(await web3.eth.getBalance(accounts[3]), 10);

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    const afterBalance = parseInt(await web3.eth.getBalance(accounts[3]), 10);
    const diff = afterBalance - initBalance;
    assert(diff > parseInt(web3.utils.toWei('1.9', 'ether')), 10);
  });

  it('rejects re-contribution', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('3', 'ether')
    });

    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: web3.utils.toWei('3', 'ether')
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('has a summary', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '1000'
    });

    await campaign.methods.createRequest('a request', '100', accounts[3]).send({
      from: accounts[0],
      gas: '3100000'
    });

    const summary = await campaign.methods.getSummary().call();
    assert.ok(summary);
  });

  it('has a creation time', async () => {
    const summary = await campaign.methods.getSummary().call();
    const creationDate = new Date(summary[7] * 1000);
    assert(creationDate - Date.now() < 0);
  });

});
