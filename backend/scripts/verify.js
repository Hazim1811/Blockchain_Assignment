const hre = require("hardhat");

async function main() {
  const [ , , , verifier ] = await hre.ethers.getSigners();
  const CERT_ADDRESS = "<PASTE_YOUR_DEPLOYED_ADDRESS>";
  const cert = await hre.ethers.getContractAt("CertificateNFT", CERT_ADDRESS);

  const ok = await cert.connect(verifier).verifyCertificate(1);
  console.log("🔍 Certificate #1 valid?", ok);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});