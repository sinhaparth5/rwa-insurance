// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/InsuranceManager.sol";
import "../src/AssetRegistry.sol";
import "../src/InsurancePolicyNFT.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock Token", "MOCK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract InsuranceManagerTest is Test {
    InsuranceManager public insuranceManager;
    AssetRegistry public assetRegistry;
    InsurancePolicyNFT public policyNFT;
    MockERC20 public token;
    
    address public owner = address(1);
    address public treasury = address(2);
    address public assetOwner = address(3);
    address public verifier = address(4);
    
    uint256 public constant ASSET_VALUE = 100000 * 10**18;
    uint256 public constant COVERAGE_AMOUNT = 80000 * 10**18;
    uint256 public constant DURATION = 365 days;
    
    function setUp() public {
        vm.startPrank(owner);
        
        token = new MockERC20();
        assetRegistry = new AssetRegistry();
        policyNFT = new InsurancePolicyNFT(
            "Insurance Policy NFT",
            "IPNFT",
            "https://metadata.uri/"
        );
        
        insuranceManager = new InsuranceManager(
            address(token),
            address(policyNFT),
            address(assetRegistry),
            treasury
        );
        
        policyNFT.setInsuranceManager(address(insuranceManager));
        token.transfer(assetOwner, 100000 * 10**18);
        
        vm.deal(owner, 100 ether);
        assetRegistry.authorizeVerifier{value: 10 ether}(verifier);
        
        vm.stopPrank();
    }
    
    function testPurchasePolicy() public {
        // Register and verify asset
        vm.startPrank(assetOwner);
        uint256 assetId = assetRegistry.registerAsset(
            "real_estate",
            "Beautiful house",
            ASSET_VALUE,
            "QmHash123",
            "https://metadata.uri"
        );
        vm.stopPrank();
        
        vm.startPrank(verifier);
        assetRegistry.verifyAsset(assetId, true);
        vm.stopPrank();
        
        // Purchase policy
        uint256 expectedPremium = insuranceManager.calculatePremium(
            "real_estate",
            COVERAGE_AMOUNT,
            InsuranceManager.RiskLevel.Medium
        );
        
        vm.startPrank(assetOwner);
        token.approve(address(insuranceManager), expectedPremium);
        
        uint256 policyId = insuranceManager.purchasePolicy(
            assetId,
            COVERAGE_AMOUNT,
            DURATION,
            InsuranceManager.RiskLevel.Medium
        );
        
        assertEq(policyNFT.ownerOf(policyId), assetOwner);
        assertTrue(policyNFT.isPolicyActive(policyId));
        
        vm.stopPrank();
    }
    
    function testSubmitClaim() public {
        uint256 policyId = _createPolicy();
        
        vm.startPrank(assetOwner);
        uint256 claimAmount = 50000 * 10**18;
        
        uint256 claimId = insuranceManager.submitClaim(
            policyId,
            claimAmount,
            "Fire damage",
            "QmEvidenceHash123"
        );
        
        (uint256 returnedPolicyId, address claimant, uint256 returnedAmount,,,,,,) = insuranceManager.claims(claimId);
        
        assertEq(returnedPolicyId, policyId);
        assertEq(claimant, assetOwner);
        assertEq(returnedAmount, claimAmount);
        
        vm.stopPrank();
    }
    
    function testCalculatePremium() public view {
        uint256 premium = insuranceManager.calculatePremium(
            "real_estate",
            100000 * 10**18,
            InsuranceManager.RiskLevel.Medium
        );
        
        assertTrue(premium > 0);
    }
    
    // Helper function
    function _createPolicy() internal returns (uint256) {
        vm.startPrank(assetOwner);
        uint256 assetId = assetRegistry.registerAsset(
            "real_estate",
            "Beautiful house",
            ASSET_VALUE,
            "QmHash123",
            "https://metadata.uri"
        );
        vm.stopPrank();
        
        vm.startPrank(verifier);
        assetRegistry.verifyAsset(assetId, true);
        vm.stopPrank();
        
        vm.startPrank(assetOwner);
        uint256 premium = insuranceManager.calculatePremium(
            "real_estate",
            COVERAGE_AMOUNT,
            InsuranceManager.RiskLevel.Medium
        );
        
        token.approve(address(insuranceManager), premium);
        
        uint256 policyId = insuranceManager.purchasePolicy(
            assetId,
            COVERAGE_AMOUNT,
            DURATION,
            InsuranceManager.RiskLevel.Medium
        );
        
        vm.stopPrank();
        return policyId;
    }
}
