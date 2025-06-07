const hre = require("hardhat");
async function main() {
  const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");
  const certificateNFT = await CertificateNFT.deploy();
  console.log(`TodoList deployed to: ${certificateNFT.target}`);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});