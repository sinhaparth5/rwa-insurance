'use client';

import { useEffect, useCallback } from 'react';
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

  // Helper function to determine page type from pathname
  const getPageTypeFromPath = useCallback((path: string): string => {
    if (path === '/') return 'homepage';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/blog')) return 'blog';
    if (path.startsWith('/docs')) return 'documentation';
    if (path.startsWith('/assets')) return 'asset';
    return 'page';
  }, []);

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
  }, [pathname, props.pageType, props.category, props.userType, getPageTypeFromPath, seoAnalytics]);

  return {
    trackSearch: seoAnalytics.trackSiteSearch.bind(seoAnalytics),
    trackOutboundLink: seoAnalytics.trackOutboundLink.bind(seoAnalytics),
    trackDownload: seoAnalytics.trackDownload.bind(seoAnalytics),
    trackFormSubmission: seoAnalytics.trackFormSubmission.bind(seoAnalytics),
  };
}