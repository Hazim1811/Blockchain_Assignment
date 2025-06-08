require("dotenv").config();
const { ALCHEMY_URL, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: "0.8.20",
  networks: {
    rinkeby: {
      url: ALCHEMY_URL,
      accounts: [ PRIVATE_KEY ]
    },
    localhost: { url: "http://127.0.0.1:8545" }
  }
}

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};