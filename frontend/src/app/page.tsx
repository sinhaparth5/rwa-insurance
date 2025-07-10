import { Metadata } from 'next';
import { Box } from '@chakra-ui/react';
import { generateRWAMetadata } from '@/utils/seo';
import { StructuredData } from '@/components/seo/StructuredData';
import { StructuredDataGenerator } from '@/lib/seo/structured-data';
import Navbar from '@/components/Navbar';
import { HeroSection } from '@/components/Sections/HeroSection';
import { FeaturesSection } from '@/components/Sections/FeaturesSection';
import { AISection } from '@/components/Sections/AISection';
import { ChatbotSection } from '@/components/Sections/ChatbotSection';
import { TrustSecuritySection } from '@/components/Sections/TrustSecuritySection';
import { CTASection } from '@/components/Sections/CTASection';

export async function generateMetadata(): Promise<Metadata> {
  return generateRWAMetadata({
    page: 'home',
    data: {
      keywords: [
        'rwa insurance protocol',
        'ai powered insurance',
        'tokenized asset protection',
        'blockchain insurance platform',
        'smart contract insurance'
      ],
    },
  });
}

export default function HomePage() {
  const structuredDataGenerator = StructuredDataGenerator.getInstance();
  
  const faqData = structuredDataGenerator.generateFAQData([
    {
      question: 'What is RWA Insurance Protocol?',
      answer: 'RWA Insurance Protocol is an AI-powered platform that provides insurance coverage for tokenized real-world assets like vehicles, properties, and art using blockchain technology and smart contracts.',
    },
    {
      question: 'How does AI risk assessment work?',
      answer: 'Our AI analyzes multiple data points including asset history, location factors, market conditions, and ownership patterns to calculate accurate risk scores and determine fair premium rates.',
    },
    {
      question: 'What assets can I insure?',
      answer: 'You can insure tokenized vehicles (cars, motorcycles, boats), real estate properties, art and collectibles, and other valuable physical assets that have been converted to NFTs.',
    },
    {
      question: 'How are claims processed?',
      answer: 'Claims are processed automatically using smart contracts and oracle verification. Once verified, payouts are made instantly in stablecoins or BDAG tokens directly to your wallet.',
    },
    {
      question: 'What blockchain networks are supported?',
      answer: 'We currently operate on BlockDAG network with plans to expand to Ethereum, Polygon, and other major blockchain networks.',
    },
  ]);

  const breadcrumbData = structuredDataGenerator.generateBreadcrumbData([
    { name: 'Home', url: '/' },
  ]);

  return (
    <>
      <StructuredData data={[faqData, breadcrumbData]} id="homepage-structured-data" />
      <Box as="main" minH="100vh">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <AISection />
        <ChatbotSection />
        <TrustSecuritySection />
        <CTASection />
      </Box>
    </>
  );
}