import web3 from './web3';

import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x89562BE979804d2947D83d4643568ec4b6f2F6B5'
);

export default instance;
