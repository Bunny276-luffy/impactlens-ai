import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { CustomCursor } from '@/components/ui/CustomCursor';

export const metadata: Metadata = {
  title: 'ImpactLens AI — NGO Intelligence Platform',
  description: 'AI-powered platform helping NGOs quantify, verify, and amplify their social impact through real-time telemetry, predictive analytics, and transparent donor reporting.',
  keywords: ['NGO', 'Impact Measurement', 'AI Analytics', 'Child Welfare', 'Donor Transparency'],
  openGraph: {
    title: 'ImpactLens AI',
    description: 'Next-generation NGO intelligence platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className="font-sans antialiased bg-obsidian-deep bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'linear-gradient(to bottom, rgba(10, 10, 15, 0.6), rgba(10, 10, 15, 0.95)), url(/3d-bg.png)' }}
        suppressHydrationWarning
      >
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
