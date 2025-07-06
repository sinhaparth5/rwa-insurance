import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USER_DATA } from '@/data/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    
    // Simulate database query
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter assets by owner
    const userAssets = MOCK_USER_DATA.assets.filter(
      asset => asset.owner.toLowerCase() === owner?.toLowerCase()
    );
    
    return NextResponse.json({ assets: userAssets });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}
