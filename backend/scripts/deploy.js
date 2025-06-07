const hre = require("hardhat");

async function main() {
  const { ethers } = hre;

  // 1) Grab the deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", await deployer.getAddress());

  // 2) Get your contract factory
  const CertFactory = await ethers.getContractFactory("CertificateNFT");

  // 3) Kick off the deployment
  const certificate = await CertFactory.connect(deployer).deploy();
  console.log("▶️  Transaction hash:", certificate.deploymentTransaction().hash);

  // 4) Wait for it to finish
  await certificate.waitForDeployment();

  // 5) Print the address
  console.log("✅ CertificateNFT deployed to:", await certificate.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });