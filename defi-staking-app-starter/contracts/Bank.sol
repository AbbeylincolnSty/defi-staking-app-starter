// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./StableCoin.sol";
import "./Token.sol";

contract Bank {
    string public name = "Decentral Bank";
    address public owner;
    StableCoin public stablecoin;
    Token public rewardToken;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => bool) public hasStaked;
    address[] private _stakers;

    event Deposited(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsIssued(uint256 totalRecipients);

    constructor(StableCoin _stablecoin, Token _rewardToken) {
        stablecoin = _stablecoin;
        rewardToken = _rewardToken;
        owner = msg.sender;
    }

    function depositTokens(uint256 _amount) external {
        require(_amount > 0, "Deposit amount must be greater than zero");
        require(stablecoin.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            _stakers.push(msg.sender);
            hasStaked[msg.sender] = true;
        }

        isStaking[msg.sender] = true;

        emit Deposited(msg.sender, _amount);
    }

    function issueTokens() external {
        require(msg.sender == owner, "Caller must be the owner");

        uint256 recipients;
        for (uint256 i = 0; i < _stakers.length; i++) {
            address recipient = _stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                rewardToken.transfer(recipient, balance / 9); // simple reward ratio
                recipients++;
            }
        }

        emit RewardsIssued(recipients);
    }

    function unstakeTokens() external {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "Staking balance must be greater than zero");

        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
        require(stablecoin.transfer(msg.sender, balance), "Unstake transfer failed");

        emit Unstaked(msg.sender, balance);
    }

    function stakers() external view returns (address[] memory) {
        return _stakers;
    }
}
