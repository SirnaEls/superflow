import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { SessionProvider } from '@/components/providers/session-provider';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { StructuredData } from '@/components/seo/structured-data';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SupaFlow - User Flow Designer | UX Design Tool for Creating User Flows',
  description: 'Create beautiful user flows and UX diagrams with AI. Designed by Designers, for Designers. Transform your ideas into visual user flows, customer journeys, and UX wireframes with our AI-powered whiteboard tool. Perfect for UX designers, product designers, and design teams.',
  keywords: [
    'user flow',
    'user flow designer',
    'UX design tool',
    'user experience design',
    'flow diagram',
    'UX flow',
    'customer journey',
    'user journey map',
    'wireframe tool',
    'design tool',
    'UX wireframe',
    'interaction design',
    'product design',
    'design system',
    'user flow diagram',
    'UX diagram',
    'design whiteboard',
    'AI design tool',
    'flowchart tool',
    'user flow generator',
  ],
  authors: [{ name: 'SupaFlow' }],
  creator: 'SupaFlow',
  publisher: 'SupaFlow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://supaflowai.com',
    siteName: 'SupaFlow',
    title: 'SupaFlow - User Flow Designer | UX Design Tool',
    description: 'Create beautiful user flows and UX diagrams with AI. Designed by Designers, for Designers. Transform your ideas into visual user flows and customer journeys.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SupaFlow - User Flow Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SupaFlow - User Flow Designer | UX Design Tool',
    description: 'Create beautiful user flows and UX diagrams with AI. Designed by Designers, for Designers.',
    images: ['/og-image.png'],
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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StructuredData />
        <GoogleAnalytics />
        <SessionProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
