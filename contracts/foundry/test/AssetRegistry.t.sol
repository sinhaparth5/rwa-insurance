// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AssetRegistry.sol";

contract AssetRegistryTest is Test {
    AssetRegistry public assetRegistry;
    
    address public owner = address(1);
    address public verifier = address(2);
    address public assetOwner = address(3);
    
    uint256 public constant STAKE_AMOUNT = 10 ether;
    
    function setUp() public {
        vm.startPrank(owner);
        assetRegistry = new AssetRegistry();
        vm.stopPrank();
        
        vm.deal(owner, 100 ether);
        vm.deal(verifier, 50 ether);
    }
    
    function testRegisterAsset() public {
        vm.startPrank(assetOwner);
        
        uint256 assetId = assetRegistry.registerAsset(
            "real_estate",
            "Beautiful house",
            1000000 ether,
            "QmHash123",
            "https://metadata.uri"
        );
        
        AssetRegistry.Asset memory asset = assetRegistry.getAsset(assetId);
        
        assertEq(asset.owner, assetOwner);
        assertEq(asset.assetType, "real_estate");
        assertEq(asset.estimatedValue, 1000000 ether);
        assertEq(uint256(asset.status), uint256(AssetRegistry.AssetStatus.Pending));
        
        vm.stopPrank();
    }
    
    function testVerifyAsset() public {
        // Register asset
        vm.startPrank(assetOwner);
        uint256 assetId = assetRegistry.registerAsset(
            "real_estate",
            "Beautiful house",
            1000000 ether,
            "QmHash123",
            "https://metadata.uri"
        );
        vm.stopPrank();
        
        // Authorize verifier
        vm.startPrank(owner);
        assetRegistry.authorizeVerifier{value: STAKE_AMOUNT}(verifier);
        vm.stopPrank();
        
        // Verify asset
        vm.startPrank(verifier);
        assetRegistry.verifyAsset(assetId, true);
        
        AssetRegistry.Asset memory asset = assetRegistry.getAsset(assetId);
        assertEq(uint256(asset.status), uint256(AssetRegistry.AssetStatus.Verified));
        assertTrue(asset.isInsurable);
        
        vm.stopPrank();
    }
    
    function testRejectAsset() public {
        // Register asset
        vm.startPrank(assetOwner);
        uint256 assetId = assetRegistry.registerAsset(
            "vehicle",
            "Tesla Model S",
            50000 ether,
            "QmHash456",
            "https://metadata.uri"
        );
        vm.stopPrank();
        
        // Authorize verifier
        vm.startPrank(owner);
        assetRegistry.authorizeVerifier{value: STAKE_AMOUNT}(verifier);
        vm.stopPrank();
        
        // Reject asset
        vm.startPrank(verifier);
        assetRegistry.verifyAsset(assetId, false);
        
        AssetRegistry.Asset memory asset = assetRegistry.getAsset(assetId);
        assertEq(uint256(asset.status), uint256(AssetRegistry.AssetStatus.Rejected));
        assertFalse(asset.isInsurable);
        
        vm.stopPrank();
    }
}
