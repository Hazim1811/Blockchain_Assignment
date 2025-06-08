const hre = require("hardhat");

async function main() {
    const [, issuer] = await hre.ethers.getSigners();
    const CERT_ADDRESS = "<PASTE_YOUR_DEPLOYED_ADDRESS>";
    const cert = await hre.ethers.getContractAt("CertificateNFT", CERT_ADDRESS);

    const metadataURI = "ipfs://QmYourHashHere";
    // create the signature off‐chain
    const sig = await issuer.signMessage(
        hre.ethers.utils.toUtf8Bytes(metadataURI)
    );

    const tx = await cert.connect(issuer).mintCertificate(
        "<STUDENT_ADDRESS>", metadataURI, sig
    );
    await tx.wait();
    console.log("✅ Minted Certificate #1 — tx:", tx.hash);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
