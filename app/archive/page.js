import React from 'react';
import ArchivePageClient from './ArchivePageClient';
import dbConnect from '../../lib/mongodb';
import Archive from '../../lib/models/Archive';

// Force dynamic rendering to avoid build-time data fetching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate
export const fetchCache = 'force-no-store'; // Never cache
export const preferredRegion = 'auto'; // Use closest region
export const maxDuration = 30; // Extend function timeout
export const runtime = 'nodejs'; // Ensure Node.js runtime for Mongoose

// Helper function to serialize Mongoose objects to plain JavaScript objects
function serializeData(data) {
  if (!data) return null;
  
  // If it's an array, serialize each item
  if (Array.isArray(data)) {
    return data.map(item => serializeData(item));
  }
  
  // If it's an object, convert to plain object and handle special cases
  if (typeof data === 'object' && data !== null) {
    // Handle Mongoose ObjectId
    if (data._id && typeof data._id === 'object' && data._id.toString) {
      data = { ...data, _id: data._id.toString() };
    }
    
    // Convert to plain object and recursively serialize nested properties
    const plainObj = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('$')) continue; // Skip Mongoose internal properties
      plainObj[key] = serializeData(value);
    }
    return plainObj;
  }
  
  // Return primitive values as-is
  return data;
}

async function getArchiveData() {
  try {
    console.log('🔍 Starting archive data fetch from database...');
    
    // Connect to database
    await dbConnect();
    
    // Fetch archive data directly from MongoDB using .lean() for plain objects
    const archiveData = await Archive.find({ isActive: true })
      .sort({ order: 1, date: -1 })
      .lean();

    console.log('🔍 Archive data fetched:', archiveData?.length || 0, 'items');
    
    // Serialize the data
    const serializedData = serializeData(archiveData);
    
    return serializedData;
  } catch (error) {
    console.error('❌ Error fetching archive data:', error);
    return [];
  }
}

export default async function ArchivePage() {
  const archiveData = await getArchiveData();
  
  return <ArchivePageClient initialData={archiveData} />;
}

export async function generateMetadata() {
  try {
    console.log('🔍 Generating archive metadata...');
    
    // Connect to database
    await dbConnect();
    
    // Fetch some archive data for metadata
    const archiveData = await Archive.find({ isActive: true, featured: true })
      .limit(3)
      .lean();
    
    if (!archiveData || archiveData.length === 0) {
      console.log('⚠️ No archive data found, using fallback metadata');
      return {
        title: 'Archive',
        description: 'A collection of projects and work I\'ve completed',
      };
    }

    // Serialize the data
    const serializedData = serializeData(archiveData);
    
    console.log('🔍 Archive data for metadata:', serializedData?.length || 0, 'items');
    
    return {
      title: 'Archive - Portfolio Projects',
      description: `A collection of ${serializedData.length} projects and work I've completed. Browse through my portfolio of web development, design, and consulting projects.`,
      keywords: ['portfolio', 'projects', 'archive', 'web development', 'design', 'consulting'],
      openGraph: {
        title: 'Archive - Portfolio Projects',
        description: `A collection of ${serializedData.length} projects and work I've completed.`,
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Archive - Portfolio Projects',
        description: `A collection of ${serializedData.length} projects and work I've completed.`,
      },
    };
  } catch (error) {
    console.error('❌ Error generating archive metadata:', error);
    return {
      title: 'Archive',
      description: 'A collection of projects and work I\'ve completed',
    };
  }
}
