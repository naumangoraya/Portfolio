import React from 'react';
import { getAllProjects } from '../../lib/markdown';
import ArchivePageClient from './ArchivePageClient';

export default async function ArchivePage() {
  const projects = getAllProjects();
  
  return <ArchivePageClient projects={projects} />;
}

export async function generateMetadata() {
  return {
    title: 'Archive',
    description: 'A big list of things I\'ve worked on',
  };
}
