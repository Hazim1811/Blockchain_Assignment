// backend/scripts/verify.js
const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  // signer[0] = deployer (or anyone)
  const [deployer] = await ethers.getSigners();

  const CERT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const cert = await ethers.getContractAt("CertificateNFT", CERT_ADDRESS);

  const ok = await cert.connect(deployer).verifyCertificate(1);
  console.log("🔍 Certificate #1 valid?", ok);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});