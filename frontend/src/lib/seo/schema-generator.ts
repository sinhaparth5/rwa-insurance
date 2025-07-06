import { RWA_INSURANCE_SEO_CONFIG } from './config';

export class SchemaGenerator {
  private static instance: SchemaGenerator;
  private config = RWA_INSURANCE_SEO_CONFIG;

  static getInstance(): SchemaGenerator {
    if (!SchemaGenerator.instance) {
      SchemaGenerator.instance = new SchemaGenerator();
    }
    return SchemaGenerator.instance;
  }

  // Generate FAQ schema
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
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

  // Generate How-To schema
  generateHowToSchema(howTo: {
    name: string;
    description: string;
    image?: string;
    totalTime?: string;
    steps: Array<{ name: string; text: string; image?: string }>;
    supplies?: string[];
    tools?: string[];
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howTo.name,
      description: howTo.description,
      image: howTo.image,
      totalTime: howTo.totalTime,
      supply: howTo.supplies?.map(supply => ({
        '@type': 'HowToSupply',
        name: supply,
      })),
      tool: howTo.tools?.map(tool => ({
        '@type': 'HowToTool',
        name: tool,
      })),
      step: howTo.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        image: step.image,
      })),
    };
  }

  // Generate Product schema
  generateProductSchema(product: {
    name: string;
    description: string;
    image: string;
    brand: string;
    offers: {
      price: number;
      currency: string;
      availability: string;
    };
    aggregateRating?: {
      ratingValue: number;
      ratingCount: number;
    };
    review?: Array<{
      author: string;
      datePublished: string;
      reviewBody: string;
      reviewRating: number;
    }>;
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        price: product.offers.price,
        priceCurrency: product.offers.currency,
        availability: product.offers.availability,
      },
      ...(product.aggregateRating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.aggregateRating.ratingValue,
          ratingCount: product.aggregateRating.ratingCount,
        },
      }),
      ...(product.review && {
        review: product.review.map(review => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: review.author,
          },
          datePublished: review.datePublished,
          reviewBody: review.reviewBody,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.reviewRating,
          },
        })),
      }),
    };
  }

  // Generate Course schema (for educational content)
  generateCourseSchema(course: {
    name: string;
    description: string;
    provider: string;
    url: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    instructor?: string;
    audience?: string;
    educationalLevel?: string;
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.name,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: course.provider,
      },
      url: course.url,
      image: course.image,
      datePublished: course.datePublished,
      dateModified: course.dateModified,
      instructor: course.instructor ? {
        '@type': 'Person',
        name: course.instructor,
      } : undefined,
      audience: course.audience ? {
        '@type': 'Audience',
        audienceType: course.audience,
      } : undefined,
      educationalLevel: course.educationalLevel,
    };
  }

  // Generate Software Application schema
  generateSoftwareApplicationSchema(app: {
    name: string;
    description: string;
    url: string;
    applicationCategory: string;
    operatingSystem: string;
    offers?: {
      price: number;
      currency: string;
    };
    aggregateRating?: {
      ratingValue: number;
      ratingCount: number;
    };
    screenshots?: string[];
    softwareVersion?: string;
  }): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: app.name,
      description: app.description,
      url: app.url,
      applicationCategory: app.applicationCategory,
      operatingSystem: app.operatingSystem,
      ...(app.offers && {
        offers: {
          '@type': 'Offer',
          price: app.offers.price,
          priceCurrency: app.offers.currency,
        },
      }),
      ...(app.aggregateRating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: app.aggregateRating.ratingValue,
          ratingCount: app.aggregateRating.ratingCount,
        },
      }),
      screenshot: app.screenshots,
      softwareVersion: app.softwareVersion,
    };
  }
}
