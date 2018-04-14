import web3 from './web3';

import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xCDfAa4e17Ff2b4cFDE0d48869B066d1a65A21B69'
);

export default instance;
