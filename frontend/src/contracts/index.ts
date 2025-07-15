import AssetRegistryArtifact from '../../out/AssetRegistry.sol/AssetRegistry.json';
import InsuranceManagerArtifacts from '../../out/InsuranceManager.sol/InsuranceManager.json';
import PolicyNFTArtifacts from '../../out/InsurancePolicyNFT.sol/InsurancePolicyNFT.json';
import PremiumSubscriptionArtifacts from '../../out/PremiumSubscription.sol/PremiumSubscription.json';

export const ASSET_REGISTRY_ABI = AssetRegistryArtifact.abi;
export const INSURANCE_MANAGER_ABI = InsuranceManagerArtifacts.abi;
export const POLICY_NFT_ABI = PolicyNFTArtifacts.abi;
export const PREMIUM_SUBSCRIPTION_ABI = PremiumSubscriptionArtifacts.abi;

export const CONTRACT_ADDRESSES = {
    ASSET_REGISTRY: process.env.NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS as `0x${string}`,
    INSURANCE_MANAGER: process.env.NEXT_PUBLIC_INSURANCE_MANAGER_ADDRESS as `0x${string}`,
    POLICY_NFT: process.env.NEXT_PUBLIC_POLICY_NFT_ADDRESS as `0x${string}`,
    PREMIUM_SUBSCRIPTION: process.env.NEXT_PUBLIC_PREMIUM_SUBSCRIPTION_ADDRESS as `0x${string}`,
    PAYMENT_TOKEN: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as `0x${string}`,
} as const;

export const ERC20_ABI = [
    {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf", 
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;