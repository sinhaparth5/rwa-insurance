import { RWA_INSURANCE_SEO_CONFIG } from './config';

export class StructuredDataGenerator {
  private static instance: StructuredDataGenerator;
  private config = RWA_INSURANCE_SEO_CONFIG;

  static getInstance(): StructuredDataGenerator {
    if (!StructuredDataGenerator.instance) {
      StructuredDataGenerator.instance = new StructuredDataGenerator();
    }
    return StructuredDataGenerator.instance;
  }

  generateWebsiteData(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.config.siteUrl}#website`,
      name: this.config.siteName,
      url: this.config.siteUrl,
      description: this.config.defaultDescription,
      publisher: {
        '@id': `${this.config.siteUrl}#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.config.siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      inLanguage: this.config.supportedLocales,
    };
  }

  generateFAQData(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  generateBreadcrumbData(breadcrumbs: Array<{ name: string; url: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  generateArticleData(article: any): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${this.config.siteUrl}/blog/${article.slug}#article`,
      headline: article.title,
      description: article.excerpt,
      image: {
        '@type': 'ImageObject',
        url: article.featuredImage,
        width: 1200,
        height: 630,
      },
      author: {
        '@type': 'Person',
        name: article.author.name,
        url: article.author.url,
      },
      publisher: {
        '@id': `${this.config.siteUrl}#organization`,
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.config.siteUrl}/blog/${article.slug}`,
      },
      articleSection: article.category?.name,
      keywords: article.tags?.join(', '),
      wordCount: article.wordCount,
      inLanguage: 'en-US',
    };
  }
}
