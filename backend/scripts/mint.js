// backend/scripts/mint.js
const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  // signer[1] = Issuer, signer[3] = Student
  const [ , issuer, , student ] = await ethers.getSigners();

  const CERT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const cert = await ethers.getContractAt("CertificateNFT", CERT_ADDRESS);

  // Your IPFS CID
  const cid = "bafkreifngst4ung7ztqyts5g5yvw6hl4xryzvgndhkj5ejfjd55q2pgzfa";
  const metadataURI = `ipfs://${cid}`;

  // 1) Compute the keccak256 hash of the metadata URI
  const digestHex   = ethers.keccak256(ethers.toUtf8Bytes(metadataURI));
  // 2) Convert that hex string into a byte array
  const digestBytes = ethers.getBytes(digestHex);
  // 3) Sign those 32 bytes (so it matches toEthSignedMessageHash on‐chain)
  const sig = await issuer.signMessage(digestBytes);

  // 4) Mint the certificate NFT
  const tx = await cert.connect(issuer).mintCertificate(
    student.address,
    metadataURI,
    sig
  );
  await tx.wait();

  console.log("✅ Minted Certificate #1 — tx:", tx.hash);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
