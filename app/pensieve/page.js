import React from 'react';
import { getAllPosts } from '../../lib/markdown';
import PensievePageClient from './PensievePageClient';

export default async function PensievePage() {
  const posts = getAllPosts().filter(post => !post.draft);
  
  return <PensievePageClient posts={posts} />;
}

export async function generateMetadata() {
  return {
    title: 'Pensieve',
    description: 'a collection of memories',
  };
}
