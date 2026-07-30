import React from 'react';
import { Layout, Education, Services, Featured, Projects, Contact } from '../src/components';
import EditableHero from '../src/components/sections/EditableHero';
import EditableAbout from '../src/components/sections/EditableAbout';
import EditableJobs from '../src/components/sections/EditableJobs';
import dbConnect from '../lib/mongodb';
import { serializeData } from '../lib/serialize';
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
export const maxDuration = 30; // Extend function timeout
export const runtime = 'nodejs'; // Ensure Node.js runtime for Mongoose

const EMPTY = {
  hero: null,
  about: null,
  jobs: [],
  services: [],
  projects: [],
  contact: null,
  education: [],
};

// Fetch data directly from the database (no HTTP fetch)
async function getData() {
  await dbConnect();

  const [hero, about, jobs, services, projects, contact, education] = await Promise.all([
    Hero.findOne({ isActive: true }).lean(),
    About.findOne({ isActive: true }).lean(),
    Job.find({ isActive: true }).sort({ order: 1 }).lean(),
    Service.find({ isActive: true }).sort({ order: 1 }).lean(),
    Project.find({ isActive: true }).sort({ order: 1 }).lean(),
    ContactModel.findOne({ isActive: true }).lean(),
    EducationModel.find({ isActive: true }).sort({ order: 1, startDate: -1 }).lean(),
  ]);

  return {
    hero: serializeData(hero),
    about: serializeData(about),
    jobs: serializeData(jobs) ?? [],
    services: serializeData(services) ?? [],
    projects: serializeData(projects) ?? [],
    contact: serializeData(contact),
    education: serializeData(education) ?? [],
  };
}

export default async function HomePage() {
  let data = EMPTY;

  try {
    data = await getData();
  } catch (error) {
    // Render the shell with empty sections rather than 500ing the whole page.
    console.error('Error fetching page data:', error);
  }

  const jobs = Array.isArray(data.jobs) ? data.jobs : [];
  const services = Array.isArray(data.services) ? data.services : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const education = Array.isArray(data.education) ? data.education : [];

  return (
    <Layout>
      <main className="fillHeight">
        <EditableHero data={data.hero} />
        <EditableAbout data={data.about} />
        <Education data={education} />
        <EditableJobs data={jobs} />
        <Services data={services} />
        <Featured data={projects.filter(p => p.featured)} />
        <Projects data={projects} />
        <Contact data={data.contact} />
      </main>
    </Layout>
  );
}

export async function generateMetadata() {
  try {
    await dbConnect();

    const heroData = await Hero.findOne({ isActive: true }).lean();

    if (!heroData) {
      return {
        title: 'Portfolio',
        description: 'Welcome to my portfolio',
      };
    }

    const hero = serializeData(heroData);
    const name = hero.name || hero.title || 'Portfolio';
    const tagline = hero.tagline || hero.subtitle || 'Developer';
    const title = `${name} - ${tagline}`;
    const description = hero.description || hero.longDescription || 'Welcome to my portfolio';

    return {
      title,
      description,
      keywords: ['portfolio', 'developer', 'web development', 'software engineer'],
      authors: [{ name }],
      openGraph: { title, description, type: 'website', locale: 'en_US' },
      twitter: { card: 'summary_large_image', title, description },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Portfolio',
      description: 'Welcome to my portfolio',
    };
  }
}
