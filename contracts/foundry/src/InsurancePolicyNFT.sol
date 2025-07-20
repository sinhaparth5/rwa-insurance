// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title InsurancePolicyNFT
 * @dev NFT representing individual insurance policies for real-world assets
 */
contract InsurancePolicyNFT is ERC721, Ownable, Pausable {
    using Strings for uint256;

    // Policy status enum
    enum PolicyStatus { Active, Claimed, Expired, Cancelled }

    // Policy structure
    struct Policy {
        uint256 assetId;           // Reference to asset in AssetRegistry
        address policyholder;      // Policy owner
        uint256 coverageAmount;    // Coverage amount in wei
        uint256 premiumAmount;     // Premium amount per period
        uint256 startDate;         // Policy start timestamp
        uint256 endDate;           // Policy end timestamp
        uint256 lastPremiumPaid;   // Last premium payment timestamp
        PolicyStatus status;       // Current policy status
        string metadataURI;        // Metadata URI for the policy
    }

    // State variables
    uint256 private _tokenIdCounter;
    mapping(uint256 => Policy) public policies;
    mapping(address => uint256[]) public userPolicies;
    mapping(uint256 => bool) public activePolicies;
    
    // Platform contracts
    address public insuranceManager;
    address public assetRegistry;
    
    // Base URI for metadata
    string private _baseTokenURI;

    // Events
    event PolicyCreated(uint256 indexed tokenId, address indexed policyholder, uint256 assetId);
    event PolicyClaimed(uint256 indexed tokenId, uint256 claimAmount);
    event PolicyExpired(uint256 indexed tokenId);
    event PolicyCancelled(uint256 indexed tokenId);
    event PremiumPaid(uint256 indexed tokenId, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }

    modifier onlyInsuranceManager() {
        require(msg.sender == insuranceManager, "Only insurance manager can call this");
        _;
    }

    /**
     * @dev Set the insurance manager contract address
     */
    function setInsuranceManager(address _insuranceManager) public onlyOwner {
        insuranceManager = _insuranceManager;
    }

    /**
     * @dev Set the asset registry contract address
     */
    function setAssetRegistry(address _assetRegistry) public onlyOwner {
        assetRegistry = _assetRegistry;
    }

    /**
     * @dev Create a new insurance policy
     */
    function createPolicy(
        address policyholder,
        uint256 assetId,
        uint256 coverageAmount,
        uint256 premiumAmount,
        uint256 duration,
        string memory metadataURI
    ) public onlyInsuranceManager whenNotPaused returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + duration;

        policies[tokenId] = Policy({
            assetId: assetId,
            policyholder: policyholder,
            coverageAmount: coverageAmount,
            premiumAmount: premiumAmount,
            startDate: startDate,
            endDate: endDate,
            lastPremiumPaid: startDate,
            status: PolicyStatus.Active,
            metadataURI: metadataURI
        });

        activePolicies[tokenId] = true;
        userPolicies[policyholder].push(tokenId);

        _mint(policyholder, tokenId);

        emit PolicyCreated(tokenId, policyholder, assetId);
        return tokenId;
    }

    /**
     * @dev Process an insurance claim
     */
    function processClaim(uint256 tokenId, uint256 claimAmount) public onlyInsuranceManager whenNotPaused {
        require(_ownerOf(tokenId) != address(0), "Policy does not exist");
        require(policies[tokenId].status == PolicyStatus.Active, "Policy is not active");
        require(claimAmount <= policies[tokenId].coverageAmount, "Claim exceeds coverage");

        policies[tokenId].status = PolicyStatus.Claimed;
        activePolicies[tokenId] = false;

        emit PolicyClaimed(tokenId, claimAmount);
    }

    /**
     * @dev Record premium payment
     */
    function recordPremiumPayment(uint256 tokenId) public onlyInsuranceManager whenNotPaused {
        require(_ownerOf(tokenId) != address(0), "Policy does not exist");
        require(policies[tokenId].status == PolicyStatus.Active, "Policy is not active");

        policies[tokenId].lastPremiumPaid = block.timestamp;

        emit PremiumPaid(tokenId, policies[tokenId].premiumAmount);
    }

    /**
     * @dev Expire a policy
     */
    function expirePolicy(uint256 tokenId) public onlyInsuranceManager whenNotPaused {
        require(_ownerOf(tokenId) != address(0), "Policy does not exist");
        require(policies[tokenId].status == PolicyStatus.Active, "Policy is not active");

        policies[tokenId].status = PolicyStatus.Expired;
        activePolicies[tokenId] = false;

        emit PolicyExpired(tokenId);
    }

    /**
     * @dev Cancel a policy
     */
    function cancelPolicy(uint256 tokenId) public whenNotPaused {
        require(_ownerOf(tokenId) != address(0), "Policy does not exist");
        require(ownerOf(tokenId) == msg.sender || msg.sender == insuranceManager, "Not authorized");
        require(policies[tokenId].status == PolicyStatus.Active, "Policy is not active");

        policies[tokenId].status = PolicyStatus.Cancelled;
        activePolicies[tokenId] = false;

        emit PolicyCancelled(tokenId);
    }

    /**
     * @dev Get policy details
     */
    function getPolicy(uint256 tokenId) public view returns (Policy memory) {
        require(_ownerOf(tokenId) != address(0), "Policy does not exist");
        return policies[tokenId];
    }

    /**
     * @dev Get all policies for a user
     */
    function getUserPolicies(address user) public view returns (uint256[] memory) {
        return userPolicies[user];
    }

    /**
     * @dev Check if policy is active
     */
    function isPolicyActive(uint256 tokenId) public view returns (bool) {
        return activePolicies[tokenId] && policies[tokenId].status == PolicyStatus.Active;
    }

    /**
     * @dev Check if premium is overdue
     */
    function isPremiumOverdue(uint256 tokenId, uint256 gracePeriod) public view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Policy does not exist");
        return block.timestamp > policies[tokenId].lastPremiumPaid + gracePeriod;
    }

    /**
     * @dev Set base URI for metadata
     */
    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @dev Get token URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "URI query for nonexistent token");
        
        if (bytes(policies[tokenId].metadataURI).length > 0) {
            return policies[tokenId].metadataURI;
        }
        
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, tokenId.toString())) 
            : "";
    }

    /**
     * @dev Get base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
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
}
