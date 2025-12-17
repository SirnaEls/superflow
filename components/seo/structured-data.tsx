'use client';

import { useEffect } from 'react';

export function StructuredData() {
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SupaFlow',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web',
      description: 'Create beautiful user flows and UX diagrams with AI. Designed by Designers, for Designers. Transform your ideas into visual user flows, customer journeys, and UX wireframes.',
      url: 'https://supaflowai.com',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        ratingCount: '1',
      },
      featureList: [
        'User Flow Designer',
        'UX Diagram Creator',
        'AI-Powered Whiteboard',
        'Customer Journey Mapping',
        'Wireframe Tool',
        'Flow Diagram Generator',
      ],
      keywords: 'user flow, UX design, user experience, flow diagram, wireframe, design tool',
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}

