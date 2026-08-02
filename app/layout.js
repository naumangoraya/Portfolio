import React from 'react';
import { Inter } from 'next/font/google';
import { StyledComponentsRegistry } from './lib/registry';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

const DESCRIPTION =
  'Nauman Noor is a software engineer who specializes in building (and occasionally designing) exceptional digital experiences.';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://naumannoor.com';

export const metadata = {
  // Lets every other URL below be relative, so preview deployments resolve to
  // themselves instead of pointing back at production.
  metadataBase: new URL(SITE_URL),
  title: 'Nauman Noor',
  description: DESCRIPTION,
  keywords: ['software engineer', 'developer', 'portfolio'],
  authors: [{ name: 'Nauman Noor' }],
  creator: 'Nauman Noor',
  publisher: 'Nauman Noor',
  robots: 'index, follow',
  openGraph: {
    title: 'Nauman Noor',
    description: DESCRIPTION,
    type: 'website',
    url: '/',
    siteName: 'Nauman Noor',
    images: [{ url: '/og.png', width: 1200, height: 630, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nauman Noor',
    description: DESCRIPTION,
    images: ['/og.png'],
    creator: '@naumannoor',
  },
  verification: {
    google: 'DCl7VAf9tcw6sPN5rlF4ZLjKC7nv2k0Ux4Sv3-L1EcE',
  },
  // Only the icons that actually exist in public/. The previous list declared
  // 20 and 18 of them 404'd on first paint.
  icons: {
    icon: [
      { url: '/favicon-32x32.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport = {
  themeColor: '#0a192f',
};

export default function RootLayout({ children }) {
  return (
    // GlobalStyle sets `scroll-behavior: smooth` on html; this attribute keeps
    // Next overriding it during route transitions (required from Next 16).
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ClientLayout>{children}</ClientLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
