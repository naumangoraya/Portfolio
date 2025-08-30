import React from 'react';
import { getAllPosts } from '../../../lib/markdown';
import TagsPageClient from './TagsPageClient';

export default async function TagsPage() {
  const allPosts = getAllPosts().filter(post => !post.draft);
  const tagCounts = {};
  
  allPosts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  const tags = Object.entries(tagCounts).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);
  
  return <TagsPageClient tags={tags} />;
}

export async function generateMetadata() {
  return {
    title: 'Tags',
    description: 'All tags for blog posts',
  };
}
