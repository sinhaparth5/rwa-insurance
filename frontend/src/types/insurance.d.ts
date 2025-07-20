export interface RWAAsset {
  tokenId: string;
  assetType: 'vehicle' | 'property' | 'art';
  metadata: {
    name: string;
    description: string;
    image: string;
    vin?: string;
    propertyId?: string;
    artistName?: string;
  };
  owner: string;
  verified: boolean;
  ownershipScore: number;
}

export interface InsurancePolicy {
  id: string;
  assetTokenId: string;
  owner: string;
  coverageAmount: string;
  premium: string;
  duration: number;
  riskScore: number;
  status: 'active' | 'expired' | 'claimed';
  createdAt: string;
  expiredAt: string;
}

export interface Claim {
  id: string;
  policyId: string;
  claimType: 'theft' | 'damage' | 'total_loss';
  amount: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  evidence: string[];
  submittedAt: string;
  processedAt?: string;
}


