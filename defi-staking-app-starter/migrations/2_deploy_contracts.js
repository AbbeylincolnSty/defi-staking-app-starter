const StableCoin = artifacts.require('StableCoin');
const Token = artifacts.require('Token');
const Bank = artifacts.require('Bank');

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(StableCoin, web3.utils.toWei('1000000', 'ether'));
  const stableCoin = await StableCoin.deployed();

  await deployer.deploy(Token, web3.utils.toWei('1000000', 'ether'));
  const rewardToken = await Token.deployed();

  await deployer.deploy(Bank, stableCoin.address, rewardToken.address);
  const bank = await Bank.deployed();

  await rewardToken.transfer(bank.address, web3.utils.toWei('500000', 'ether'));
  await stableCoin.transfer(accounts[1], web3.utils.toWei('100', 'ether'));
};
