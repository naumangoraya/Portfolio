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

// Force dynamic rendering to avoid build-time data fetching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate
export const fetchCache = 'force-no-store'; // Never cache
export const preferredRegion = 'auto'; // Use closest region
export const maxDuration = 30; // Extend function timeout
export const runtime = 'nodejs'; // Ensure Node.js runtime for Mongoose

// Fetch data directly from the database (no HTTP fetch)
async function getData() {
  try {
    await dbConnect();

    const [hero, about, jobs, services, projects, contact, education] = await Promise.all([
      Hero.findOne({ isActive: true }).sort({ order: 1 }),
      About.findOne({ isActive: true }).sort({ order: 1 }),
      Job.find({ isActive: true }).sort({ order: 1 }),
      Service.find({ isActive: true }).sort({ order: 1 }),
      Project.find({ isActive: true }).sort({ order: 1 }),
      ContactModel.findOne({ isActive: true }).sort({ order: 1 }),
      EducationModel.find({ isActive: true }).sort({ order: 1, startDate: -1 })
    ]);

    return {
      heroData: { hero: hero || null },
      aboutData: { about: about || null },
      jobsData: { jobs: Array.isArray(jobs) ? jobs : [] },
      servicesData: { services: Array.isArray(services) ? services : [] },
      projectsData: { projects: Array.isArray(projects) ? projects : [] },
      contactData: { contact: contact || null },
      educationData: { education: Array.isArray(education) ? education : [] },
    };
  } catch (error) {
    console.error('❌ Error fetching data from DB:', error);
    return {
      heroData: { hero: null },
      aboutData: { about: null },
      jobsData: { jobs: [] },
      servicesData: { services: [] },
      projectsData: { projects: [] },
      contactData: { contact: null },
      educationData: { education: [] },
    };
  }
}

export default async function HomePage() {
  // Add retry mechanism for data fetching
  let retryCount = 0;
  let data = null;
  
  while (retryCount < 3 && !data) {
    try {
      data = await getData();
      if (data && (data.heroData || data.aboutData || data.jobsData)) {
        break; // Data fetched successfully
      }
      retryCount++;
      if (retryCount < 3) {
        console.log(`🔄 Retry ${retryCount}/3 - waiting 1 second...`);
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
      heroData: { hero: null },
      aboutData: { about: null },
      jobsData: { jobs: [] },
      servicesData: { services: [] },
      projectsData: { projects: [] },
      contactData: { contact: null },
      educationData: { education: [] },
    };
  }
  
  const { heroData, aboutData, jobsData, servicesData, projectsData, contactData, educationData } = data;
  
  // Debug: Log the raw DB responses
  console.log('Raw DB responses:', {
    heroData,
    aboutData,
    jobsData,
    servicesData,
    projectsData,
    contactData,
    educationData
  });
  
  // Transform data to match component expectations
  const transformedHeroData = heroData?.hero || null;
  const transformedAboutData = aboutData?.about || null;
  const transformedJobsData = Array.isArray(jobsData?.jobs) ? jobsData.jobs : [];
  const transformedServicesData = Array.isArray(servicesData?.services) ? servicesData.services : [];
  const transformedProjectsData = Array.isArray(projectsData?.projects) ? projectsData.projects : [];
  const transformedContactData = contactData?.contact || null;
  const transformedEducationData = Array.isArray(educationData?.education) ? educationData.education : [];
  
  console.log('Transformed data:', {
    transformedHeroData,
    transformedAboutData,
    transformedJobsData,
    transformedServicesData,
    transformedProjectsData,
    transformedContactData,
    transformedEducationData
  });
  
  return (
    <Layout 
      jobsData={transformedJobsData} 
      projectsData={transformedProjectsData}
      servicesData={transformedServicesData}
      contactData={transformedContactData}
    >
      <main className="fillHeight">
        <EditableHero data={transformedHeroData} />
        <EditableAbout data={transformedAboutData} />
        <Education data={transformedEducationData} />
        <EditableJobs data={transformedJobsData} />
        <Services data={transformedServicesData} />
        <Featured data={Array.isArray(transformedProjectsData) ? transformedProjectsData.filter(p => p.featured) : []} />
        <Projects data={transformedProjectsData} />
        <Contact data={transformedContactData} />
      </main>
    </Layout>
  );
}

export async function generateMetadata() {
  try {
    await dbConnect();
    const hero = await Hero.findOne({ isActive: true }).sort({ order: 1 });
    
    return {
      title: hero?.title || hero?.subtitle || 'Nauman Noor',
      description: hero?.description || hero?.longDescription || 'Nauman Noor is a software engineer who specializes in building exceptional digital experiences.',
    };
  } catch (error) {
    console.error('Error generating metadata from DB:', error);
    return {
      title: 'Nauman Noor',
      description: 'Nauman Noor is a software engineer who specializes in building exceptional digital experiences.',
    };
  }
}
