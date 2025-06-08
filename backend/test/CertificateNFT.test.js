const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateNFT", function () {
    let Certificate, cert, owner, issuer, student, verifier;

    beforeEach(async () => {
        [owner, issuer, student, verifier] = await ethers.getSigners();

        // deploy and grant roles
        Certificate = await ethers.getContractFactory("CertificateNFT");
        cert = await Certificate.deploy();
        await cert.waitForDeployment();

        // owner is DEFAULT_ADMIN_ROLE, give issuer & verifier roles
        await cert.connect(owner).grantRole(keccak256("ISSUER_ROLE"), issuer.address);
        await cert.connect(owner).grantRole(keccak256("VERIFIER_ROLE"), verifier.address);
    });

    it("lets an ISSUER mint a certificate", async () => {
        const metadata = "ipfs://QmHash";
        // issuer signs metadata off-chain
        const sig = await issuer.signMessage(ethers.utils.toUtf8Bytes(metadata));

        // mint
        await expect(cert.connect(issuer).mintCertificate(student.address, metadata, sig))
            .to.emit(cert, "CertificateIssued")
            .withArgs(1, issuer.address, student.address, metadata);

        // check ownership & URI
        expect(await cert.ownerOf(1)).to.equal(student.address);
        expect(await cert.tokenURI(1)).to.equal(metadata);
    });

    it("blocks non-issuers from minting", async () => {
        await expect(
            cert.connect(student).mintCertificate(student.address, "ipfs://x", "0x00")
        ).to.be.revertedWith("AccessControl: account");
    });

    it("allows a verifier to view the certificate", async () => {
        const metadata = "ipfs://QmHash";
        const sig = await issuer.signMessage(ethers.utils.toUtf8Bytes(metadata));
        await cert.connect(issuer).mintCertificate(student.address, metadata, sig);
        await expect(cert.connect(verifier).viewCertificate(1))
            .to.not.be.reverted;
    });

    // …and so on…
});
