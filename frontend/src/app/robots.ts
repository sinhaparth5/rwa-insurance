import { MetadataRoute } from 'next';
import { RWA_INSURANCE_SEO_CONFIG } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = RWA_INSURANCE_SEO_CONFIG.siteUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/features',
          '/how-it-works',
          '/pricing',
          '/blog/',
          '/docs/',
          '/contact',
          '/assets/',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard/',
          '/create-policy',
          '/submit-claim',
          '/api/',
          '/admin/',
          '/_next/',
          '/static/',
          '*.json',
          '/user/',
          '/settings/',
          '/wallet/',
          '/private/',
          '/internal/',
          '/tmp/',
          '/*?*', // Block URLs with query parameters for cleaner indexing
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
      {
        userAgent: 'Claude-Web',
        disallow: ['/'],
      },
      {
        userAgent: 'Baiduspider',
        disallow: ['/'],
      },
      {
        userAgent: 'YandexBot',
        allow: ['/'],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}