import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dag.astrareconslab.com';

async function fetchBlogPosts() {
  try {
    // Only fetch if we have a valid base URL and we're not in build time
    if (typeof window !== 'undefined' || !baseUrl.includes('undefined')) {
      const response = await fetch(`${baseUrl}/api/blog/posts`, {
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch blog posts for sitemap');
        return [];
      }
      
      return await response.json();
    }
    return [];
  } catch (error) {
    console.warn('Error fetching blog posts for sitemap:', error);
    return [];
  }
}

async function fetchDocs() {
  try {
    if (typeof window !== 'undefined' || !baseUrl.includes('undefined')) {
      const response = await fetch(`${baseUrl}/api/docs/pages`, {
        next: { revalidate: 3600 }
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch docs for sitemap');
        return [];
      }
      
      return await response.json();
    }
    return [];
  } catch (error) {
    console.warn('Error fetching docs for sitemap:', error);
    return [];
  }
}

async function fetchPublicAssets() {
  try {
    if (typeof window !== 'undefined' || !baseUrl.includes('undefined')) {
      const response = await fetch(`${baseUrl}/api/assets/public`, {
        next: { revalidate: 3600 }
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch public assets for sitemap');
        return [];
      }
      
      return await response.json();
    }
    return [];
  } catch (error) {
    console.warn('Error fetching public assets for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
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
    // Fetch dynamic content with error handling
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
    // Return static pages only if dynamic content fails
    return staticPages;
  }
}