import React from 'react';
import { Layout, Education, Services, Featured, Projects, Contact } from '../src/components';
import EditableHero from '../src/components/sections/EditableHero';
import EditableAbout from '../src/components/sections/EditableAbout';
import EditableJobs from '../src/components/sections/EditableJobs';

// Force dynamic rendering to avoid build-time data fetching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate
export const fetchCache = 'force-no-store'; // Never cache
export const preferredRegion = 'auto'; // Use closest region
export const maxDuration = 30; // Extend function timeout

// Fetch data from our new API routes
async function getData() {
  try {
    // Get the base URL for the current environment
    let baseUrl = '';
    
    if (process.env.NODE_ENV === 'development') {
      baseUrl = 'http://localhost:3000';
    } else if (process.env.VERCEL_URL) {
      // Use Vercel's provided URL in production
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NEXTAUTH_URL) {
      // Fallback to NEXTAUTH_URL if available
      baseUrl = process.env.NEXTAUTH_URL;
    }

    console.log('🔍 Environment:', process.env.NODE_ENV);
    console.log('🔍 Base URL:', baseUrl);
    console.log('🔍 VERCEL_URL:', process.env.VERCEL_URL);
    console.log('🔍 MONGODB_URI exists:', !!process.env.MONGODB_URI);

    // Add aggressive cache busting to prevent Vercel edge caching
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const cacheBuster = `?t=${timestamp}&r=${randomId}&v=${process.env.VERCEL_GIT_COMMIT_SHA || 'dev'}`;

    const [heroRes, aboutRes, jobsRes, servicesRes, projectsRes, contactRes, educationRes] = await Promise.all([
             fetch(`${baseUrl}/api/hero${cacheBuster}`, { 
         cache: 'no-store',
         headers: {
           'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
           'Pragma': 'no-cache',
           'Expires': '0',
           'X-Requested-With': 'XMLHttpRequest',
           'X-Cache-Buster': timestamp.toString()
         }
       }),
             fetch(`${baseUrl}/api/about${cacheBuster}`, { 
         cache: 'no-store',
         headers: {
           'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
           'Pragma': 'no-cache',
           'Expires': '0',
           'X-Requested-With': 'XMLHttpRequest',
           'X-Cache-Buster': timestamp.toString()
         }
       }),
       fetch(`${baseUrl}/api/jobs${cacheBuster}`, { 
         cache: 'no-store',
         headers: {
           'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
           'Pragma': 'no-cache',
           'Expires': '0',
           'X-Requested-With': 'XMLHttpRequest',
           'X-Cache-Buster': timestamp.toString()
         }
       }),
       fetch(`${baseUrl}/api/services${cacheBuster}`, { 
         cache: 'no-store',
         headers: {
           'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
           'Pragma': 'no-cache',
           'Expires': '0',
           'X-Requested-With': 'XMLHttpRequest',
           'X-Cache-Buster': timestamp.toString()
         }
       }),
       fetch(`${baseUrl}/api/projects${cacheBuster}`, { 
         cache: 'no-store',
         headers: {
           'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
           'Pragma': 'no-cache',
           'Expires': '0',
           'X-Requested-With': 'XMLHttpRequest',
           'X-Cache-Buster': timestamp.toString()
         }
       }),
       fetch(`${baseUrl}/api/contact${cacheBuster}`, { 
         cache: 'no-store',
         headers: {
           'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
           'Pragma': 'no-cache',
           'Expires': '0',
           'X-Requested-With': 'XMLHttpRequest',
           'X-Cache-Buster': timestamp.toString()
         }
       }),
       fetch(`${baseUrl}/api/education${cacheBuster}`, { 
         cache: 'no-store',
         headers: {
           'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
           'Pragma': 'no-cache',
           'Expires': '0',
           'X-Requested-With': 'XMLHttpRequest',
           'X-Cache-Buster': timestamp.toString()
         }
       }),
    ]);

    console.log('🔍 API Response Statuses:', {
      hero: heroRes.status,
      about: aboutRes.status,
      jobs: jobsRes.status,
      services: servicesRes.status,
      projects: projectsRes.status,
      contact: contactRes.status,
      education: educationRes.status
    });

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
    console.error('❌ Error fetching data:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
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
      heroData: null,
      aboutData: null,
      jobsData: null,
      servicesData: null,
      projectsData: null,
      contactData: null,
      educationData: null,
    };
  }
  
  const { heroData, aboutData, jobsData, servicesData, projectsData, contactData, educationData } = data;
  
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
    // Get the base URL for the current environment
    let baseUrl = '';
    
    if (process.env.NODE_ENV === 'development') {
      baseUrl = 'http://localhost:3000';
    } else if (process.env.VERCEL_URL) {
      // Use Vercel's provided URL in production
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NEXTAUTH_URL) {
      // Fallback to NEXTAUTH_URL if available
      baseUrl = process.env.NEXTAUTH_URL;
    }
    
    // Construct the URL more carefully with aggressive cache busting
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const apiUrl = `${baseUrl}/api/hero?t=${timestamp}&r=${randomId}&v=${process.env.VERCEL_GIT_COMMIT_SHA || 'dev'}`;
    console.log('🔍 Metadata API URL:', apiUrl);
    console.log('🔍 Environment:', process.env.NODE_ENV);
    console.log('🔍 VERCEL_URL:', process.env.VERCEL_URL);
    
         const heroRes = await fetch(apiUrl, { 
       cache: 'no-store',
       headers: {
         'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
         'Pragma': 'no-cache',
         'Expires': '0',
         'X-Requested-With': 'XMLHttpRequest',
         'X-Cache-Buster': timestamp.toString()
       }
     });
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
