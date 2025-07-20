import { RWAInsuranceSEOGenerator, RWASEOProps } from '@/lib/seo/generators';

export function generateRWAMetadata(props: RWASEOProps) {
  const seoGenerator = RWAInsuranceSEOGenerator.getInstance();
  return seoGenerator.generateMetadata(props);
}

// Utility function to generate Open Graph images
export function generateOGImageUrl(options: {
  title: string;
  description?: string;
  type?: 'homepage' | 'blog' | 'asset' | 'feature';
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rwa-insurance.com';
  const params = new URLSearchParams({
    title: options.title,
    ...(options.description && { description: options.description }),
    type: options.type || 'homepage',
  });
  
  return `${baseUrl}/api/og?${params.toString()}`;
}

// Utility function to validate meta tags
export function validateMetaTags(title: string, description: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Title validation
  if (!title) {
    issues.push('Title is required');
  } else if (title.length < 30) {
    issues.push('Title should be at least 30 characters');
  } else if (title.length > 60) {
    issues.push('Title should not exceed 60 characters');
  }

  // Description validation
  if (!description) {
    issues.push('Description is required');
  } else if (description.length < 120) {
    issues.push('Description should be at least 120 characters');
  } else if (description.length > 160) {
    issues.push('Description should not exceed 160 characters');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}