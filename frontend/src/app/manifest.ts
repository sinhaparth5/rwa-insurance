import { MetadataRoute } from 'next';
import { RWA_INSURANCE_SEO_CONFIG } from '@/lib/seo/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: RWA_INSURANCE_SEO_CONFIG.app.name,
    short_name: 'RWA Insurance',
    description: RWA_INSURANCE_SEO_CONFIG.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#070E1B',
    theme_color: '#1E40AF',
    orientation: 'portrait',
    categories: ['finance', 'insurance', 'blockchain'],
    lang: 'en-US',
    dir: 'ltr',
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
    ],
    shortcuts: [
      {
        name: 'Create Policy',
        short_name: 'New Policy',
        description: 'Create a new insurance policy',
        url: '/create-policy',
        icons: [{ src: '/icons/shortcut-policy.png', sizes: '96x96' }],
      },
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'View your insurance dashboard',
        url: '/dashboard',
        icons: [{ src: '/icons/shortcut-dashboard.png', sizes: '96x96' }],
      },
      {
        name: 'Submit Claim',
        short_name: 'New Claim',
        description: 'Submit an insurance claim',
        url: '/submit-claim',
        icons: [{ src: '/icons/shortcut-claim.png', sizes: '96x96' }],
      },
    ],
    screenshots: [
      {
        src: '/images/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'RWA Insurance Dashboard',
      },
      {
        src: '/images/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile Insurance App',
      },
    ],
  };
}