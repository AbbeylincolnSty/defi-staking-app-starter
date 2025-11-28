const path = require('path');
const solcPath = require.resolve('solc/soljson.js');

module.exports = {
  contracts_build_directory: path.join(__dirname, 'src/build/contracts'),
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    sepolia: {
      provider: () => {
        if (!process.env.SEPOLIA_RPC_URL || !process.env.PRIVATE_KEY) {
          throw new Error('Set SEPOLIA_RPC_URL and PRIVATE_KEY');
        }
        const HDWalletProvider = require('@truffle/hdwallet-provider');
        return new HDWalletProvider(process.env.PRIVATE_KEY, process.env.SEPOLIA_RPC_URL);
      },
      network_id: 11155111,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  mocha: {
    reporter: 'spec',
  },
  compilers: {
    solc: {
      version: solcPath,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
