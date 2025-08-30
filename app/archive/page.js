import React from 'react';
import ArchivePageClient from './ArchivePageClient';

export default async function ArchivePage() {
  return <ArchivePageClient />;
}

export async function generateMetadata() {
  return {
    title: 'Archive',
    description: 'A big list of things I\'ve worked on',
  };
}
