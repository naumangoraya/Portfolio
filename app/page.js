import React from 'react';
import { Layout, Education, Services, Featured, Projects, Contact } from '../src/components';
import EditableHero from '../src/components/sections/EditableHero';
import EditableAbout from '../src/components/sections/EditableAbout';
import EditableJobs from '../src/components/sections/EditableJobs';

// Fetch data from our new API routes
async function getData() {
  try {
    const [heroRes, aboutRes, jobsRes, servicesRes, projectsRes, contactRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/hero`, { cache: 'no-store' }),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/about`, { cache: 'no-store' }),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/jobs`, { cache: 'no-store' }),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/services`, { cache: 'no-store' }),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projects`, { cache: 'no-store' }),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/contact`, { cache: 'no-store' }),
    ]);

    const [heroData, aboutData, jobsData, servicesData, projectsData, contactData] = await Promise.all([
      heroRes.ok ? heroRes.json() : null,
      aboutRes.ok ? aboutRes.json() : null,
      jobsRes.ok ? jobsRes.json() : null,
      servicesRes.ok ? servicesRes.json() : null,
      projectsRes.ok ? projectsRes.json() : null,
      contactRes.ok ? contactRes.json() : null,
    ]);

    return {
      heroData,
      aboutData,
      jobsData,
      servicesData,
      projectsData,
      contactData,
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
    };
  }
}

export default async function HomePage() {
  const { heroData, aboutData, jobsData, servicesData, projectsData, contactData } = await getData();
  
  // Transform data to match component expectations
  const transformedHeroData = heroData?.hero || null;
  const transformedAboutData = aboutData || null;
  const transformedJobsData = jobsData || [];
  const transformedServicesData = servicesData || [];
  const transformedProjectsData = projectsData || [];
  const transformedContactData = contactData || null;
  
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
        <Education />
        <EditableJobs data={transformedJobsData} />
        <Services data={transformedServicesData} />
        <Featured data={transformedProjectsData?.filter(p => p.featured) || []} />
        <Projects data={transformedProjectsData} />
        <Contact data={transformedContactData} />
      </main>
    </Layout>
  );
}

export async function generateMetadata() {
  try {
    const heroRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/hero`, { cache: 'no-store' });
    const heroData = heroRes.ok ? await heroRes.json() : null;
    
    return {
      title: heroData?.title || 'Nauman Noor',
      description: heroData?.description || 'Nauman Noor is a software engineer who specializes in building exceptional digital experiences.',
    };
  } catch (error) {
    return {
      title: 'Nauman Noor',
      description: 'Nauman Noor is a software engineer who specializes in building exceptional digital experiences.',
    };
  }
}
