import React from 'react';
import { Layout, Education, Services, Featured, Projects, Contact } from '../src/components';
import EditableHero from '../src/components/sections/EditableHero';
import EditableAbout from '../src/components/sections/EditableAbout';
import EditableJobs from '../src/components/sections/EditableJobs';
import dbConnect from '../lib/mongodb';
import Hero from '../lib/models/Hero';
import About from '../lib/models/About';
import Job from '../lib/models/Job';
import Service from '../lib/models/Service';
import Project from '../lib/models/Project';
import ContactModel from '../lib/models/Contact';
import EducationModel from '../lib/models/Education';

// ISR: cache the rendered page and revalidate at most every 60s. Admin save
// routes call revalidatePath('/') so edits appear immediately rather than
// waiting for the window. This avoids hitting MongoDB on every visitor request.
export const revalidate = 60;
export const preferredRegion = 'auto'; // Use closest region
export const maxDuration = 30; // Extend function timeout
export const runtime = 'nodejs'; // Ensure Node.js runtime for Mongoose

const isDev = process.env.NODE_ENV !== 'production';

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

// Fetch data directly from the database (no HTTP fetch)
async function getData() {
  try {
    if (isDev) console.log('🔍 Starting data fetch from database...');

    // Connect to database
    await dbConnect();
    
    // Fetch all data directly from MongoDB using .lean() for plain objects
    const [heroData, aboutData, jobsData, servicesData, projectsData, contactData, educationData] = await Promise.all([
      Hero.findOne({ isActive: true }).lean(),
      About.findOne({ isActive: true }).lean(),
      Job.find({ isActive: true }).sort({ order: 1 }).lean(),
      Service.find({ isActive: true }).sort({ order: 1 }).lean(),
      Project.find({ isActive: true }).sort({ order: 1 }).lean(),
      ContactModel.findOne({ isActive: true }).lean(),
      EducationModel.find({ isActive: true }).sort({ order: 1, startDate: -1 }).lean()
    ]);

    // Transform and serialize data
    const transformedData = {
      transformedHeroData: serializeData(heroData),
      transformedAboutData: serializeData(aboutData),
      transformedJobsData: serializeData(jobsData),
      transformedServicesData: serializeData(servicesData),
      transformedProjectsData: serializeData(projectsData),
      transformedContactData: serializeData(contactData),
      transformedEducationData: serializeData(educationData)
    };

    return transformedData;
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    throw error;
  }
}

export default async function HomePage() {
  // Add retry mechanism for data fetching
  let retryCount = 0;
  let data = null;
  
  while (retryCount < 3 && !data) {
    try {
      data = await getData();
      if (data && (data.transformedHeroData || data.transformedAboutData || data.transformedJobsData)) {
        break; // Data fetched successfully
      }
      retryCount++;
      if (retryCount < 3) {
        if (isDev) console.log(`🔄 Retry ${retryCount}/3 - waiting 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Attempt ${retryCount + 1} failed:`, error);
      retryCount++;
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  if (!data) {
    console.error('❌ All retry attempts failed, using fallback data');
    data = {
      transformedHeroData: null,
      transformedAboutData: null,
      transformedJobsData: [],
      transformedServicesData: [],
      transformedProjectsData: [],
      transformedContactData: null,
      transformedEducationData: []
    };
  }
  
  const { transformedHeroData, transformedAboutData, transformedJobsData, transformedServicesData, transformedProjectsData, transformedContactData, transformedEducationData } = data;

  // Transform data to match component expectations
  const transformedHeroDataFinal = transformedHeroData || null;
  const transformedAboutDataFinal = transformedAboutData || null;
  const transformedJobsDataFinal = Array.isArray(transformedJobsData) ? transformedJobsData : [];
  const transformedServicesDataFinal = Array.isArray(transformedServicesData) ? transformedServicesData : [];
  const transformedProjectsDataFinal = Array.isArray(transformedProjectsData) ? transformedProjectsData : [];
  const transformedContactDataFinal = transformedContactData || null;
  const transformedEducationDataFinal = Array.isArray(transformedEducationData) ? transformedEducationData : [];
  
  return (
    <Layout 
      jobsData={transformedJobsDataFinal} 
      projectsData={transformedProjectsDataFinal}
      servicesData={transformedServicesDataFinal}
      contactData={transformedContactDataFinal}
    >
      <main className="fillHeight">
        <EditableHero data={transformedHeroDataFinal} />
        <EditableAbout data={transformedAboutDataFinal} />
        <Education data={transformedEducationDataFinal} />
        <EditableJobs data={transformedJobsDataFinal} />
        <Services data={transformedServicesDataFinal} />
        <Featured data={Array.isArray(transformedProjectsDataFinal) ? transformedProjectsDataFinal.filter(p => p.featured) : []} />
        <Projects data={transformedProjectsDataFinal} />
        <Contact data={transformedContactDataFinal} />
      </main>
    </Layout>
  );
}

export async function generateMetadata() {
  try {
    // Connect to database
    await dbConnect();

    // Fetch hero data directly for metadata
    const heroData = await Hero.findOne({ isActive: true }).lean();

    if (!heroData) {
      return {
        title: 'Portfolio',
        description: 'Welcome to my portfolio',
      };
    }

    // Serialize the data
    const serializedHero = serializeData(heroData);

    return {
      title: `${serializedHero.name || serializedHero.title || 'Portfolio'} - ${serializedHero.tagline || serializedHero.subtitle || 'Developer'}`,
      description: serializedHero.description || serializedHero.longDescription || 'Welcome to my portfolio',
      keywords: ['portfolio', 'developer', 'web development', 'software engineer'],
      authors: [{ name: serializedHero.name || serializedHero.title || 'Developer' }],
      openGraph: {
        title: `${serializedHero.name || serializedHero.title || 'Portfolio'} - ${serializedHero.tagline || serializedHero.subtitle || 'Developer'}`,
        description: serializedHero.description || serializedHero.longDescription || 'Welcome to my portfolio',
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${serializedHero.name || serializedHero.title || 'Portfolio'} - ${serializedHero.tagline || serializedHero.subtitle || 'Developer'}`,
        description: serializedHero.description || serializedHero.longDescription || 'Welcome to my portfolio',
      },
    };
  } catch (error) {
    console.error('❌ Error generating metadata:', error);
    return {
      title: 'Portfolio',
      description: 'Welcome to my portfolio',
    };
  }
}
