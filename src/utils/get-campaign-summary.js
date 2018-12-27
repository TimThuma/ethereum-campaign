export default async (campaign) => {
  const summary = await campaign.methods.getSummary().call();
  return {
    title: summary[0],
    description: summary[1],
    minimumContribution: summary[2],
    balance: summary[3],
    requestsCount: summary[4],
    approversCount: summary[5],
    manager: summary[6],
    creationTime: summary[7]
  };
};
