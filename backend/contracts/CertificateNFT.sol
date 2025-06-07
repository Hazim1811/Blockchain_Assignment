// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721URIStorage, Ownable {
    uint256 public certificateCounter;

    // Mapping of approved issuers
    mapping(address => bool) public isIssuer;

    // Events for transparency
    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);
    event CertificateIssued(address indexed student, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("CertificateNFT", "CERT") Ownable(msg.sender) {
        certificateCounter = 0;
        isIssuer[msg.sender] = true; // contract deployer is default issuer (admin)
    }

    // Modifier to restrict actions to authorized issuers
    modifier onlyIssuer() {
        require(isIssuer[msg.sender], "Not an authorized issuer");
        _;
    }

    // Admin functions to manage issuers
    function addIssuer(address issuer) public onlyOwner {
        isIssuer[issuer] = true;
        emit IssuerAdded(issuer);
    }

    function removeIssuer(address issuer) public onlyOwner {
        isIssuer[issuer] = false;
        emit IssuerRemoved(issuer);
    }

    // Issue a certificate NFT to a student (student = recipient)
    function issueCertificate(address student, string memory tokenURI) public onlyIssuer {
        uint256 newTokenId = certificateCounter;
        _mint(student, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        certificateCounter++;

        emit CertificateIssued(student, newTokenId, tokenURI);
    }

    // Public function to check if certificate exists
    function certificateExists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    // View certificate metadata (returns tokenURI, will revert if tokenId does not exist)
    function getCertificateURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }
}