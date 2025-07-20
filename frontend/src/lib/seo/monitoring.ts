export class SEOMonitoring {
  private static instance: SEOMonitoring;

  static getInstance(): SEOMonitoring {
    if (!SEOMonitoring.instance) {
      SEOMonitoring.instance = new SEOMonitoring();
    }
    return SEOMonitoring.instance;
  }

  // Check if page should be indexed
  isPageIndexable(pathname: string): boolean {
    const nonIndexablePaths = [
      '/dashboard',
      '/create-policy',
      '/submit-claim',
      '/api',
      '/admin',
      '/user',
      '/settings',
      '/wallet',
      '/private',
      '/internal',
      '/tmp',
    ];

    return !nonIndexablePaths.some(path => pathname.startsWith(path));
  }

  // Validate meta tags
  validateMetaTags(): { isValid: boolean; issues: string[] } {
    if (typeof document === 'undefined') {
      return { isValid: false, issues: ['Not in browser environment'] };
    }

    const issues: string[] = [];

    // Check title
    const title = document.querySelector('title')?.textContent;
    if (!title) {
      issues.push('Missing title tag');
    } else if (title.length < 30 || title.length > 60) {
      issues.push(`Title length (${title.length}) should be 30-60 characters`);
    }

    // Check meta description
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (!description) {
      issues.push('Missing meta description');
    } else if (description.length < 120 || description.length > 160) {
      issues.push(`Description length (${description.length}) should be 120-160 characters`);
    }

    // Check canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      issues.push('Missing canonical URL');
    }

    // Check Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    if (!ogTitle) issues.push('Missing og:title');
    if (!ogDescription) issues.push('Missing og:description');
    if (!ogImage) issues.push('Missing og:image');

    // Check structured data
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (!structuredData) {
      issues.push('Missing structured data');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  // Check for duplicate content
  async checkDuplicateContent(content: string, url: string): Promise<boolean> {
    try {
      // In a real implementation, you'd check against your database
      // or use a service to detect duplicate content
      const contentHash = await this.generateContentHash(content);
      
      // Store/check against database of content hashes
      // This is a simplified version
      return false; // Assume no duplicates for now
    } catch (error) {
      console.error('Error checking duplicate content:', error);
      return false;
    }
  }

  // Generate content hash for duplicate detection
  private async generateContentHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Monitor page performance for SEO
  async monitorPagePerformance(): Promise<PerformanceMetrics> {
    if (typeof window === 'undefined') {
      return { lcp: 0, fid: 0, cls: 0, ttfb: 0 };
    }

    return new Promise((resolve) => {
      const metrics: PerformanceMetrics = { lcp: 0, fid: 0, cls: 0, ttfb: 0 };
      
      // Measure TTFB (Time to First Byte)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      }

      setTimeout(() => resolve(metrics), 1000);
    });
  }

  // Check internal links for SEO health
  checkInternalLinks(): { total: number; broken: number; issues: string[] } {
    if (typeof document === 'undefined') {
      return { total: 0, broken: 0, issues: [] };
    }

    const links = Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[];
    const internalLinks = links.filter(link => 
      link.href.startsWith(window.location.origin) || 
      link.href.startsWith('/')
    );

    const issues: string[] = [];
    
    internalLinks.forEach(link => {
      // Check for common issues
      if (!link.textContent?.trim()) {
        issues.push(`Empty link text: ${link.href}`);
      }
      
      if (link.href.includes('#') && !document.querySelector(link.hash)) {
        issues.push(`Broken anchor link: ${link.href}`);
      }
    });

    return {
      total: internalLinks.length,
      broken: 0, // Would need to actually test each link
      issues,
    };
  }
}

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}