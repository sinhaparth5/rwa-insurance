import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'RWA Insurance Protocol';
    const description = searchParams.get('description') || 'AI-Powered Insurance for Tokenized Assets';
    const type = searchParams.get('type') || 'homepage';

    // In a real implementation, you'd generate an image here
    // For now, we'll redirect to a static image
    const ogImagePath = getOGImageForType(type);
    
    return NextResponse.redirect(new URL(ogImagePath, request.url));
  } catch (error) {
    console.error('Error generating OG image:', error);
    return NextResponse.redirect(new URL('/images/og-default.jpg', request.url));
  }
}

function getOGImageForType(type: string): string {
  switch (type) {
    case 'blog':
      return '/images/og-blog.jpg';
    case 'asset':
      return '/images/og-asset.jpg';
    case 'feature':
      return '/images/og-features.jpg';
    default:
      return '/images/og-default.jpg';
  }
}