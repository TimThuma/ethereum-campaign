pragma solidity ^0.4.17;

contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(string title, string description, uint minimum) public {
    require(bytes(title).length <= 50);
    require(bytes(description).length <= 200);
    address newCampaign = new Campaign(title, description, minimum, msg.sender);
    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns (address[]) {
    return deployedCampaigns;
  }
}

contract Campaign {
  struct Request {
    string description;
    uint value;
    address recipient;
    bool complete;
    uint approvalCount;
    mapping(address => bool) approvals;
  }

  string public title;
  string public description;
  address public manager;
  uint public minContribution;
  uint creationTime = now;
  mapping(address => bool) public approvers;
  uint public approversCount;
  Request[] public requests;

  modifier managerOnly() {
    require(msg.sender == manager);
    _;
  }

  function Campaign(string campaignTitle, string campaignDescription, uint minimum, address creator) public {
    title = campaignTitle;
    description = campaignDescription;
    manager = creator;
    minContribution = minimum;
  }

  function contribute() public payable {
    require(!approvers[msg.sender]);
    require(msg.value >= minContribution);
    approvers[msg.sender] = true;
    approversCount++;
  }

  function createRequest(string requestDescription, uint value, address recipient)
    public managerOnly
  {
    require(bytes(description).length <= 200);
    require(value <= address(this).balance);
    Request memory newRequest = Request({
      description: requestDescription,
      value: value,
      recipient: recipient,
      complete: false,
      approvalCount: 0
    });

    requests.push(newRequest);
  }

  function approveRequest(uint index) public {
    Request storage request = requests[index];

    require(approvers[msg.sender]);
    require(!request.approvals[msg.sender]);

    request.approvals[msg.sender] = true;
    request.approvalCount++;
  }

  function finalizeRequest(uint index) public managerOnly {
    Request storage request = requests[index];
    require(!request.complete);
    require(request.approvalCount > (approversCount / 2));

    request.recipient.transfer(request.value);

    request.complete = true;
  }

  function getSummary() public view returns (
    string, string, uint, uint, uint, uint, address, uint
  ) {
    return (
      title,
      description,
      minContribution,
      address(this).balance,
      requests.length,
      approversCount,
      manager,
      creationTime
    );
  }

  function getRequestsCount() public view returns (uint) {
    return requests.length;
  }
}
