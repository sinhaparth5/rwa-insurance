// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AssetRegistry
 * @dev Registry for Real World Assets with verification and management
 */
contract AssetRegistry is Ownable, Pausable {
    // Asset status enum
    enum AssetStatus { Pending, Verified, Rejected, Insured, Claimed }

    // Asset structure
    struct Asset {
        uint256 id;
        address owner;
        string assetType;          // e.g., "real_estate", "vehicle", "artwork"
        string description;
        uint256 estimatedValue;    // Asset value in wei
        string documentHash;       // IPFS hash of verification documents
        string metadataURI;        // Additional metadata URI
        AssetStatus status;
        address verifier;          // Address of verifying assessor
        uint256 verificationDate;
        uint256 lastAssessment;
        bool isInsurable;
    }

    // State variables
    uint256 private _assetIdCounter;
    mapping(uint256 => Asset) public assets;
    mapping(address => uint256[]) public ownerAssets;
    mapping(address => bool) public authorizedVerifiers;
    mapping(string => bool) public supportedAssetTypes;
    
    // Verification requirements
    mapping(string => uint256) public minimumStakeRequired; // Stake required to verify asset type
    mapping(address => uint256) public verifierStake;       // Current stake of verifiers

    // Events
    event AssetRegistered(uint256 indexed assetId, address indexed owner, string assetType);
    event AssetVerified(uint256 indexed assetId, address indexed verifier);
    event AssetRejected(uint256 indexed assetId, address indexed verifier, string reason);
    event AssetInsured(uint256 indexed assetId, uint256 policyId);
    event AssetClaimed(uint256 indexed assetId, uint256 claimAmount);
    event VerifierAuthorized(address indexed verifier, uint256 stakeAmount);
    event VerifierStakeUpdated(address indexed verifier, uint256 newStake);
    event AssetTypeAdded(string assetType, uint256 minimumStake);

    constructor() Ownable(msg.sender) {
        // Initialize common asset types
        supportedAssetTypes["real_estate"] = true;
        supportedAssetTypes["vehicle"] = true;
        supportedAssetTypes["artwork"] = true;
        supportedAssetTypes["jewelry"] = true;
        supportedAssetTypes["electronics"] = true;
        
        // Set minimum stakes for verification
        minimumStakeRequired["real_estate"] = 10 ether;
        minimumStakeRequired["vehicle"] = 5 ether;
        minimumStakeRequired["artwork"] = 8 ether;
        minimumStakeRequired["jewelry"] = 3 ether;
        minimumStakeRequired["electronics"] = 2 ether;
    }

    modifier onlyAuthorizedVerifier() {
        require(authorizedVerifiers[msg.sender], "Not an authorized verifier");
        _;
    }

    modifier onlyAssetOwner(uint256 assetId) {
        require(assets[assetId].owner == msg.sender, "Not the asset owner");
        _;
    }

    /**
     * @dev Register a new asset
     */
    function registerAsset(
        string memory assetType,
        string memory description,
        uint256 estimatedValue,
        string memory documentHash,
        string memory metadataURI
    ) public whenNotPaused returns (uint256) {
        require(supportedAssetTypes[assetType], "Asset type not supported");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(estimatedValue > 0, "Estimated value must be greater than 0");

        uint256 assetId = _assetIdCounter++;

        assets[assetId] = Asset({
            id: assetId,
            owner: msg.sender,
            assetType: assetType,
            description: description,
            estimatedValue: estimatedValue,
            documentHash: documentHash,
            metadataURI: metadataURI,
            status: AssetStatus.Pending,
            verifier: address(0),
            verificationDate: 0,
            lastAssessment: block.timestamp,
            isInsurable: false
        });

        ownerAssets[msg.sender].push(assetId);

        emit AssetRegistered(assetId, msg.sender, assetType);
        return assetId;
    }

    /**
     * @dev Verify an asset (called by authorized verifiers)
     */
    function verifyAsset(uint256 assetId, bool approved) public onlyAuthorizedVerifier whenNotPaused {
        require(assets[assetId].owner != address(0), "Asset does not exist");
        require(assets[assetId].status == AssetStatus.Pending, "Asset not pending verification");
        
        string memory assetType = assets[assetId].assetType;
        require(verifierStake[msg.sender] >= minimumStakeRequired[assetType], "Insufficient stake for this asset type");

        assets[assetId].verifier = msg.sender;
        assets[assetId].verificationDate = block.timestamp;

        if (approved) {
            assets[assetId].status = AssetStatus.Verified;
            assets[assetId].isInsurable = true;
            emit AssetVerified(assetId, msg.sender);
        } else {
            assets[assetId].status = AssetStatus.Rejected;
            emit AssetRejected(assetId, msg.sender, "Verification failed");
        }
    }

    /**
     * @dev Update asset status to insured
     */
    function markAssetInsured(uint256 assetId, uint256 policyId) public whenNotPaused {
        require(assets[assetId].owner != address(0), "Asset does not exist");
        require(assets[assetId].status == AssetStatus.Verified, "Asset not verified");
        // TODO: Add authorization check for insurance manager contract
        
        assets[assetId].status = AssetStatus.Insured;
        emit AssetInsured(assetId, policyId);
    }

    /**
     * @dev Mark asset as claimed
     */
    function markAssetClaimed(uint256 assetId, uint256 claimAmount) public whenNotPaused {
        require(assets[assetId].owner != address(0), "Asset does not exist");
        require(assets[assetId].status == AssetStatus.Insured, "Asset not insured");
        // TODO: Add authorization check for insurance manager contract
        
        assets[assetId].status = AssetStatus.Claimed;
        emit AssetClaimed(assetId, claimAmount);
    }

    /**
     * @dev Authorize a verifier with stake
     */
    function authorizeVerifier(address verifier) public payable onlyOwner {
        require(msg.value > 0, "Must provide stake");
        
        authorizedVerifiers[verifier] = true;
        verifierStake[verifier] += msg.value;
        
        emit VerifierAuthorized(verifier, msg.value);
    }

    /**
     * @dev Allow verifier to add more stake
     */
    function addVerifierStake() public payable {
        require(authorizedVerifiers[msg.sender], "Not an authorized verifier");
        require(msg.value > 0, "Must provide stake amount");
        
        verifierStake[msg.sender] += msg.value;
        emit VerifierStakeUpdated(msg.sender, verifierStake[msg.sender]);
    }

    /**
     * @dev Withdraw verifier stake (only if no pending verifications)
     */
    function withdrawVerifierStake(uint256 amount) public {
        require(authorizedVerifiers[msg.sender], "Not an authorized verifier");
        require(verifierStake[msg.sender] >= amount, "Insufficient stake");
        
        verifierStake[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        
        emit VerifierStakeUpdated(msg.sender, verifierStake[msg.sender]);
    }

    /**
     * @dev Add new asset type
     */
    function addAssetType(string memory assetType, uint256 minimumStake) public onlyOwner {
        supportedAssetTypes[assetType] = true;
        minimumStakeRequired[assetType] = minimumStake;
        
        emit AssetTypeAdded(assetType, minimumStake);
    }

    /**
     * @dev Update asset value (for reassessment)
     */
    function updateAssetValue(uint256 assetId, uint256 newValue) public onlyAssetOwner(assetId) whenNotPaused {
        require(assets[assetId].status != AssetStatus.Claimed, "Cannot update claimed asset");
        
        assets[assetId].estimatedValue = newValue;
        assets[assetId].lastAssessment = block.timestamp;
        assets[assetId].status = AssetStatus.Pending; // Require re-verification for value changes
        assets[assetId].isInsurable = false;
    }

    /**
     * @dev Get asset details
     */
    function getAsset(uint256 assetId) public view returns (Asset memory) {
        require(assets[assetId].owner != address(0), "Asset does not exist");
        return assets[assetId];
    }

    /**
     * @dev Get all assets owned by an address
     */
    function getOwnerAssets(address owner) public view returns (uint256[] memory) {
        return ownerAssets[owner];
    }

    /**
     * @dev Check if asset is insurable
     */
    function isAssetInsurable(uint256 assetId) public view returns (bool) {
        return assets[assetId].owner != address(0) && 
               assets[assetId].status == AssetStatus.Verified && 
               assets[assetId].isInsurable;
    }

    /**
     * @dev Check if verifier can verify specific asset type
     */
    function canVerifyAssetType(address verifier, string memory assetType) public view returns (bool) {
        return authorizedVerifiers[verifier] && 
               verifierStake[verifier] >= minimumStakeRequired[assetType];
    }

    /**
     * @dev Get verifier stake
     */
    function getVerifierStake(address verifier) public view returns (uint256) {
        return verifierStake[verifier];
    }

    /**
     * @dev Pause the contract
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
