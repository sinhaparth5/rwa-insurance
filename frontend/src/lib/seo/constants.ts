export const SEO_CONSTANTS = {
  // Page types for tracking
  PAGE_TYPES: {
    HOMEPAGE: 'homepage',
    MARKETING: 'marketing',
    DASHBOARD: 'dashboard',
    BLOG: 'blog',
    DOCUMENTATION: 'documentation',
    ASSET: 'asset',
    FORM: 'form',
  } as const,

  // Content categories
  CONTENT_CATEGORIES: {
    INSURANCE: 'insurance',
    BLOCKCHAIN: 'blockchain',
    AI_ML: 'ai-ml',
    TUTORIAL: 'tutorial',
    NEWS: 'news',
    PRODUCT: 'product',
  } as const,

  // SEO limits
  LIMITS: {
    TITLE: {
      MIN: 30,
      MAX: 60,
      IDEAL: 55,
    },
    DESCRIPTION: {
      MIN: 120,
      MAX: 160,
      IDEAL: 155,
    },
    H1: {
      MAX: 70,
    },
    URL_SLUG: {
      MAX: 75,
    },
  } as const,

  // Core Web Vitals thresholds
  PERFORMANCE_THRESHOLDS: {
    LCP: {
      GOOD: 2500,
      NEEDS_IMPROVEMENT: 4000,
    },
    FID: {
      GOOD: 100,
      NEEDS_IMPROVEMENT: 300,
    },
    CLS: {
      GOOD: 0.1,
      NEEDS_IMPROVEMENT: 0.25,
    },
    TTFB: {
      GOOD: 600,
      NEEDS_IMPROVEMENT: 1000,
    },
  } as const,

  // Social media image sizes
  IMAGE_SIZES: {
    OPEN_GRAPH: {
      WIDTH: 1200,
      HEIGHT: 630,
    },
    TWITTER_CARD: {
      WIDTH: 1200,
      HEIGHT: 600,
    },
    LINKEDIN: {
      WIDTH: 1200,
      HEIGHT: 627,
    },
  } as const,
};