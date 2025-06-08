const hre = require("hardhat");

async function main() {
    const [, , verifier] = await hre.ethers.getSigners();
    const CERT_ADDRESS = "<PASTE_YOUR_DEPLOYED_ADDRESS>";
    const cert = await hre.ethers.getContractAt("CertificateNFT", CERT_ADDRESS);

    const [uri, issuer, ts, sig] = await cert.connect(verifier).viewCertificate(1);
    console.log({ uri, issuer, issuedAt: new Date(ts * 1000), signature: sig });
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});