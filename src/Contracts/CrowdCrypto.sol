// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Campaign {
    address author;
    string title;
    string description;
    string mediaUrl;
    string mediaType; 
    uint256 balance;
    uint256 goal;
    bool goalReached;
    bool active;
}

contract CrowdCrypto {
    uint256 public feePercentage = 1;
    uint256 public nextId = 0;
    uint256 public totalFeesCollected = 0;

    address public owner;

    mapping(uint256 => Campaign) public campaigns;

    constructor() {
        owner = msg.sender;
    }

    function calculateFee(uint256 amount) internal view returns (uint256) {
        return (amount * feePercentage) / 100;
    }

    function addCampaign(
        string calldata title,
        string calldata description,
        string calldata mediaUrl,
        string calldata mediaType,
        uint256 goal
    ) public {
        require(bytes(title).length > 0, "Title is required");
        require(bytes(description).length > 0, "Description is required");
        require(goal > 0, "Goal must be greater than 0");

        Campaign memory newCampaign;
        newCampaign.title = title;
        newCampaign.description = description;
        newCampaign.goal = goal;

        if (bytes(mediaUrl).length > 0) {
            newCampaign.mediaUrl = mediaUrl;
        }

        if (bytes(mediaType).length > 0) {
            newCampaign.mediaType = mediaType;
        }

        newCampaign.active = true;
        newCampaign.author = msg.sender;
        newCampaign.goalReached = false;

        nextId++;
        campaigns[nextId] = newCampaign;
    }

    function donate(uint256 id) public payable {
        require(msg.value > 0, "You must send a donation value greater than 0");
        require(campaigns[id].active == true, "Cannot donate to this campaign");

        Campaign storage campaign = campaigns[id];
        campaign.balance += msg.value;

        if (campaign.balance >= campaign.goal && !campaign.goalReached) {
            campaign.goalReached = true;

            uint256 fee = calculateFee(campaign.balance);
            uint256 amountToWithdraw = campaign.balance - fee;

            address payable recipient = payable(campaign.author);
            (bool success, ) = recipient.call{value: amountToWithdraw}("");
            require(success, "Transfer failed.");

            totalFeesCollected += fee;
            campaign.balance = 0;
            campaign.active = false;
        }
    }

    function withdraw(uint256 id) public {
        Campaign storage campaign = campaigns[id];
        require(campaign.author == msg.sender, "You do not have permission");
        require(campaign.active == true, "This campaign is closed");
        require(
            campaign.balance > calculateFee(campaign.balance),
            "This campaign does not have enough balance"
        );

        uint256 fee = calculateFee(campaign.balance);
        uint256 amountToWithdraw = campaign.balance - fee;

        address payable recipient = payable(campaign.author);
        (bool success, ) = recipient.call{value: amountToWithdraw}("");
        require(success, "Transfer failed.");

        totalFeesCollected += fee;
        campaign.balance = 0;
        campaign.active = false;
    }

    function withdrawFees(uint256 amount) public {
        require(
            msg.sender == owner,
            "Only the contract owner can withdraw fees"
        );
        require(totalFeesCollected > 0, "No fees available to withdraw");
        require(
            amount <= totalFeesCollected,
            "Not enough fees available to withdraw"
        );

        totalFeesCollected -= amount;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed.");
    }
}