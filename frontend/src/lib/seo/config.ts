// lib/seo/config.ts
export const RWA_INSURANCE_SEO_CONFIG = {
  siteName: 'RWA Insurance Protocol',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://rwa-insurance.com',
  defaultTitle: 'AI-Powered RWA Insurance Protocol - Insure Tokenized Assets on BlockDAG',
  titleTemplate: '%s | RWA Insurance Protocol',
  defaultDescription: 'Revolutionary AI-powered insurance platform for tokenized real-world assets. Insure vehicles, properties, and art with smart contracts, automated claims, and transparent risk assessment on BlockDAG blockchain.',
  defaultImage: '/images/og-rwa-insurance.jpg',
  defaultLocale: 'en-US',
  supportedLocales: ['en-US', 'es-ES', 'fr-FR', 'de-DE'],
  
  social: {
    twitter: '@rwa_insurance',
    discord: 'rwa-insurance',
    telegram: 'rwa_insurance',
    github: 'rwa-insurance',
    linkedin: 'rwa-insurance-protocol',
  },
  
  contact: {
    email: 'support@rwa-insurance.com',
    support: 'https://support.rwa-insurance.com',
  },
  
  organization: {
    name: 'RWA Insurance Protocol',
    url: 'https://rwa-insurance.com',
    logo: '/images/rwa-logo.png',
    description: 'Leading AI-powered insurance platform for tokenized real-world assets',
    foundingDate: '2024',
    address: {
      streetAddress: '123 Blockchain Street',
      addressLocality: 'London',
      addressRegion: 'England',
      postalCode: 'SW1A 1AA',
      addressCountry: 'GB',
    },
  },
  
  app: {
    name: 'RWA Insurance Protocol',
    category: 'Finance',
    operatingSystem: 'Web',
    applicationCategory: 'FinanceApplication',
    offers: {
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  },
  
  keywords: {
    primary: [
      'rwa insurance',
      'tokenized asset insurance',
      'ai insurance',
      'blockchain insurance',
      'defi insurance',
      'smart contract insurance'
    ],
    secondary: [
      'vehicle nft insurance',
      'property token insurance',
      'art collectible insurance',
      'blockdag insurance',
      'automated claims processing',
      'ai risk assessment'
    ],
    tertiary: [
      'real world asset protection',
      'crypto asset insurance',
      'web3 insurance platform',
      'decentralized insurance',
      'parametric insurance',
      'oracle-based claims'
    ],
  },
  
  blockchain: {
    name: 'BlockDAG',
    symbol: 'BDAG',
    chainId: 1043,
    explorer: 'https://primordial.bdagscan.com',
    rpc: 'https://rpc.primordial.bdagscan.com',
  },
};