export const MOCK_USER_DATA = {
  // Sample user profile
  userProfile: {
    walletAddress: "0x742d35Cc6634C0532925a3b8D4f25d45ad111111",
    username: "Bob Smith",
    email: "bob@example.com",
    kycStatus: "verified",
    joinedAt: "2024-01-15T10:30:00Z",
    totalPolicies: 2,
    totalClaims: 0
  },

  // Sample tokenized assets
  assets: [
    {
      tokenId: "456", // CarNFT-AstonDB5-456 from your document
      assetType: "vehicle",
      metadata: {
        name: "1965 Aston Martin DB5",
        description: "Classic British sports car, fully restored",
        image: "/images/aston-martin-db5.jpg",
        vin: "DB5456789012345",
        year: 1965,
        make: "Aston Martin",
        model: "DB5",
        color: "Silver Birch",
        engineSize: "4.0L"
      },
      owner: "0x742d35Cc6634C0532925a3b8D4f25d45ad111111",
      verified: true,
      ownershipScore: 95, // AI confidence score
      estimatedValue: "£450,000",
      location: "London, UK"
    },
    {
      tokenId: "789",
      assetType: "property",
      metadata: {
        name: "Victorian Townhouse",
        description: "4-bedroom Victorian townhouse in prime London location",
        image: "/images/victorian-house.jpg",
        propertyId: "LDN789456123",
        address: "123 Baker Street, London NW1 6XE",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2500
      },
      owner: "0x742d35Cc6634C0532925a3b8D4f25d45ad111111",
      verified: true,
      ownershipScore: 88,
      estimatedValue: "£1,200,000",
      location: "London, UK"
    }
  ],

  // Sample insurance policies
  policies: [
    {
      id: "POL001",
      assetTokenId: "456",
      owner: "0x742d35Cc6634C0532925a3b8D4f25d45ad111111",
      coverageAmount: "50000", // £50,000 in stablecoin
      premium: "125", // £125/month
      duration: 12, // 12 months
      riskScore: 70, // AI assessment
      status: "active",
      createdAt: "2024-01-20T14:30:00Z",
      expiresAt: "2025-01-20T14:30:00Z",
      assetDetails: {
        name: "1965 Aston Martin DB5",
        type: "vehicle"
      },
      nextPaymentDue: "2024-02-20T14:30:00Z"
    }
  ],

  // Sample claims
  claims: [
    {
      id: "CLM001",
      policyId: "POL001",
      claimType: "damage",
      amount: "5000",
      status: "approved",
      description: "Minor accident damage to front bumper",
      evidence: [
        "QmYwAPJzv5CZsnA6P7cDGzJ8qR2aKY7Z9vN3mQ4xF8sT1U", // IPFS hash
        "QmBx9CvLmQ3gT4wR6nY8fZ2jK5pL9mN7vS1qE4tA6bC8D"  // IPFS hash
      ],
      submittedAt: "2024-01-25T09:15:00Z",
      processedAt: "2024-01-27T16:45:00Z",
      assessorNotes: "Claim verified through police report and photographic evidence"
    }
  ]
};
