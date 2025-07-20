'use client';

export class SEOAnalytics {
  private static instance: SEOAnalytics;

  static getInstance(): SEOAnalytics {
    if (!SEOAnalytics.instance) {
      SEOAnalytics.instance = new SEOAnalytics();
    }
    return SEOAnalytics.instance;
  }

  // Track page views with SEO-specific data
  trackPageView(url: string, title: string, metadata?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title: title,
        page_location: url,
        custom_map: {
          custom_dimension_1: 'page_type',
          custom_dimension_2: 'user_type',
          custom_dimension_3: 'content_category',
        },
      });

      // Track custom dimensions for SEO analysis
      (window as any).gtag('event', 'page_view', {
        page_type: metadata?.pageType || 'unknown',
        user_type: metadata?.userType || 'anonymous',
        content_category: metadata?.category || 'general',
      });
    }
  }

  // Track search queries on your site
  trackSiteSearch(query: string, results: number, category?: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: query,
        search_results: results,
        search_category: category || 'general',
      });
    }
  }

  // Track outbound links for SEO analysis
  trackOutboundLink(url: string, linkText?: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'outbound',
        event_label: url,
        value: linkText,
      });
    }
  }

  // Track file downloads
  trackDownload(fileName: string, fileType: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'file_download', {
        event_category: 'engagement',
        event_label: fileName,
        file_extension: fileType,
      });
    }
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        event_category: 'engagement',
        event_label: formName,
        value: success ? 1 : 0,
      });
    }
  }

  // Track Core Web Vitals for SEO
  trackWebVitals(metric: any) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });

      // Track performance scores for SEO ranking factors
      if (metric.name === 'LCP' && metric.value > 2500) {
        (window as any).gtag('event', 'poor_lcp', {
          event_category: 'Performance',
          value: Math.round(metric.value),
        });
      }
    }
  }

  // Track scroll depth for content optimization
  trackScrollDepth() {
    if (typeof window === 'undefined') return;

    let maxScroll = 0;
    const trackingPoints = [25, 50, 75, 90, 100];
    const tracked = new Set();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrollPercent);

      trackingPoints.forEach(point => {
        if (scrollPercent >= point && !tracked.has(point)) {
          tracked.add(point);
          if ((window as any).gtag) {
            (window as any).gtag('event', 'scroll', {
              event_category: 'engagement',
              event_label: `${point}%`,
              value: point,
            });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Track max scroll on page unload
    window.addEventListener('beforeunload', () => {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'max_scroll', {
          event_category: 'engagement',
          value: maxScroll,
        });
      }
    });
  }
}