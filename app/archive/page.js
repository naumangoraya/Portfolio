import React from 'react';
import ArchivePageClient from './ArchivePageClient';
import dbConnect from '../../lib/mongodb';
import Archive from '../../lib/models/Archive';
import { serializeData } from '../../lib/serialize';

// Force dynamic rendering to avoid build-time data fetching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate
export const runtime = 'nodejs'; // Ensure Node.js runtime for Mongoose

async function getArchiveData() {
  try {
    await dbConnect();

    const archiveData = await Archive.find({ isActive: true })
      .sort({ order: 1, date: -1 })
      .lean();

    return serializeData(archiveData);
  } catch (error) {
    console.error('Error fetching archive data:', error);
    return [];
  }
}

export default async function ArchivePage() {
  const archiveData = await getArchiveData();

  return <ArchivePageClient initialData={archiveData} />;
}

export async function generateMetadata() {
  try {
    await dbConnect();

    const count = await Archive.countDocuments({ isActive: true });

    if (!count) {
      return {
        title: 'Archive',
        description: "A collection of projects and work I've completed",
      };
    }

    const description = `A collection of ${count} projects and work I've completed.`;

    return {
      title: 'Archive - Portfolio Projects',
      description: `${description} Browse through my portfolio of web development, design, and consulting projects.`,
      keywords: ['portfolio', 'projects', 'archive', 'web development', 'design', 'consulting'],
      openGraph: {
        title: 'Archive - Portfolio Projects',
        description,
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Archive - Portfolio Projects',
        description,
      },
    };
  } catch (error) {
    console.error('Error generating archive metadata:', error);
    return {
      title: 'Archive',
      description: "A collection of projects and work I've completed",
    };
  }
}
