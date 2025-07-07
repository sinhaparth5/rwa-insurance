import { Metadata } from 'next';
import { generateRWAMetadata } from '@/utils/seo';
import { StructuredData } from '@/components/seo/StructuredData';
import { StructuredDataGenerator } from '@/lib/seo/structured-data';
import ConnectButton from '@/components/ConnectButton';
import { InsuranceChatbot } from '@/components/insurance/InsuranceChatbot';
import { WalletStatus } from '@/components/WalletStatus';
import { ShieldCheckIcon } from '@/components/ui/shield-check';
import { ClockIcon } from '@/components/ui/clock';
import { LayoutPanelTopIcon } from '@/components/ui/layout-panel-top';
import { RocketIcon } from '@/components/ui/rocket';
import { ShimmeringText } from '@/components/animate-ui/text/shimmering';
import { GradientText } from '@/components/animate-ui/text/gradient';

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
      
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Hero Section */}
        <section className="text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1><GradientText text="AI-Powered RWA Insurance Protocol" /></h1>
            {/* <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI-Powered RWA Insurance Protocol
            </h1> */}
            <p className="text-xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Revolutionary insurance platform for tokenized real-world assets. 
              Protect your vehicles, properties, and art with AI risk assessment, 
              smart contracts, and automated claims on BlockDAG blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <ConnectButton />
              {/* <WalletStatus /> */}
              <a 
                href="/features" 
                className="border border-blue-400 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Explore Features
              </a>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-16 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
              Comprehensive Asset Protection
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center text-white bg-white/5 backdrop-blur-sm rounded-xl p-8">
                <div className="text-5xl mb-4">🚗</div>
                <h3 className="text-2xl font-semibold mb-4">Vehicle Insurance</h3>
                <p className="text-blue-100 text-lg">
                  Classic cars, luxury vehicles, motorcycles, and fleet protection 
                  with AI-powered risk assessment and instant claims.
                </p>
                <ul className="mt-4 text-sm text-blue-200 space-y-2">
                  <li>• Collision & theft coverage</li>
                  <li>• Classic car specialists</li>
                  <li>• Fleet management</li>
                  <li>• Usage-based premiums</li>
                </ul>
              </div>
              <div className="text-center text-white bg-white/5 backdrop-blur-sm rounded-xl p-8">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-2xl font-semibold mb-4">Property Insurance</h3>
                <p className="text-blue-100 text-lg">
                  Residential and commercial real estate protection with 
                  comprehensive coverage and transparent pricing.
                </p>
                <ul className="mt-4 text-sm text-blue-200 space-y-2">
                  <li>• Fire & natural disaster</li>
                  <li>• Liability coverage</li>
                  <li>• Rental properties</li>
                  <li>• Commercial buildings</li>
                </ul>
              </div>
              <div className="text-center text-white bg-white/5 backdrop-blur-sm rounded-xl p-8">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-semibold mb-4">Art & Collectibles</h3>
                <p className="text-blue-100 text-lg">
                  Fine art, collectibles, and luxury items with specialized 
                  coverage and expert valuation services.
                </p>
                <ul className="mt-4 text-sm text-blue-200 space-y-2">
                  <li>• Fine art protection</li>
                  <li>• Collectible coverage</li>
                  <li>• Transit insurance</li>
                  <li>• Authentication services</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
              AI-Powered Intelligence
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h3 className="text-3xl font-bold mb-6">Smart Risk Assessment</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 rounded-full p-2 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Real-time Data Analysis</h4>
                      <p className="text-blue-100">Continuous monitoring of market conditions, weather patterns, and risk factors.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 rounded-full p-2 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Predictive Modeling</h4>
                      <p className="text-blue-100">Advanced algorithms predict potential risks and adjust premiums dynamically.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 rounded-full p-2 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Fraud Prevention</h4>
                      <p className="text-blue-100">AI detects suspicious patterns and prevents fraudulent claims automatically.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <h4 className="text-2xl font-bold text-white mb-6">Get Instant Quote</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Asset type (e.g., 1965 Aston Martin DB5)"
                    className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20"
                  />
                  <input
                    type="text"
                    placeholder="Estimated value (e.g., £50,000)"
                    className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g., London, UK)"
                    className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20"
                  />
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                    Get AI Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Chatbot Section */}
        <section className="py-16 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Chat with Our AI Assistant
              </h2>
              <p className="text-xl text-blue-100">
                Get instant help with policy creation, claims, and coverage questions
              </p>
            </div>
            <InsuranceChatbot />
          </div>
        </section>

        {/* Trust & Security */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-12">
              Built on Trust & Security
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-white">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon />
                </div>
                <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
                <p className="text-blue-100">Immutable smart contracts ensure transparent and secure policy management.</p>
              </div>
              <div className="text-white">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ClockIcon />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Claims</h3>
                <p className="text-blue-100">Oracle-based verification ensures legitimate claims are processed quickly.</p>
              </div>
              <div className="text-white">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <LayoutPanelTopIcon />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-blue-100">AI-calculated premiums with clear breakdown of all factors and fees.</p>
              </div>
              <div className="text-white">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <RocketIcon />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Payouts</h3>
                <p className="text-blue-100">Automated claims processing with immediate stablecoin payouts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Protect Your Assets?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust RWA Insurance Protocol to protect their tokenized assets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConnectButton />
              <a 
                href="/create-policy" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Create First Policy
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
