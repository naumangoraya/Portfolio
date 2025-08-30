import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import the Archive model
import Archive from '../lib/models/Archive.js';

async function fixArchiveSlugs() {
  try {
    console.log('🔧 Starting to fix archive slugs...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find all archive records with empty slugs
    const archivesWithoutSlugs = await Archive.find({ slug: { $in: ['', null, undefined] } });
    console.log(`📊 Found ${archivesWithoutSlugs.length} archives without slugs`);
    
    if (archivesWithoutSlugs.length === 0) {
      console.log('✅ All archives already have slugs');
      return;
    }
    
    // Update each record with a proper slug
    for (const archive of archivesWithoutSlugs) {
      const slug = archive.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      console.log(`📝 Updating "${archive.title}" with slug: "${slug}"`);
      
      await Archive.findByIdAndUpdate(archive._id, { slug });
    }
    
    console.log('✅ All archive slugs have been fixed!');
    
    // Verify the fix
    const updatedArchives = await Archive.find({});
    console.log('\n📋 Final archive list:');
    updatedArchives.forEach(archive => {
      console.log(`  - ${archive.title} (slug: ${archive.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing archive slugs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixArchiveSlugs();
