import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USER_DATA } from '@/data/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find user's policies first, then their claims
    const userPolicyIds = MOCK_USER_DATA.policies
      .filter(policy => policy.owner.toLowerCase() === owner?.toLowerCase())
      .map(policy => policy.id);
    
    const userClaims = MOCK_USER_DATA.claims.filter(
      claim => userPolicyIds.includes(claim.policyId)
    );
    
    return NextResponse.json({ claims: userClaims });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}