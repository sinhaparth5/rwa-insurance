import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USER_DATA } from '@/data/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userPolicies = MOCK_USER_DATA.policies.filter(
      policy => policy.owner.toLowerCase() === owner?.toLowerCase()
    );
    
    return NextResponse.json({ policies: userPolicies });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const policyData = await request.json();
    
    // Simulate AI risk assessment
    const riskScore = Math.floor(Math.random() * 40) + 60; // 60-100
    const premium = Math.floor(policyData.coverageAmount * 0.003); // 0.3% monthly
    
    const newPolicy = {
      id: `POL${Date.now()}`,
      ...policyData,
      riskScore,
      premium: premium.toString(),
      status: "active",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + policyData.duration * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    return NextResponse.json({ policy: newPolicy, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create policy' }, { status: 500 });
  }
}