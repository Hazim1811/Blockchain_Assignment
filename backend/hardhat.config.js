// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    // Local Hardhat node (run with `npx hardhat node`)
    localhost: {
      url: "http://127.0.0.1:8545",
      // accounts are automatically unlocked by `hardhat node`
    }
  }
};
