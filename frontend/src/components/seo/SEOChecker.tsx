'use client';

import { useEffect, useState } from 'react';
import { SEOMonitoring } from '@/lib/seo/monitoring';

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
}

export function SEOChecker() {
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const seoMonitoring = SEOMonitoring.getInstance();
    
    // Check meta tags
    const metaValidation = seoMonitoring.validateMetaTags();
    const metaIssues: SEOIssue[] = metaValidation.issues.map(issue => ({
      type: 'error',
      message: issue,
    }));

    // Check internal links
    const linkCheck = seoMonitoring.checkInternalLinks();
    const linkIssues: SEOIssue[] = linkCheck.issues.map(issue => ({
      type: 'warning',
      message: issue,
    }));

    // Performance check
    seoMonitoring.monitorPagePerformance().then(metrics => {
      const performanceIssues: SEOIssue[] = [];
      
      if (metrics.lcp > 2500) {
        performanceIssues.push({
          type: 'warning',
          message: `Large Contentful Paint is slow: ${metrics.lcp}ms (should be < 2500ms)`,
        });
      }
      
      if (metrics.ttfb > 600) {
        performanceIssues.push({
          type: 'warning',
          message: `Time to First Byte is slow: ${metrics.ttfb}ms (should be < 600ms)`,
        });
      }

      setIssues([...metaIssues, ...linkIssues, ...performanceIssues]);
    });

    // Add info about indexability
    const pathname = window.location.pathname;
    const isIndexable = seoMonitoring.isPageIndexable(pathname);
    if (!isIndexable) {
      setIssues(prev => [...prev, {
        type: 'info',
        message: 'This page is marked as non-indexable (noindex)',
      }]);
    }
  }, []);

  if (process.env.NODE_ENV !== 'development' || issues.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`mb-2 px-3 py-2 rounded-lg text-sm font-medium ${
          issues.some(i => i.type === 'error') 
            ? 'bg-red-600 text-white' 
            : 'bg-yellow-600 text-white'
        }`}
      >
        SEO: {issues.length} issues
      </button>
      
      {isVisible && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-60 overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-2">SEO Issues</h3>
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`text-xs p-2 rounded ${
                  issue.type === 'error' 
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : issue.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                <span className="font-medium capitalize">{issue.type}:</span> {issue.message}
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}