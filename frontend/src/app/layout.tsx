import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from '@/context'
import { RWA_INSURANCE_SEO_CONFIG } from "@/lib/seo/config";
import { StructuredData } from "@/components/seo/StructuredData";
import { StructuredDataGenerator } from "@/lib/seo/structured-data";
import { Analytics } from "@/components/seo/Analytics";
import { WebVitals } from "@/components/seo/WebVitals";
import { Provider } from "@/components/ui/provider";

const plus_jakarta_sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#ffffff' }, // Force white even for dark preference
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(RWA_INSURANCE_SEO_CONFIG.siteUrl),
  title: {
    default: RWA_INSURANCE_SEO_CONFIG.defaultTitle,
    template: RWA_INSURANCE_SEO_CONFIG.titleTemplate,
  },
  description: RWA_INSURANCE_SEO_CONFIG.defaultDescription,
  keywords: [
    ...RWA_INSURANCE_SEO_CONFIG.keywords.primary,
    ...RWA_INSURANCE_SEO_CONFIG.keywords.secondary,
  ],
  authors: [{ name: RWA_INSURANCE_SEO_CONFIG.organization.name }],
  creator: RWA_INSURANCE_SEO_CONFIG.organization.name,
  publisher: RWA_INSURANCE_SEO_CONFIG.organization.name,
  applicationName: RWA_INSURANCE_SEO_CONFIG.app.name,
  category: RWA_INSURANCE_SEO_CONFIG.app.category,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: RWA_INSURANCE_SEO_CONFIG.defaultLocale,
    url: RWA_INSURANCE_SEO_CONFIG.siteUrl,
    siteName: RWA_INSURANCE_SEO_CONFIG.siteName,
    title: RWA_INSURANCE_SEO_CONFIG.defaultTitle,
    description: RWA_INSURANCE_SEO_CONFIG.defaultDescription,
    images: [
      {
        url: RWA_INSURANCE_SEO_CONFIG.defaultImage,
        width: 1200,
        height: 630,
        alt: RWA_INSURANCE_SEO_CONFIG.defaultTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: RWA_INSURANCE_SEO_CONFIG.social.twitter,
    creator: RWA_INSURANCE_SEO_CONFIG.social.twitter,
    title: RWA_INSURANCE_SEO_CONFIG.defaultTitle,
    description: RWA_INSURANCE_SEO_CONFIG.defaultDescription,
    images: [RWA_INSURANCE_SEO_CONFIG.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
  alternates: {
    canonical: RWA_INSURANCE_SEO_CONFIG.siteUrl,
    languages: RWA_INSURANCE_SEO_CONFIG.supportedLocales.reduce((acc, locale) => {
      acc[locale] = `${RWA_INSURANCE_SEO_CONFIG.siteUrl}/${locale}`;
      return acc;
    }, {} as Record<string, string>),
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': RWA_INSURANCE_SEO_CONFIG.app.name,
    'application-name': RWA_INSURANCE_SEO_CONFIG.app.name,
    'msapplication-TileColor': '#ffffff', // White instead of black
    'theme-color': '#ffffff', // White instead of black
    'blockchain:network': 'BlockDAG',
    'blockchain:symbol': 'BDAG',
    'blockchain:chainId': '1043',
    'web3:compatible': 'true',
    'insurance:type': 'RWA',
    'ai:powered': 'true',
    // Add Bing verification if available
    ...(process.env.BING_VERIFICATION && {
      'msvalidate.01': process.env.BING_VERIFICATION,
    }),
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get('cookie')
  const structuredDataGenerator = StructuredDataGenerator.getInstance();
  
  const organizationData = structuredDataGenerator.generateWebsiteData();
  const websiteData = structuredDataGenerator.generateWebsiteData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData 
          data={[organizationData, websiteData]} 
          id="global-structured-data" 
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//primordial.bdagscan.com" />
        <link rel="dns-prefetch" href="//rpc.primordial.bdagscan.com" />
        {/* Add Bing verification meta tag manually if needed */}
        {process.env.BING_VERIFICATION && (
          <meta name="msvalidate.01" content={process.env.BING_VERIFICATION} />
        )}
      </head>
      <body className={plus_jakarta_sans.className}>
        <Provider>
          <ContextProvider cookies={cookies}>
            {children}
          </ContextProvider>
          <Analytics />
          <WebVitals />
        </Provider>
      </body>
    </html>
  );
}