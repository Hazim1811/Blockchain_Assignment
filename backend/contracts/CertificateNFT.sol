// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title CertificateNFT
/// @notice Issue tamper-proof academic certificates as ERC-721 tokens
contract CertificateNFT is ERC721URIStorage, AccessControl {
    using ECDSA for bytes32;

    bytes32 public constant ISSUER_ROLE   = keccak256("ISSUER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    uint256 private _nextTokenId;

    struct Certificate {
        address issuer;
        uint256 issuedAt;
        bytes   signature;
    }

    /// @dev tokenId => Certificate data
    mapping(uint256 => Certificate) private _certificates;

    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed issuer,
        address indexed student,
        string    metadataURI
    );

    constructor() ERC721("AcademicCertificate", "ACERT") {
        // Deployer is the admin who can grant/revoke ISSUER_ROLE & VERIFIER_ROLE
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Mint a new certificate NFT to `student`
    /// @param student     the recipient
    /// @param metadataURI an IPFS URI pointing at the JSON metadata
    /// @param signature   the issuer’s off-chain ECDSA sig of `metadataURI`
    function mintCertificate(
        address student,
        string calldata metadataURI,
        bytes  calldata signature
    )
        external
        onlyRole(ISSUER_ROLE)
        returns (uint256)
    {
        // 1) Reconstruct the message hash and verify the signature
        bytes32 digest    = keccak256(bytes(metadataURI));
        bytes32 ethDigest = ECDSA.toEthSignedMessageHash(digest);
        require( ECDSA.recover(ethDigest, signature) == msg.sender,
                 "Invalid signature" );

        // 2) Auto-increment
        uint256 tokenId = ++_nextTokenId;

        // 3) Mint the NFT & set its metadata pointer
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // 4) Store the issuance record on-chain
        _certificates[tokenId] = Certificate({
            issuer:    msg.sender,
            issuedAt:  block.timestamp,
            signature: signature
        });

        emit CertificateIssued(tokenId, msg.sender, student, metadataURI);
        return tokenId;
    }

    /// @notice View certificate details (reverts if tokenId DNE or caller lacks access)
    function viewCertificate(uint256 tokenId)
        external
        view
        returns (
            string memory metadataURI,
            address      issuer,
            uint256      issuedAt,
            bytes memory signature
        )
    {
        // ownerOf / tokenURI will automatically revert if tokenId doesn't exist
        address owner_  = ownerOf(tokenId);
        Certificate memory cert = _certificates[tokenId];

        bool allowed = 
            owner_ == msg.sender ||
            hasRole(VERIFIER_ROLE, msg.sender) ||
            cert.issuer == msg.sender;
        require(allowed, "Access denied");

        metadataURI = tokenURI(tokenId);
        issuer      = cert.issuer;
        issuedAt    = cert.issuedAt;
        signature   = cert.signature;
    }

    /// @notice On-chain check that the stored signature matches the metadata URI
    function verifyCertificate(uint256 tokenId) external view returns (bool) {
        string memory uri_ = tokenURI(tokenId);
        Certificate memory cert = _certificates[tokenId];

        bytes32 digest    = keccak256(bytes(uri_));
        bytes32 ethDigest = ECDSA.toEthSignedMessageHash(digest);
        return ECDSA.recover(ethDigest, cert.signature) == cert.issuer;
    }

    /// @dev Resolve the “diamond inheritance” supportsInterface clash
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}