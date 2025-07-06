'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SEOAnalytics } from '@/lib/seo/analytics';

interface SEOTrackingProps {
  pageType?: string;
  category?: string;
  userType?: 'authenticated' | 'anonymous';
}

export function useSEOTracking(props: SEOTrackingProps = {}) {
  const pathname = usePathname();
  const seoAnalytics = SEOAnalytics.getInstance();

  useEffect(() => {
    // Track page view with SEO metadata
    seoAnalytics.trackPageView(
      window.location.href,
      document.title,
      {
        pageType: props.pageType || getPageTypeFromPath(pathname),
        category: props.category || 'general',
        userType: props.userType || 'anonymous',
      }
    );

    // Initialize scroll tracking
    seoAnalytics.trackScrollDepth();
  }, [pathname, props]);

  // Helper function to determine page type from pathname
  function getPageTypeFromPath(path: string): string {
    if (path === '/') return 'homepage';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/blog')) return 'blog';
    if (path.startsWith('/docs')) return 'documentation';
    if (path.startsWith('/assets')) return 'asset';
    return 'page';
  }

  return {
    trackSearch: seoAnalytics.trackSiteSearch.bind(seoAnalytics),
    trackOutboundLink: seoAnalytics.trackOutboundLink.bind(seoAnalytics),
    trackDownload: seoAnalytics.trackDownload.bind(seoAnalytics),
    trackFormSubmission: seoAnalytics.trackFormSubmission.bind(seoAnalytics),
  };
}