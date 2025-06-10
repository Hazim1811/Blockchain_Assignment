// backend/scripts/grantIssuer.js
const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  // signer[0] = admin, signer[1] = issuer
  const [deployer, issuer] = await ethers.getSigners();

  const CERT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const cert = await ethers.getContractAt("CertificateNFT", CERT_ADDRESS);

  // compute the role hash
  const ISSUER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ISSUER_ROLE"));

  // grant it
  const tx = await cert.connect(deployer).grantRole(ISSUER_ROLE, issuer.address);
  await tx.wait();
  console.log(`✅ Granted ISSUER_ROLE to ${issuer.address}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
