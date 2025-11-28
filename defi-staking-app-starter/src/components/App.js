import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import bankIcon from '../bank.png';
import ethLogo from '../eth-logo.png';
import tetherLogo from '../tether.png';
import tokenLogo from '../token-logo.png';
import Bank from '../build/contracts/Bank.json';
import StableCoin from '../build/contracts/StableCoin.json';
import Token from '../build/contracts/Token.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [networkId, setNetworkId] = useState(null);
  const [status, setStatus] = useState('Connect your wallet to begin.');
  const [stableBalance, setStableBalance] = useState('0');
  const [rewardBalance, setRewardBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [depositAmount, setDepositAmount] = useState('');
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    if (window.ethereum || window.web3) {
      initWeb3();
    }
  }, []);

  const initWeb3 = async () => {
    try {
      let web3Instance;
      if (window.ethereum) {
        web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } else if (window.web3) {
        web3Instance = new Web3(window.web3.currentProvider);
      } else {
        setStatus('Non-Ethereum browser detected. Consider trying MetaMask!');
        return;
      }

      setWeb3(web3Instance);
      await loadBlockchainData(web3Instance);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadBlockchainData = async (web3Instance) => {
    const accounts = await web3Instance.eth.getAccounts();
    if (!accounts.length) {
      setStatus('No accounts found. Please unlock your wallet.');
      return;
    }

    const netId = await web3Instance.eth.net.getId();
    setAccount(accounts[0]);
    setNetworkId(netId);

    const bankNetwork = Bank.networks[netId];
    const stableNetwork = StableCoin.networks[netId];
    const tokenNetwork = Token.networks[netId];

    if (!bankNetwork || !stableNetwork || !tokenNetwork) {
      setStatus('Contracts not deployed to the detected network.');
      return;
    }

    const stableContract = new web3Instance.eth.Contract(StableCoin.abi, stableNetwork.address);
    const tokenContract = new web3Instance.eth.Contract(Token.abi, tokenNetwork.address);
    const bankContract = new web3Instance.eth.Contract(Bank.abi, bankNetwork.address);

    setContracts({ stableContract, tokenContract, bankContract });
    setStatus('Connected');

    await refreshBalances(web3Instance, accounts[0], stableContract, tokenContract, bankContract);
  };

  const refreshBalances = async (web3Instance, userAccount, stableContract, tokenContract, bankContract) => {
    const [stable, rewards, staked] = await Promise.all([
      stableContract.methods.balanceOf(userAccount).call(),
      tokenContract.methods.balanceOf(userAccount).call(),
      bankContract.methods.stakingBalance(userAccount).call(),
    ]);

    setStableBalance(web3Instance.utils.fromWei(stable, 'ether'));
    setRewardBalance(web3Instance.utils.fromWei(rewards, 'ether'));
    setStakedBalance(web3Instance.utils.fromWei(staked, 'ether'));
  };

  const handleDeposit = async () => {
    if (!depositAmount || !contracts.stableContract || !web3) return;

    const amountInWei = web3.utils.toWei(depositAmount, 'ether');
    await contracts.stableContract.methods.approve(contracts.bankContract._address, amountInWei).send({ from: account });
    await contracts.bankContract.methods.depositTokens(amountInWei).send({ from: account });
    await refreshBalances(web3, account, contracts.stableContract, contracts.tokenContract, contracts.bankContract);
  };

  const handleUnstake = async () => {
    if (!contracts.bankContract || !web3) return;
    await contracts.bankContract.methods.unstakeTokens().send({ from: account });
    await refreshBalances(web3, account, contracts.stableContract, contracts.tokenContract, contracts.bankContract);
  };

  const handleIssue = async () => {
    if (!contracts.bankContract || !web3) return;
    await contracts.bankContract.methods.issueTokens().send({ from: account });
    await refreshBalances(web3, account, contracts.stableContract, contracts.tokenContract, contracts.bankContract);
  };

  return (
    <div className="bg-light min-vh-100">
      <header className="bg-dark text-white py-3 mb-4">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img src={logo} alt="DeFi Staking" width={48} height={48} className="mr-3" />
            <div>
              <h1 className="h4 mb-0">DeFi Staking Dashboard</h1>
              <small className="text-muted">React + Bootstrap starter layout</small>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <img src={ethLogo} alt="Ethereum" width={24} height={24} className="mr-2" />
            <span className="badge badge-primary">{networkId ? `Network ID: ${networkId}` : 'Network: Unknown'}</span>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="row mb-4">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body d-flex align-items-center">
                <img src={bankIcon} alt="Vault" width={56} height={56} className="mr-3" />
                <div>
                  <h2 className="h5 mb-1">{account ? 'Wallet connected' : 'Connect your wallet'}</h2>
                  <p className="mb-2 text-muted">{status}</p>
                  <button type="button" className="btn btn-primary" onClick={initWeb3}>
                    {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mt-3 mt-md-0">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="h6 text-muted">Token balances</h3>
                <div className="d-flex align-items-center mb-3">
                  <img src={tetherLogo} alt="Stablecoin" width={32} height={32} className="mr-2" />
                  <div>
                    <div className="small text-muted">Deposit token</div>
                    <strong>{stableBalance} mUSDT</strong>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <img src={tokenLogo} alt="Reward token" width={32} height={32} className="mr-2" />
                  <div>
                    <div className="small text-muted">Reward token</div>
                    <strong>{rewardBalance} RWD</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="row">
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="h5">Staking overview</h3>
                <p className="text-muted mb-3">Track your staking position and estimated rewards.</p>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex justify-content-between py-1">
                    <span>Total staked</span>
                    <strong>{stakedBalance} mUSDT</strong>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span>Pending rewards</span>
                    <strong>{rewardBalance} RWD</strong>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span>APY</span>
                    <strong>Simple 1/9 reward ratio</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="h5">Staking actions</h3>
                <p className="text-muted">Use the placeholders below to wire up staking interactions.</p>
                <div className="form-group">
                  <label htmlFor="depositAmount">Deposit amount</label>
                  <input
                    type="number"
                    className="form-control"
                    id="depositAmount"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <div className="d-flex flex-wrap">
                  <button type="button" className="btn btn-success mr-2 mb-2" onClick={handleDeposit}>
                    Stake tokens
                  </button>
                  <button type="button" className="btn btn-outline-primary mr-2 mb-2" onClick={handleUnstake}>
                    Unstake tokens
                  </button>
                  <button type="button" className="btn btn-outline-warning mb-2" onClick={handleIssue}>
                    Claim rewards
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
