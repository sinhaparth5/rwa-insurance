export interface UserSession {
  address: string;
  isConnected: boolean;
  hasProfile: boolean;
  profileData?: {
    username?: string;
    email?: string;
    kycStatus: 'pending' | 'verified' | 'rejected';
    insurancePolicies: string[];
  }
}
