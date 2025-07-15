// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./InsurancePolicyNFT.sol";
import "./AssetRegistry.sol";

/**
 * @title InsuranceManager
 * @dev Core business logic for the RWA Insurance Platform
 */
contract InsuranceManager is Ownable, Pausable, ReentrancyGuard {
    
    // Risk assessment levels
    enum RiskLevel { Low, Medium, High, VeryHigh }
    
    // Claim status
    enum ClaimStatus { Pending, Approved, Rejected, Paid }
    
    // Platform contracts
    IERC20 public immutable paymentToken;
    InsurancePolicyNFT public immutable policyNFT;
    AssetRegistry public immutable assetRegistry;
    
    // Risk and pricing parameters
    mapping(string => uint256) public baseRiskMultiplier; // per asset type
    mapping(RiskLevel => uint256) public riskPremiumMultiplier;
    
    // Platform settings
    uint256 public platformFeePercent = 100; // 1% = 100 basis points
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant PREMIUM_PERIOD = 30 days;
    uint256 public constant GRACE_PERIOD = 7 days;
    
    // Treasury and rewards
    address public treasury;
    uint256 public totalPremiumCollected;
    uint256 public totalClaimsPaid;
    
    // Claims management
    struct Claim {
        uint256 policyId;
        address claimant;
        uint256 claimAmount;
        string description;
        string evidenceHash; // IPFS hash of claim evidence
        ClaimStatus status;
        address assessor;
        uint256 submitDate;
        uint256 processDate;
    }
    
    mapping(uint256 => Claim) public claims;
    uint256 private _claimIdCounter;
    
    // Assessor management
    mapping(address => bool) public authorizedAssessors;
    mapping(address => uint256) public assessorStake;
    uint256 public minimumAssessorStake = 1000 * 10**18; // 1000 tokens
    
    // Events
    event PolicyPurchased(uint256 indexed policyId, address indexed policyholder, uint256 assetId);
    event PremiumPaid(uint256 indexed policyId, uint256 amount, uint256 dueDate);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, uint256 amount);
    event ClaimProcessed(uint256 indexed claimId, ClaimStatus status, uint256 payoutAmount);
    event AssessorAuthorized(address indexed assessor, uint256 stakeAmount);
    event PlatformFeeUpdated(uint256 newFeePercent);
    
    constructor(
        address _paymentToken,
        address _policyNFT,
        address _assetRegistry,
        address _treasury
    ) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        policyNFT = InsurancePolicyNFT(_policyNFT);
        assetRegistry = AssetRegistry(_assetRegistry);
        treasury = _treasury;
        
        // Initialize risk multipliers
        baseRiskMultiplier["real_estate"] = 200; // 2%
        baseRiskMultiplier["vehicle"] = 500; // 5%
        baseRiskMultiplier["artwork"] = 300; // 3%
        baseRiskMultiplier["jewelry"] = 400; // 4%
        baseRiskMultiplier["electronics"] = 600; // 6%
        
        riskPremiumMultiplier[RiskLevel.Low] = 100; // 1x
        riskPremiumMultiplier[RiskLevel.Medium] = 150; // 1.5x
        riskPremiumMultiplier[RiskLevel.High] = 200; // 2x
        riskPremiumMultiplier[RiskLevel.VeryHigh] = 300; // 3x
    }
    
    modifier onlyAuthorizedAssessor() {
        require(authorizedAssessors[msg.sender], "Not an authorized assessor");
        _;
    }
    
    /**
     * @dev Purchase insurance policy for an asset
     */
    function purchasePolicy(
        uint256 assetId,
        uint256 coverageAmount,
        uint256 duration,
        RiskLevel riskLevel
    ) public whenNotPaused nonReentrant returns (uint256) {
        // Verify asset is insurable
        require(assetRegistry.isAssetInsurable(assetId), "Asset not insurable");
        
        AssetRegistry.Asset memory asset = assetRegistry.getAsset(assetId);
        require(asset.owner == msg.sender, "Not asset owner");
        require(coverageAmount <= asset.estimatedValue, "Coverage exceeds asset value");
        
        // Calculate premium
        uint256 premiumAmount = calculatePremium(asset.assetType, coverageAmount, riskLevel);
        
        // Transfer premium payment
        require(
            paymentToken.transferFrom(msg.sender, address(this), premiumAmount),
            "Premium payment failed"
        );
        
        // Create policy NFT
        uint256 policyId = policyNFT.createPolicy(
            msg.sender,
            assetId,
            coverageAmount,
            premiumAmount,
            duration,
            ""
        );
        
        // Update asset status
        assetRegistry.markAssetInsured(assetId, policyId);
        
        // Track premium collection
        totalPremiumCollected += premiumAmount;
        
        // Distribute platform fee
        uint256 platformFee = (premiumAmount * platformFeePercent) / BASIS_POINTS;
        paymentToken.transfer(treasury, platformFee);
        
        emit PolicyPurchased(policyId, msg.sender, assetId);
        return policyId;
    }
    
    /**
     * @dev Pay recurring premium
     */
    function payPremium(uint256 policyId) public whenNotPaused nonReentrant {
        require(policyNFT.ownerOf(policyId) == msg.sender, "Not policy owner");
        require(policyNFT.isPolicyActive(policyId), "Policy not active");
        
        InsurancePolicyNFT.Policy memory policy = policyNFT.getPolicy(policyId);
        
        // Transfer premium payment
        require(
            paymentToken.transferFrom(msg.sender, address(this), policy.premiumAmount),
            "Premium payment failed"
        );
        
        // Record payment
        policyNFT.recordPremiumPayment(policyId);
        
        // Track premium collection
        totalPremiumCollected += policy.premiumAmount;
        
        // Distribute platform fee
        uint256 platformFee = (policy.premiumAmount * platformFeePercent) / BASIS_POINTS;
        paymentToken.transfer(treasury, platformFee);
        
        emit PremiumPaid(policyId, policy.premiumAmount, block.timestamp + PREMIUM_PERIOD);
    }
    
    /**
     * @dev Submit insurance claim
     */
    function submitClaim(
        uint256 policyId,
        uint256 claimAmount,
        string memory description,
        string memory evidenceHash
    ) public whenNotPaused returns (uint256) {
        require(policyNFT.ownerOf(policyId) == msg.sender, "Not policy owner");
        require(policyNFT.isPolicyActive(policyId), "Policy not active");
        
        InsurancePolicyNFT.Policy memory policy = policyNFT.getPolicy(policyId);
        require(claimAmount <= policy.coverageAmount, "Claim exceeds coverage");
        
        // Check premium is not overdue
        require(
            !policyNFT.isPremiumOverdue(policyId, GRACE_PERIOD),
            "Premium overdue"
        );
        
        uint256 claimId = _claimIdCounter++;
        
        claims[claimId] = Claim({
            policyId: policyId,
            claimant: msg.sender,
            claimAmount: claimAmount,
            description: description,
            evidenceHash: evidenceHash,
            status: ClaimStatus.Pending,
            assessor: address(0),
            submitDate: block.timestamp,
            processDate: 0
        });
        
        emit ClaimSubmitted(claimId, policyId, claimAmount);
        return claimId;
    }
    
    /**
     * @dev Process claim (by authorized assessor)
     */
    function processClaim(
        uint256 claimId,
        bool approved,
        uint256 payoutAmount
    ) public onlyAuthorizedAssessor whenNotPaused nonReentrant {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.Pending, "Claim already processed");
        require(payoutAmount <= claim.claimAmount, "Payout exceeds claim amount");
        
        claim.assessor = msg.sender;
        claim.processDate = block.timestamp;
        
        if (approved && payoutAmount > 0) {
            claim.status = ClaimStatus.Approved;
            
            // Transfer payout to claimant
            require(
                paymentToken.transfer(claim.claimant, payoutAmount),
                "Payout transfer failed"
            );
            
            // Mark policy as claimed
            policyNFT.processClaim(claim.policyId, payoutAmount);
            
            // Update asset status
            AssetRegistry.Asset memory asset = assetRegistry.getAsset(
                policyNFT.getPolicy(claim.policyId).assetId
            );
            assetRegistry.markAssetClaimed(asset.id, payoutAmount);
            
            // Track claims paid
            totalClaimsPaid += payoutAmount;
            
            // Reward assessor with direct transfer from contract balance
            uint256 assessorReward = (payoutAmount * 50) / BASIS_POINTS; // 0.5%
            if (assessorReward > 0 && paymentToken.balanceOf(address(this)) >= assessorReward) {
                paymentToken.transfer(msg.sender, assessorReward);
            }
            
            claim.status = ClaimStatus.Paid;
        } else {
            claim.status = ClaimStatus.Rejected;
        }
        
        emit ClaimProcessed(claimId, claim.status, payoutAmount);
    }
    
    /**
     * @dev Calculate premium based on asset type, coverage, and risk level
     */
    function calculatePremium(
        string memory assetType,
        uint256 coverageAmount,
        RiskLevel riskLevel
    ) public view returns (uint256) {
        uint256 baseRate = baseRiskMultiplier[assetType];
        require(baseRate > 0, "Asset type not supported");
        
        uint256 riskMultiplier = riskPremiumMultiplier[riskLevel];
        
        // Calculate annual premium: (coverage * baseRate * riskMultiplier) / 10000
        uint256 annualPremium = (coverageAmount * baseRate * riskMultiplier) / (BASIS_POINTS * 100);
        
        // Return monthly premium
        return annualPremium / 12;
    }
    
    /**
     * @dev Authorize assessor with stake
     */
    function authorizeAssessor(address assessor, uint256 stakeAmount) public onlyOwner {
        require(stakeAmount >= minimumAssessorStake, "Insufficient stake");
        require(
            paymentToken.transferFrom(msg.sender, address(this), stakeAmount),
            "Stake transfer failed"
        );
        
        authorizedAssessors[assessor] = true;
        assessorStake[assessor] = stakeAmount;
        
        emit AssessorAuthorized(assessor, stakeAmount);
    }
    
    /**
     * @dev Expire overdue policies
     */
    function expireOverduePolicies(uint256[] memory policyIds) public {
        for (uint256 i = 0; i < policyIds.length; i++) {
            uint256 policyId = policyIds[i];
            if (policyNFT.isPremiumOverdue(policyId, GRACE_PERIOD)) {
                policyNFT.expirePolicy(policyId);
            }
        }
    }
    
    /**
     * @dev Update platform fee
     */
    function updatePlatformFee(uint256 newFeePercent) public onlyOwner {
        require(newFeePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(newFeePercent);
    }
    
    /**
     * @dev Update treasury address
     */
    function updateTreasury(address newTreasury) public onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        treasury = newTreasury;
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() public view returns (
        uint256 totalPremiums,
        uint256 totalClaims,
        uint256 activeBalance,
        uint256 platformBalance
    ) {
        return (
            totalPremiumCollected,
            totalClaimsPaid,
            totalPremiumCollected - totalClaimsPaid,
            paymentToken.balanceOf(address(this))
        );
    }
    
    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw(uint256 amount) public onlyOwner {
        require(amount <= paymentToken.balanceOf(address(this)), "Insufficient balance");
        paymentToken.transfer(owner(), amount);
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
