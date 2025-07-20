export interface SEOMetrics {
  pageViews: number;
  uniquePageViews: number;
  averageTimeOnPage: number;
  bounceRate: number;
  exitRate: number;
  pageLoadTime: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
  };
}

export interface SEOAnalysis {
  title: {
    text: string;
    length: number;
    isOptimal: boolean;
    suggestions: string[];
  };
  description: {
    text: string;
    length: number;
    isOptimal: boolean;
    suggestions: string[];
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    issues: string[];
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    oversized: number;
  };
  links: {
    internal: number;
    external: number;
    broken: number;
  };
  structuredData: {
    present: boolean;
    types: string[];
    errors: string[];
  };
  performance: SEOMetrics['coreWebVitals'];
  suggestions: string[];
  score: number; // 0-100
}

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  position?: number;
  clicks?: number;
  impressions?: number;
  ctr?: number;
}

export interface CompetitorAnalysis {
  domain: string;
  title: string;
  description: string;
  keywords: string[];
  backlinks: number;
  domainAuthority: number;
  pageAuthority: number;
}