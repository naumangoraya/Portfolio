import React from 'react';
import { Layout } from '../src/components';
import SectionSlot from '../src/components/sections/SectionSlot';
import dbConnect from '../lib/mongodb';
import { serializeData } from '../lib/serialize';
import { getSectionLayout } from '../lib/sections/registry';
import { loadSectionData } from '../lib/sections/loaders';
import Hero from '../lib/models/Hero';

// ISR: cache the rendered page and revalidate at most every 60s. Admin save
// routes call revalidatePath('/') so edits appear immediately rather than
// waiting for the window. This avoids hitting MongoDB on every visitor request.
export const revalidate = 60;
export const maxDuration = 30; // Extend function timeout
export const runtime = 'nodejs'; // Ensure Node.js runtime for Mongoose

export default async function HomePage() {
  // The section order comes from the `sections` collection when it has rows,
  // and from DEFAULT_LAYOUT otherwise — same components, same order, same
  // queries as the previously hardcoded list.
  const layout = await getSectionLayout();

  let data = {};
  try {
    data = await loadSectionData(layout);
  } catch (error) {
    // Render the shell with empty sections rather than 500ing the whole page.
    console.error('Error fetching page data:', error);
  }

  return (
    <Layout>
      <main className="fillHeight">
        {layout.map(section => (
          <SectionSlot key={section.key} section={section} data={data} />
        ))}
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
