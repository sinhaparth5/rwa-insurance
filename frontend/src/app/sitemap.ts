import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dag.astrareconslab.com';

// Safe fetch function that handles build-time errors
async function safeFetch(url: string, fallback: any[] = []) {
  // Skip API calls during build if no server is running
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'production') {
    return fallback;
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`);
      return fallback;
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`Error fetching ${url}:`, error);
    return fallback;
  }
}

async function fetchBlogPosts() {
  // Return static blog examples if API isn't available
  const fallbackPosts = [
    {
      slug: 'introducing-rwa-insurance',
      publishedAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    {
      slug: 'how-blockchain-transforms-insurance', 
      publishedAt: '2025-01-10',
      updatedAt: '2025-01-10'
    },
    {
      slug: 'nft-vehicle-insurance-guide',
      publishedAt: '2025-01-15',
      updatedAt: '2025-01-15'
    }
  ];

  return await safeFetch(`${baseUrl}/api/blog/posts`, fallbackPosts);
}

async function fetchDocs() {
  // Return static doc examples if API isn't available
  const fallbackDocs = [
    {
      slug: 'getting-started',
      updatedAt: '2025-01-01'
    },
    {
      slug: 'api-reference',
      updatedAt: '2025-01-01'
    },
    {
      slug: 'smart-contracts',
      updatedAt: '2025-01-01'
    },
    {
      slug: 'integration-guide',
      updatedAt: '2025-01-01'
    }
  ];

  return await safeFetch(`${baseUrl}/api/docs/pages`, fallbackDocs);
}

async function fetchPublicAssets() {
  // Return static asset examples if API isn't available
  const fallbackAssets = [
    {
      type: 'vehicle',
      tokenId: '456',
      updatedAt: '2025-01-01'
    },
    {
      type: 'property',
      tokenId: '789', 
      updatedAt: '2025-01-01'
    }
  ];

  return await safeFetch(`${baseUrl}/api/assets/public`, fallbackAssets);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static pages for RWA Insurance Platform
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/create-policy`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Fetch dynamic content with graceful fallbacks
    const [blogPosts, docs, publicAssets] = await Promise.allSettled([
      fetchBlogPosts(),
      fetchDocs(), 
      fetchPublicAssets(),
    ]);

    // Process blog posts
    const blogPages: MetadataRoute.Sitemap = [];
    if (blogPosts.status === 'fulfilled' && Array.isArray(blogPosts.value)) {
      blogPages.push(
        ...blogPosts.value.map((post: any) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updatedAt || post.publishedAt || currentDate,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
      );
    }

    // Process docs
    const docPages: MetadataRoute.Sitemap = [];
    if (docs.status === 'fulfilled' && Array.isArray(docs.value)) {
      docPages.push(
        ...docs.value.map((doc: any) => ({
          url: `${baseUrl}/docs/${doc.slug}`,
          lastModified: doc.updatedAt || currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      );
    }

    // Process public assets
    const assetPages: MetadataRoute.Sitemap = [];
    if (publicAssets.status === 'fulfilled' && Array.isArray(publicAssets.value)) {
      assetPages.push(
        ...publicAssets.value.map((asset: any) => ({
          url: `${baseUrl}/assets/${asset.type}/${asset.tokenId}`,
          lastModified: asset.updatedAt || currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        }))
      );
    }

    return [...staticPages, ...blogPages, ...docPages, ...assetPages];
  } catch (error) {
    console.warn('Error generating sitemap:', error);
    // Always return static pages if everything fails
    return staticPages;
  }
}