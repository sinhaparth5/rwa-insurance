import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USER_DATA } from '@/data/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();
    
    // Simulate database lookup
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    
    // For demo, return mock data if it matches
    if (walletAddress.toLowerCase() === MOCK_USER_DATA.userProfile.walletAddress.toLowerCase()) {
      return NextResponse.json(MOCK_USER_DATA.userProfile);
    }
    
    // Create new user profile
    const newProfile = {
      walletAddress,
      username: null,
      email: null,
      kycStatus: "pending",
      joinedAt: new Date().toISOString(),
      totalPolicies: 0,
      totalClaims: 0
    };
    
    return NextResponse.json(newProfile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}