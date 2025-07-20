// script/Deployer.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AssetRegistry.sol";
import "../src/InsuranceManager.sol";
import "../src/InsurancePolicyNFT.sol";
import "../src/PremiumSubscription.sol";

contract Deployer is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy AssetRegistry first
        AssetRegistry assetRegistry = new AssetRegistry();
        console.log("AssetRegistry deployed at:", address(assetRegistry));

        // Deploy InsurancePolicyNFT
        InsurancePolicyNFT policyNFT = new InsurancePolicyNFT(
            "RWA Insurance Policy",
            "RWAIP", 
            "https://api.rwainsurance.com/policy/"
        );
        console.log("InsurancePolicyNFT deployed at:", address(policyNFT));

        // For this example, we'll deploy a mock ERC20 token as payment token
        // In production, you might use USDC, USDT, or your own token
        MockERC20 paymentToken = new MockERC20();
        console.log("PaymentToken deployed at:", address(paymentToken));

        // Deploy InsuranceManager
        InsuranceManager insuranceManager = new InsuranceManager(
            address(paymentToken),
            address(policyNFT),
            address(assetRegistry),
            msg.sender // treasury address
        );
        console.log("InsuranceManager deployed at:", address(insuranceManager));

        // Deploy PremiumSubscription
        PremiumSubscription premiumSubscription = new PremiumSubscription(
            address(paymentToken)
        );
        console.log("PremiumSubscription deployed at:", address(premiumSubscription));

        // Set up connections between contracts
        policyNFT.setInsuranceManager(address(insuranceManager));
        policyNFT.setAssetRegistry(address(assetRegistry));

        console.log("=== Deployment Summary ===");
        console.log("AssetRegistry:", address(assetRegistry));
        console.log("InsuranceManager:", address(insuranceManager));
        console.log("PolicyNFT:", address(policyNFT));
        console.log("PremiumSubscription:", address(premiumSubscription));
        console.log("PaymentToken:", address(paymentToken));

        vm.stopBroadcast();
    }
}

// Mock ERC20 token for testing
contract MockERC20 {
    string public name = "Test USDC";
    string public symbol = "TUSDC";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18; // 1M tokens

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        
        emit Transfer(from, to, value);
        return true;
    }

    // Mint function for testing
    function mint(address to, uint256 amount) public {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}

// Alternative deployment script with more configuration
contract DeployerAdvanced is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying from:", deployer);
        console.log("Deployer balance:", deployer.balance);

        // Deploy contracts with error handling
        try vm.toString(address(0)) {
            console.log("Starting deployment...");
        } catch {
            console.log("Error in deployment setup");
        }

        // Deploy AssetRegistry
        AssetRegistry assetRegistry = new AssetRegistry();
        require(address(assetRegistry) != address(0), "AssetRegistry deployment failed");

        // Deploy PolicyNFT
        InsurancePolicyNFT policyNFT = new InsurancePolicyNFT(
            "RWA Insurance Policy",
            "RWAIP",
            "https://api.rwainsurance.com/policy/"
        );
        require(address(policyNFT) != address(0), "PolicyNFT deployment failed");

        // Deploy mock payment token
        MockERC20 paymentToken = new MockERC20();
        require(address(paymentToken) != address(0), "PaymentToken deployment failed");

        // Deploy InsuranceManager
        InsuranceManager insuranceManager = new InsuranceManager(
            address(paymentToken),
            address(policyNFT),
            address(assetRegistry),
            deployer // treasury
        );
        require(address(insuranceManager) != address(0), "InsuranceManager deployment failed");

        // Deploy PremiumSubscription
        PremiumSubscription premiumSubscription = new PremiumSubscription(
            address(paymentToken)
        );
        require(address(premiumSubscription) != address(0), "PremiumSubscription deployment failed");

        // Setup contract connections
        policyNFT.setInsuranceManager(address(insuranceManager));
        policyNFT.setAssetRegistry(address(assetRegistry));

        // Mint some test tokens to deployer
        paymentToken.mint(deployer, 100000 * 10**18); // 100k test tokens

        console.log("\n=== DEPLOYMENT SUCCESSFUL ===");
        console.log("Network: BlockDAG Primordial");
        console.log("Deployer:", deployer);
        console.log("\n=== CONTRACT ADDRESSES ===");
        console.log("NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=%s", address(assetRegistry));
        console.log("NEXT_PUBLIC_INSURANCE_MANAGER_ADDRESS=%s", address(insuranceManager));
        console.log("NEXT_PUBLIC_POLICY_NFT_ADDRESS=%s", address(policyNFT));
        console.log("NEXT_PUBLIC_PREMIUM_SUBSCRIPTION_ADDRESS=%s", address(premiumSubscription));
        console.log("NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=%s", address(paymentToken));

        vm.stopBroadcast();
    }
}
