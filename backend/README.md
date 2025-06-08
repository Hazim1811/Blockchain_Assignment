# CertificateNFT DApp

An on-chain system for issuing and verifying academic certificates as ERC-721 NFTs.  
Built with Solidity, Hardhat, and OpenZeppelin, with helper scripts for minting, viewing, and verifying certificates.

---

## 1. Prerequisites

- [Node.js](https://nodejs.org/) v16+ and npm  
- [Hardhat](https://hardhat.org/) (installed via npm)  
  
## 2. Clone & Install

```bash
git clone https://github.com/Hazim1811/Blockchain_Assignment.git
cd Blockchain_Assignment/backend
npm install

## 3. Environment Variables

### .env
RPC_URL=https://eth-rinkeby.alchemyapi.io/v2/yourKeyHere
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY

## 4. Project Structure

backend/
├── contracts/            # Solidity contracts
│   └── CertificateNFT.sol
├── scripts/              # Deployment & interaction scripts
│   ├── deploy.js
│   ├── mint.js
│   ├── view.js
│   └── verify.js
├── test/                 # Mocha + Chai unit tests
│   └── CertificateNFT.test.js
├── .env.example          # Sample env file
├── hardhat.config.js     # Hardhat configuration
├── package.json
└── README.md

## 5. Local Development

```bash
npx hardhat node            # Start local node
npx hardhat compile         # Compile contract
npx hardhat test            # run tests
npx hardhat run scripts/deploy.js --network localhost       # Deploy to local Hardhat node
npx hardhat run scripts/mint.js --network localhost         # Mint a new certificate
npx hardhat run scripts/view.js --network localhost         # View certificate details
npx hardhat run scripts/verify.js --network localhost       # Verify certificate on-chain

## 6. Smart Contract Details


## 7. ABI & Frontend Integration
akmal part

## 8. License
This project is under the MIT License.

## 9. Acknowledgments
- Built with [Hardhat](https://hardhat.org)
- Uses [Ethers.js](https://docs.ethers.org/v6/) v6
- Testing via [Mocha](https://mochajs.org) + [Chai](https://www.chaijs.com)