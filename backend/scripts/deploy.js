// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // 1) Fetch the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 2) Compile if needed (Hardhat does this for you in JS runs)
  // await run("compile");

  // 3) Deploy the CertificateNFT contract
  const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
  const certificate = await CertificateNFT.deploy();
  await certificate.deployed();

  console.log("CertificateNFT deployed to:", certificate.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });