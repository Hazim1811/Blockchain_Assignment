// backend/scripts/view.js
const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  // signer[3] = the Student (owner of token #1)
  const [ , , , student ] = await ethers.getSigners();

  const CERT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const cert = await ethers.getContractAt("CertificateNFT", CERT_ADDRESS);

  const [uri, issuer, tsBigInt, signature] =
    await cert.connect(student).viewCertificate(1);

  console.log("URI:      ", uri);
  console.log("Issuer:   ", issuer);
  console.log("IssuedAt: ", new Date(Number(tsBigInt) * 1000));
  console.log("Signature:", signature);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
