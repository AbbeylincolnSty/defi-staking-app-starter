const { expect } = require('chai');
const StableCoin = artifacts.require('StableCoin');
const Token = artifacts.require('Token');
const Bank = artifacts.require('Bank');

require('chai').use(require('chai-as-promised')).should();

const tokens = (n) => web3.utils.toBN(web3.utils.toWei(n.toString(), 'ether'));

contract('Bank staking workflow', (accounts) => {
  const [owner, investor] = accounts;
  let stableCoin;
  let rewardToken;
  let bank;

  beforeEach(async () => {
    stableCoin = await StableCoin.new(tokens('1000000'));
    rewardToken = await Token.new(tokens('1000000'));
    bank = await Bank.new(stableCoin.address, rewardToken.address);

    await rewardToken.transfer(bank.address, tokens('500000'), { from: owner });
    await stableCoin.transfer(investor, tokens('100'), { from: owner });
  });

  it('funds investors and bank', async () => {
    const investorBalance = await stableCoin.balanceOf(investor);
    expect(investorBalance.toString()).to.equal(tokens('100').toString());

    const bankRewardBalance = await rewardToken.balanceOf(bank.address);
    expect(bankRewardBalance.toString()).to.equal(tokens('500000').toString());
  });

  it('allows staking, issuing rewards, and unstaking', async () => {
    await stableCoin.approve(bank.address, tokens('50'), { from: investor });
    await bank.depositTokens(tokens('50'), { from: investor });

    const stakingBalance = await bank.stakingBalance(investor);
    expect(stakingBalance.toString()).to.equal(tokens('50').toString());

    await bank.issueTokens({ from: owner });

    const rewardBalance = await rewardToken.balanceOf(investor);
    expect(rewardBalance.toString()).to.equal(tokens('50').divn(9).toString());

    await bank.unstakeTokens({ from: investor });
    const finalBalance = await stableCoin.balanceOf(investor);
    expect(finalBalance.toString()).to.equal(tokens('100').toString());

    const isStaking = await bank.isStaking(investor);
    expect(isStaking).to.equal(false);
  });

  it('prevents non-owners from issuing rewards', async () => {
    await expect(bank.issueTokens({ from: investor })).to.be.rejected;
  });
});
