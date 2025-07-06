import { Metadata } from 'next';
import { RWA_INSURANCE_SEO_CONFIG } from './config';

export interface RWASEOProps {
  page: string;
  params?: Record<string, string>;
  data?: Record<string, any>;
  locale?: string;
  user?: {
    id?: string;
    address?: string;
    username?: string;
    isAuthenticated?: boolean;
  };
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile' | 'app';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    nocache?: boolean;
  };
  openGraph?: {
    siteName?: string;
    locale?: string;
    type?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  structuredData?: Record<string, any>;
  canonical?: string;
  noindex?: boolean;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  requiresAuth?: boolean;
}

export class RWAInsuranceSEOGenerator {
  private static instance: RWAInsuranceSEOGenerator;
  private config = RWA_INSURANCE_SEO_CONFIG;

  static getInstance(): RWAInsuranceSEOGenerator {
    if (!RWAInsuranceSEOGenerator.instance) {
      RWAInsuranceSEOGenerator.instance = new RWAInsuranceSEOGenerator();
    }
    return RWAInsuranceSEOGenerator.instance;
  }

  generateMetadata(props: RWASEOProps): Metadata {
    const seoConfig = this.generateSEOConfig(props);
    
    return {
      title: {
        template: this.config.titleTemplate,
        default: seoConfig.title,
      },
      description: seoConfig.description,
      keywords: seoConfig.keywords,
      authors: [{ name: this.config.organization.name }],
      creator: this.config.organization.name,
      publisher: this.config.organization.name,
      applicationName: this.config.app.name,
      category: this.config.app.category,
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      robots: {
        index: seoConfig.robots?.index ?? !seoConfig.requiresAuth,
        follow: seoConfig.robots?.follow ?? !seoConfig.requiresAuth,
        noarchive: seoConfig.robots?.noarchive ?? seoConfig.requiresAuth,
        nosnippet: seoConfig.robots?.nosnippet ?? seoConfig.requiresAuth,
        noimageindex: seoConfig.robots?.noimageindex ?? false,
        nocache: seoConfig.robots?.nocache ?? seoConfig.requiresAuth,
      },
      openGraph: {
        type: seoConfig.type || 'website',
        siteName: this.config.siteName,
        title: seoConfig.title,
        description: seoConfig.description,
        url: seoConfig.url,
        images: seoConfig.openGraph?.images || [
          {
            url: seoConfig.image || this.config.defaultImage,
            width: 1200,
            height: 630,
            alt: seoConfig.title,
          },
        ],
        locale: seoConfig.locale || this.config.defaultLocale,
      },
      twitter: {
        card: seoConfig.twitter?.card || 'summary_large_image',
        site: seoConfig.twitter?.site || this.config.social.twitter,
        creator: seoConfig.twitter?.creator || this.config.social.twitter,
        title: seoConfig.twitter?.title || seoConfig.title,
        description: seoConfig.twitter?.description || seoConfig.description,
        images: seoConfig.twitter?.image || seoConfig.image || this.config.defaultImage,
      },
      alternates: {
        canonical: seoConfig.canonical || seoConfig.url,
        languages: seoConfig.alternateLocales?.reduce((acc, locale) => {
          acc[locale] = `${this.config.siteUrl}/${locale}${seoConfig.url}`;
          return acc;
        }, {} as Record<string, string>),
      },
      other: {
        'og:image:width': '1200',
        'og:image:height': '630',
        'blockchain:network': 'BlockDAG',
        'blockchain:symbol': 'BDAG',
        'blockchain:chainId': '1043',
        'web3:compatible': 'true',
        'insurance:type': 'RWA',
        'ai:powered': 'true',
      },
    };
  }

  private generateSEOConfig(props: RWASEOProps): SEOConfig {
    const { page, params, data, user } = props;
    const baseUrl = this.config.siteUrl;
    const isAuthenticated = user?.isAuthenticated ?? false;

    switch (page) {
      case 'home':
        return this.generateHomePageSEO(baseUrl, data);
      case 'about':
        return this.generateAboutPageSEO(baseUrl, data);
      case 'features':
        return this.generateFeaturesPageSEO(baseUrl, data);
      case 'how-it-works':
        return this.generateHowItWorksPageSEO(baseUrl, data);
      case 'pricing':
        return this.generatePricingPageSEO(baseUrl, data);
      case 'blog':
        return this.generateBlogPageSEO(baseUrl, data);
      case 'blog/[slug]':
        return this.generateBlogPostSEO(baseUrl, params, data);
      case 'docs':
        return this.generateDocsPageSEO(baseUrl, data);
      case 'docs/[...slug]':
        return this.generateDocPageSEO(baseUrl, params, data);
      case 'contact':
        return this.generateContactPageSEO(baseUrl, data);
      case 'privacy':
        return this.generatePrivacyPageSEO(baseUrl, data);
      case 'terms':
        return this.generateTermsPageSEO(baseUrl, data);
      
      // Authentication pages
      case 'login':
        return this.generateLoginPageSEO(baseUrl, data);
      case 'signup':
        return this.generateSignupPageSEO(baseUrl, data);
      
      // Protected pages
      case 'dashboard':
        return this.generateDashboardSEO(baseUrl, data, user, isAuthenticated);
      case 'dashboard/policies':
        return this.generatePoliciesPageSEO(baseUrl, data, user, isAuthenticated);
      case 'dashboard/policies/[id]':
        return this.generatePolicyDetailSEO(baseUrl, params, data, user, isAuthenticated);
      case 'dashboard/claims':
        return this.generateClaimsPageSEO(baseUrl, data, user, isAuthenticated);
      case 'dashboard/claims/[id]':
        return this.generateClaimDetailSEO(baseUrl, params, data, user, isAuthenticated);
      case 'dashboard/assets':
        return this.generateAssetsPageSEO(baseUrl, data, user, isAuthenticated);
      case 'dashboard/assets/[tokenId]':
        return this.generateAssetDetailSEO(baseUrl, params, data, user, isAuthenticated);
      case 'create-policy':
        return this.generateCreatePolicySEO(baseUrl, data, user, isAuthenticated);
      case 'submit-claim':
        return this.generateSubmitClaimSEO(baseUrl, data, user, isAuthenticated);
      
      // Public asset pages
      case 'assets/vehicle/[tokenId]':
        return this.generatePublicVehicleSEO(baseUrl, params, data);
      case 'assets/property/[tokenId]':
        return this.generatePublicPropertySEO(baseUrl, params, data);
      case 'assets/art/[tokenId]':
        return this.generatePublicArtSEO(baseUrl, params, data);
      
      default:
        return this.generateDefaultSEO(baseUrl, page, data, isAuthenticated);
    }
  }

  private generateHomePageSEO(baseUrl: string, data?: Record<string, any>): SEOConfig {
    return {
      title: this.config.defaultTitle,
      description: this.config.defaultDescription,
      url: baseUrl,
      type: 'website',
      keywords: [
        ...this.config.keywords.primary,
        ...this.config.keywords.secondary,
        'tokenized vehicle insurance',
        'nft property insurance',
        'blockchain asset protection'
      ],
      image: `${baseUrl}${this.config.defaultImage}`,
      structuredData: this.generateHomeStructuredData(),
      priority: 1.0,
      changefreq: 'daily',
    };
  }

  private generateAboutPageSEO(baseUrl: string, data?: Record<string, any>): SEOConfig {
    return {
      title: 'About RWA Insurance Protocol - AI-Powered Asset Protection',
      description: 'Learn about our mission to revolutionize insurance for tokenized real-world assets using AI risk assessment, smart contracts, and blockchain technology on BlockDAG.',
      url: `${baseUrl}/about`,
      type: 'website',
      keywords: [
        'about rwa insurance',
        'ai insurance company',
        'blockchain insurance team',
        'tokenized asset protection',
        'smart contract insurance'
      ],
      image: `${baseUrl}/images/about-og.jpg`,
      structuredData: this.generateAboutStructuredData(),
      priority: 0.8,
      changefreq: 'monthly',
    };
  }

  private generateFeaturesPageSEO(baseUrl: string, data?: Record<string, any>): SEOConfig {
    return {
      title: 'Features - AI Risk Assessment & Smart Contract Insurance',
      description: 'Discover powerful features: AI-driven risk scoring, automated claims processing, real-time asset monitoring, multi-chain support, and transparent blockchain insurance on BlockDAG.',
      url: `${baseUrl}/features`,
      type: 'website',
      keywords: [
        'ai risk assessment',
        'automated claims processing',
        'smart contract insurance',
        'blockchain asset monitoring',
        'tokenized asset features'
      ],
      image: `${baseUrl}/images/features-og.jpg`,
      structuredData: this.generateFeaturesStructuredData(),
      priority: 0.9,
      changefreq: 'weekly',
    };
  }

  private generatePricingPageSEO(baseUrl: string, data?: Record<string, any>): SEOConfig {
    return {
      title: 'Pricing - Transparent Insurance Rates for Tokenized Assets',
      description: 'Competitive pricing for RWA insurance. AI-calculated premiums, flexible coverage options, and transparent fee structure. Start with basic protection or choose comprehensive coverage.',
      url: `${baseUrl}/pricing`,
      type: 'website',
      keywords: [
        'rwa insurance pricing',
        'tokenized asset insurance cost',
        'ai insurance premiums',
        'blockchain insurance rates'
      ],
      image: `${baseUrl}/images/pricing-og.jpg`,
      structuredData: this.generatePricingStructuredData(data?.plans),
      priority: 0.8,
      changefreq: 'monthly',
    };
  }

  private generateDashboardSEO(baseUrl: string, data?: Record<string, any>, user?: any, isAuthenticated?: boolean): SEOConfig {
    const baseTitle = isAuthenticated && user?.username 
      ? `${user.username}'s Insurance Dashboard` 
      : 'Insurance Dashboard';

    return {
      title: baseTitle,
      description: 'Manage your tokenized asset insurance policies, view claims status, monitor coverage, and track premiums in your personal dashboard.',
      url: `${baseUrl}/dashboard`,
      type: 'app',
      keywords: ['insurance dashboard', 'policy management', 'claims tracking'],
      priority: 0.5,
      changefreq: 'always',
      requiresAuth: true,
      robots: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
      },
    };
  }

  private generateCreatePolicySEO(baseUrl: string, data?: Record<string, any>, user?: any, isAuthenticated?: boolean): SEOConfig {
    return {
      title: 'Create Insurance Policy - AI-Powered Risk Assessment',
      description: 'Create a new insurance policy for your tokenized assets. Get instant AI risk assessment, competitive premiums, and comprehensive coverage options.',
      url: `${baseUrl}/create-policy`,
      type: 'app',
      keywords: ['create insurance policy', 'ai risk assessment', 'tokenized asset insurance'],
      priority: 0.7,
      changefreq: 'monthly',
      requiresAuth: true,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  private generatePublicVehicleSEO(baseUrl: string, params?: Record<string, string>, data?: Record<string, any>): SEOConfig {
    const vehicle = data?.vehicle;
    const tokenId = params?.tokenId;

    return {
      title: vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.year} - Tokenized Vehicle Insurance` : 'Tokenized Vehicle Insurance',
      description: vehicle 
        ? `Insure your tokenized ${vehicle.make} ${vehicle.model} ${vehicle.year}. AI risk assessment, competitive premiums, and comprehensive coverage for classic and modern vehicles.`
        : 'Comprehensive insurance coverage for tokenized vehicles. AI-powered risk assessment and smart contract protection.',
      url: `${baseUrl}/assets/vehicle/${tokenId}`,
      type: 'product',
      keywords: [
        'tokenized vehicle insurance',
        vehicle?.make?.toLowerCase(),
        vehicle?.model?.toLowerCase(),
        'nft car insurance',
        'blockchain vehicle protection'
      ].filter(Boolean),
      image: vehicle?.image || `${baseUrl}/images/vehicle-default-og.jpg`,
      structuredData: this.generateVehicleStructuredData(vehicle),
      priority: 0.6,
      changefreq: 'weekly',
    };
  }

  private generateDefaultSEO(baseUrl: string, page: string, data?: Record<string, any>, isAuthenticated?: boolean): SEOConfig {
    const pageTitle = page.split('/').pop()?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Page';
    
    return {
      title: `${pageTitle} - RWA Insurance Protocol`,
      description: `${pageTitle} on RWA Insurance Protocol platform.`,
      url: `${baseUrl}/${page}`,
      type: 'website',
      keywords: this.config.keywords.primary,
      requiresAuth: isAuthenticated,
      robots: {
        index: !isAuthenticated,
        follow: !isAuthenticated,
        noarchive: isAuthenticated,
        nosnippet: isAuthenticated,
      },
      priority: 0.5,
      changefreq: 'weekly',
    };
  }

  // Structured data generators
  private generateHomeStructuredData(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: this.config.app.name,
      description: this.config.defaultDescription,
      url: this.config.siteUrl,
      applicationCategory: this.config.app.applicationCategory,
      operatingSystem: this.config.app.operatingSystem,
      offers: {
        '@type': 'Offer',
        price: this.config.app.offers.price,
        priceCurrency: this.config.app.offers.priceCurrency,
        availability: this.config.app.offers.availability,
      },
      publisher: {
        '@type': 'Organization',
        name: this.config.organization.name,
        url: this.config.organization.url,
        logo: {
          '@type': 'ImageObject',
          url: `${this.config.siteUrl}${this.config.organization.logo}`,
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: this.config.organization.address.streetAddress,
          addressLocality: this.config.organization.address.addressLocality,
          addressRegion: this.config.organization.address.addressRegion,
          postalCode: this.config.organization.address.postalCode,
          addressCountry: this.config.organization.address.addressCountry,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: this.config.contact.email,
          contactType: 'customer service',
        },
      },
      featureList: [
        'AI-Powered Risk Assessment',
        'Smart Contract Insurance',
        'Automated Claims Processing',
        'Multi-Chain Asset Support',
        'Real-time Monitoring',
        'Transparent Pricing',
      ],
      browserRequirements: 'Requires JavaScript, Web3 wallet',
      applicationSubCategory: 'Insurance Technology',
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Blockchain',
          value: 'BlockDAG',
        },
        {
          '@type': 'PropertyValue',
          name: 'Insurance Type',
          value: 'Real World Assets',
        },
        {
          '@type': 'PropertyValue',
          name: 'AI Powered',
          value: 'Yes',
        },
      ],
    };
  }

  private generateAboutStructuredData(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${this.config.siteUrl}#organization`,
      name: this.config.organization.name,
      url: this.config.organization.url,
      logo: {
        '@type': 'ImageObject',
        url: `${this.config.siteUrl}${this.config.organization.logo}`,
        width: 300,
        height: 300,
      },
      description: this.config.organization.description,
      foundingDate: this.config.organization.foundingDate,
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.config.organization.address.streetAddress,
        addressLocality: this.config.organization.address.addressLocality,
        addressRegion: this.config.organization.address.addressRegion,
        postalCode: this.config.organization.address.postalCode,
        addressCountry: this.config.organization.address.addressCountry,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: this.config.contact.email,
        contactType: 'customer service',
        availableLanguage: this.config.supportedLocales,
      },
      sameAs: [
        `https://twitter.com/${this.config.social.twitter.replace('@', '')}`,
        `https://github.com/${this.config.social.github}`,
        `https://linkedin.com/company/${this.config.social.linkedin}`,
        `https://discord.gg/${this.config.social.discord}`,
        `https://t.me/${this.config.social.telegram}`,
      ],
      industry: 'Insurance Technology',
      serviceArea: {
        '@type': 'Place',
        name: 'Global',
      },
      makesOffer: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'RWA Insurance Services',
          serviceType: 'Insurance',
        },
      },
    };
  }

  private generateFeaturesStructuredData(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'RWA Insurance Features',
      description: 'Comprehensive features for tokenized asset insurance',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Service',
            name: 'AI Risk Assessment',
            description: 'Advanced artificial intelligence analyzes multiple data points to calculate accurate risk scores and premium rates.',
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Service',
            name: 'Smart Contract Automation',
            description: 'Blockchain-based smart contracts automate policy creation, premium payments, and claims processing.',
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Service',
            name: 'Multi-Asset Support',
            description: 'Comprehensive coverage for vehicles, real estate, art, and other tokenized real-world assets.',
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'Service',
            name: 'Automated Claims',
            description: 'Oracle-verified claims processing with automatic payouts for qualifying incidents.',
          },
        },
      ],
    };
  }

  private generateVehicleStructuredData(vehicle?: any): Record<string, any> {
    if (!vehicle) return {};

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${this.config.siteUrl}/assets/vehicle/${vehicle.tokenId}#vehicle`,
      name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      description: vehicle.description,
      image: vehicle.image,
      category: 'Vehicle',
      brand: {
        '@type': 'Brand',
        name: vehicle.make,
      },
      model: vehicle.model,
      vehicleModelDate: vehicle.year,
      identifier: [
        {
          '@type': 'PropertyValue',
          name: 'VIN',
          value: vehicle.vin,
        },
        {
          '@type': 'PropertyValue',
          name: 'Token ID',
          value: vehicle.tokenId,
        },
        {
          '@type': 'PropertyValue',
          name: 'Blockchain',
          value: 'BlockDAG',
        },
      ],
      offers: {
        '@type': 'Offer',
        description: 'Insurance Coverage Available',
        businessFunction: 'http://purl.org/goodrelations/v1#ProvideService',
        seller: {
          '@type': 'Organization',
          name: this.config.organization.name,
        },
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Fuel Type',
          value: vehicle.fuelType,
        },
        {
          '@type': 'PropertyValue',
          name: 'Engine Size',
          value: vehicle.engineSize,
        },
        {
          '@type': 'PropertyValue',
          name: 'Color',
          value: vehicle.color,
        },
      ],
    };
  }

  private generatePricingStructuredData(plans?: any[]): Record<string, any> {
    if (!plans || plans.length === 0) return {};

    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'RWA Insurance Pricing',
      description: 'Flexible pricing plans for tokenized asset insurance',
      provider: {
        '@type': 'Organization',
        name: this.config.organization.name,
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Insurance Plans',
        itemListElement: plans.map((plan, index) => ({
          '@type': 'Offer',
          position: index + 1,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          priceCurrency: plan.currency || 'USD',
          eligibleQuantity: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            unitText: 'Policy',
          },
          businessFunction: 'http://purl.org/goodrelations/v1#ProvideService',
        })),
      },
    };
  }
}
