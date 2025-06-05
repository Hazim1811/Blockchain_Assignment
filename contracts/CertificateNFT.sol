// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("CertificateNFT", "CERT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintCertificate(address recipient, string memory tokenURI) public onlyOwner {
        uint256 newItemId = tokenCounter;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter++;
    }
}
