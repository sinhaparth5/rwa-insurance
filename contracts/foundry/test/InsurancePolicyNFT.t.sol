// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/InsurancePolicyNFT.sol";

contract InsurancePolicyNFTTest is Test {
    InsurancePolicyNFT public policyNFT;
    
    address public owner = address(1);
    address public insuranceManager = address(2);
    address public policyholder = address(3);
    
    function setUp() public {
        vm.startPrank(owner);
        policyNFT = new InsurancePolicyNFT(
            "Insurance Policy NFT",
            "IPNFT",
            "https://metadata.uri/"
        );
        
        policyNFT.setInsuranceManager(insuranceManager);
        vm.stopPrank();
    }
    
    function testCreatePolicy() public {
        vm.startPrank(insuranceManager);
        
        uint256 policyId = policyNFT.createPolicy(
            policyholder,
            1, // assetId
            100000 ether, // coverageAmount
            1000 ether, // premiumAmount
            365 days, // duration
            "https://policy.metadata.uri"
        );
        
        assertEq(policyId, 0);
        assertEq(policyNFT.ownerOf(policyId), policyholder);
        
        InsurancePolicyNFT.Policy memory policy = policyNFT.getPolicy(policyId);
        assertEq(policy.assetId, 1);
        assertEq(policy.coverageAmount, 100000 ether);
        assertEq(uint256(policy.status), uint256(InsurancePolicyNFT.PolicyStatus.Active));
        
        vm.stopPrank();
    }
    
    function testProcessClaim() public {
        vm.startPrank(insuranceManager);
        uint256 policyId = policyNFT.createPolicy(
            policyholder,
            1,
            100000 ether,
            1000 ether,
            365 days,
            ""
        );
        
        policyNFT.processClaim(policyId, 50000 ether);
        
        InsurancePolicyNFT.Policy memory policy = policyNFT.getPolicy(policyId);
        assertEq(uint256(policy.status), uint256(InsurancePolicyNFT.PolicyStatus.Claimed));
        assertFalse(policyNFT.activePolicies(policyId));
        
        vm.stopPrank();
    }
    
    function testCancelPolicy() public {
        vm.startPrank(insuranceManager);
        uint256 policyId = policyNFT.createPolicy(
            policyholder,
            1,
            100000 ether,
            1000 ether,
            365 days,
            ""
        );
        vm.stopPrank();
        
        vm.startPrank(policyholder);
        policyNFT.cancelPolicy(policyId);
        
        InsurancePolicyNFT.Policy memory policy = policyNFT.getPolicy(policyId);
        assertEq(uint256(policy.status), uint256(InsurancePolicyNFT.PolicyStatus.Cancelled));
        
        vm.stopPrank();
    }
}
