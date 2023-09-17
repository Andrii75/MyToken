require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.15',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/jNePu2ylnQUWCuvyO2xl43MvUr5FhLVT', // URL of the Sepolia test network RPC
      accounts: [process.env.PRIVATE_KEY], // your private key, ensure to not expose this in your code. Use environment variables
      chainId: 11155111,
      gasPrice: 'auto',
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
