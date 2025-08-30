import React from 'react';
import { Inter } from 'next/font/google';
import { StyledComponentsRegistry } from './lib/registry';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Nauman Noor',
  description: 'Nauman Noor is a software engineer who specializes in building (and occasionally designing) exceptional digital experiences.',
  keywords: ['software engineer', 'developer', 'portfolio'],
  authors: [{ name: 'Nauman Noor', email: 'nauman.noor@gmail.com' }],
  creator: 'Nauman Noor',
  publisher: 'Nauman Noor',
  robots: 'index, follow',
  openGraph: {
    title: 'Nauman Noor',
    description: 'Nauman Noor is a software engineer who specializes in building (and occasionally designing) exceptional digital experiences.',
    type: 'website',
    url: 'https://naumannoor.com',
    siteName: 'Nauman Noor',
    images: [
      {
        url: 'https://naumannoor.com/og.png',
        width: 1200,
        height: 630,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nauman Noor',
    description: 'Nauman Noor is a software engineer who specializes in building (and occasionally designing) exceptional digital experiences.',
    images: ['https://naumannoor.com/og.png'],
    creator: '@naumannoor',
  },
  verification: {
    google: 'DCl7VAf9tcw6sPN5rlF4ZLjKC7nv2k0Ux4Sv3-L1EcE',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-icon-36x36.png', sizes: '36x36', type: 'image/png' },
      { url: '/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/android-icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport = {
  themeColor: '#0a192f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ClientLayout>
            {children}
          </ClientLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
