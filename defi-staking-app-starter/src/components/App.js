import React from 'react';
import logo from '../logo.png';
import bankIcon from '../bank.png';
import ethLogo from '../eth-logo.png';
import tetherLogo from '../tether.png';
import tokenLogo from '../token-logo.png';

const App = () => {
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
            <span className="badge badge-primary">Network: Ethereum</span>
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
                  <h2 className="h5 mb-1">Connect your wallet</h2>
                  <p className="mb-2 text-muted">
                    Use the connect button to link your preferred wallet and start staking tokens.
                  </p>
                  <button type="button" className="btn btn-primary">Connect Wallet</button>
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
                    <strong>0.00 USDT</strong>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <img src={tokenLogo} alt="Reward token" width={32} height={32} className="mr-2" />
                  <div>
                    <div className="small text-muted">Reward token</div>
                    <strong>0.00 DAPP</strong>
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
                    <strong>0.00 USDT</strong>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span>Pending rewards</span>
                    <strong>0.00 DAPP</strong>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span>APY</span>
                    <strong>Coming soon</strong>
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
                  <input type="number" className="form-control" id="depositAmount" placeholder="0.00" />
                </div>
                <div className="d-flex flex-wrap">
                  <button type="button" className="btn btn-success mr-2 mb-2">Stake tokens</button>
                  <button type="button" className="btn btn-outline-primary mr-2 mb-2">Unstake tokens</button>
                  <button type="button" className="btn btn-outline-warning mb-2">Claim rewards</button>
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
