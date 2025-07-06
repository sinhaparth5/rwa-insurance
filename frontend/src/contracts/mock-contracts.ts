export const MOCK_CONTRACTS = {
  // 🚗 Mock Vehicle NFT - Replace with real address after deployment
  vehicleNFT: {
    address: "0x1234567890123456789012345678901234567890", // Will be your deployed contract
    abi: [
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function mintVehicleNFT(address to, uint256 tokenId, string metadata)",
      "function balanceOf(address owner) view returns (uint256)"
    ]
  },

  // 🛡️ Mock Insurance Policy Contract
  insurancePolicy: {
    address: "0x2345678901234567890123456789012345678901", // Will be your deployed contract
    abi: [
      "function createPolicy(uint256 assetTokenId, uint256 coverageAmount, uint256 premium, uint256 duration) returns (uint256)",
      "function submitClaim(uint256 policyId, uint256 claimAmount, string evidenceHash)",
      "function payPremium(uint256 policyId)",
      "function getPolicy(uint256 policyId) view returns (tuple)"
    ]
  },

  // 💰 Mock RWA-GBP Stablecoin
  rwaGBP: {
    address: "0x3456789012345678901234567890123456789012", // Will be your deployed contract
    abi: [
      "function balanceOf(address account) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)"
    ]
  }
};