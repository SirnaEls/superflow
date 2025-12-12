import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { SessionProvider } from '@/components/providers/session-provider';
import { ConditionalLayout } from '@/components/layout/conditional-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlowForge - Post-its to User Flows',
  description: 'Transform your FigJam post-its into visual user flows with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
