import React from 'react';
import { Layout, Education, Services, Featured, Projects, Contact } from '../src/components';
import EditableHero from '../src/components/sections/EditableHero';
import EditableAbout from '../src/components/sections/EditableAbout';
import EditableJobs from '../src/components/sections/EditableJobs';

// Force dynamic rendering to avoid build-time data fetching issues
export const dynamic = 'force-dynamic';

// Fetch data from our new API routes
async function getData() {
  try {
    const [heroRes, aboutRes, jobsRes, servicesRes, projectsRes, contactRes, educationRes] = await Promise.all([
      fetch('/api/hero', { cache: 'no-store' }),
      fetch('/api/about', { cache: 'no-store' }),
      fetch('/api/jobs', { cache: 'no-store' }),
      fetch('/api/services', { cache: 'no-store' }),
      fetch('/api/projects', { cache: 'no-store' }),
      fetch('/api/contact', { cache: 'no-store' }),
      fetch('/api/education', { cache: 'no-store' }),
    ]);

    const [heroData, aboutData, jobsData, servicesData, projectsData, contactData, educationData] = await Promise.all([
      heroRes.ok ? heroRes.json() : null,
      aboutRes.ok ? aboutRes.json() : null,
      jobsRes.ok ? jobsRes.json() : null,
      servicesRes.ok ? servicesRes.json() : null,
      projectsRes.ok ? projectsRes.json() : null,
      contactRes.ok ? contactRes.json() : null,
      educationRes.ok ? educationRes.json() : null,
    ]);

    return {
      heroData,
      aboutData,
      jobsData,
      servicesData,
      projectsData,
      contactData,
      educationData,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return null for all data so components can use their dummy data fallbacks
    return {
      heroData: null,
      aboutData: null,
      jobsData: null,
      servicesData: null,
      projectsData: null,
      contactData: null,
      educationData: null,
    };
  }
}

export default async function HomePage() {
  const { heroData, aboutData, jobsData, servicesData, projectsData, contactData, educationData } = await getData();
  
  // Debug: Log the raw API responses
  console.log('Raw API responses:', {
    heroData,
    aboutData,
    jobsData,
    servicesData,
    projectsData,
    contactData
  });
  
  // Transform data to match component expectations
  // API responses now return { section: data } format, so we need to extract the data
  const transformedHeroData = heroData?.hero || null;
  const transformedAboutData = aboutData?.about || null;
  const transformedJobsData = Array.isArray(jobsData?.jobs) ? jobsData.jobs : [];
  const transformedServicesData = Array.isArray(servicesData?.services) ? servicesData.services : [];
  const transformedProjectsData = Array.isArray(projectsData?.projects) ? projectsData.projects : [];
  const transformedContactData = contactData?.contact || null;
  const transformedEducationData = Array.isArray(educationData?.education) ? educationData.education : [];
  
  // Debug: Log the transformed data
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
    const heroRes = await fetch('/api/hero', { cache: 'no-store' });
    const heroData = heroRes.ok ? await heroRes.json() : null;
    
    // Extract hero data from the response object
    const hero = heroData?.hero || heroData;
    
    return {
      title: hero?.title || hero?.subtitle || 'Nauman Noor',
      description: hero?.description || hero?.longDescription || 'Nauman Noor is a software engineer who specializes in building exceptional digital experiences.',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Return fallback metadata to prevent build failures
    return {
      title: 'Nauman Noor',
      description: 'Nauman Noor is a software engineer who specializes in building exceptional digital experiences.',
    };
  }
}
