export const fakeAPI = {
    async getRiskAssessment(nftContract: string, tokenId: number, walletAddress: string) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            vehicle_info: { make: "Aston Martin", model: "DB5", year: 1965, value: 500000},
            risk_score: 78.5,
            monthly_premium: 156,
            risk_factors: ["High value classic vehicle", "London location"],
            coverage_recommendations: "comprehensive",
            confidence: 0.92
        };
    },
    
    async getUserAssets(walletAddress: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      total_assets: 2,
      total_value: 75000,
      assets: [
        {
          token_id: 456,
          name: "1965 Aston Martin DB5",
          value: 50000,
          verified: true,
          risk_score: 78,
          premium_estimate: 156
        },
        {
          token_id: 789,
          name: "2020 Ferrari F8",
          value: 25000,
          verified: true,
          risk_score: 65,
          premium_estimate: 89
        }
      ]
    };
  },

  async getUserPolicies(walletAddress: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        policy_id: "POL-456-001",
        asset_name: "1965 Aston Martin DB5",
        coverage_amount: 50000,
        monthly_premium: 156,
        status: "active",
        next_payment: "2025-02-20",
        claims_count: 0
      }
    ];
  },

  async getClaims(walletAddress: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        claim_id: "CLM-001",
        policy_id: "POL-456-001",
        asset_name: "1965 Aston Martin DB5",
        claim_amount: 5000,
        status: "pending",
        submitted_date: "2025-01-15",
        description: "Minor collision damage"
      }
    ];
  }
}