import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { archivo } from './fonts';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StickyCta } from '@/components/StickyCta';
import { ConsentBanner } from '@/components/ConsentBanner';
import { ThirdPartyScripts } from '@/components/ThirdPartyScripts';
import { PageViewTracker } from '@/components/PageViewTracker';
import { JsonLd } from '@/components/JsonLd';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { company } from '@/content/site';
import { SITE_URL, organizationSchema, localBusinessSchema, indexingAllowed } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${company.brandName} — AI & Robotics Learning for Schools and Colleges`, template: `%s | ${company.brandName}` },
  description: 'AI, robotics and STEM labs, curriculum, teacher training and hackathons for schools, colleges and students in India.',
  applicationName: company.brandName,
  formatDetection: { telephone: false },
  robots: indexingAllowed() ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#05070d',
  width: 'device-width',
  initialScale: 1,
};

// Applies the remembered "Reduce effects" choice before first paint (no flash of animation).
const reduceEffectsScript = `try{if(localStorage.getItem('genminded-reduce-effects')==='true'){document.documentElement.dataset.reduceEffects='true'}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={archivo.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: reduceEffectsScript }} />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={localBusinessSchema()} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <RevealOnScroll />
        <Footer />
        <StickyCta />
        <ConsentBanner />
        <ThirdPartyScripts />
        <Suspense fallback={null}><PageViewTracker /></Suspense>
      </body>
    </html>
  );
}
