import { MetadataRoute } from 'next';
import { RWA_INSURANCE_SEO_CONFIG } from '@/lib/seo/config';

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = RWA_INSURANCE_SEO_CONFIG.siteUrl;
  const now = new Date();
  
  // Static marketing pages with high SEO priority
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch dynamic content for sitemap
  const [blogPosts, docPages, publicAssets] = await Promise.all([
    getBlogPosts(),
    getDocumentationPages(),
    getPublicAssets(),
  ]);

  // Blog post pages
  const blogPages: SitemapEntry[] = blogPosts.map((post: { slug: any; updatedAt: string | number | Date; }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Documentation pages
  const documentationPages: SitemapEntry[] = docPages.map((page: { slug: any; updatedAt: string | number | Date; }) => ({
    url: `${baseUrl}/docs/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Public asset pages (vehicles, properties, art)
  const assetPages: SitemapEntry[] = publicAssets.map((asset: { type: any; tokenId: any; updatedAt: string | number | Date; }) => ({
    url: `${baseUrl}/assets/${asset.type}/${asset.tokenId}`,
    lastModified: new Date(asset.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Multi-language support
  const multiLanguagePages: SitemapEntry[] = [];
  if (RWA_INSURANCE_SEO_CONFIG.supportedLocales.length > 1) {
    RWA_INSURANCE_SEO_CONFIG.supportedLocales.forEach(locale => {
      if (locale !== RWA_INSURANCE_SEO_CONFIG.defaultLocale) {
        staticPages.forEach(page => {
          multiLanguagePages.push({
            ...page,
            url: page.url.replace(baseUrl, `${baseUrl}/${locale}`),
          });
        });
      }
    });
  }

  return [...staticPages, ...blogPages, ...documentationPages, ...assetPages, ...multiLanguagePages];
}

// Helper functions for fetching dynamic sitemap data
async function getBlogPosts() {
  try {
    const response = await fetch(`${process.env.INTERNAL_API_URL}/api/blog/posts`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
}

async function getDocumentationPages() {
  try {
    const response = await fetch(`${process.env.INTERNAL_API_URL}/api/docs/pages`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.pages || [];
  } catch (error) {
    console.error('Error fetching docs for sitemap:', error);
    return [];
  }
}

async function getPublicAssets() {
  try {
    const response = await fetch(`${process.env.INTERNAL_API_URL}/api/assets/public`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.assets || [];
  } catch (error) {
    console.error('Error fetching public assets for sitemap:', error);
    return [];
  }
}
