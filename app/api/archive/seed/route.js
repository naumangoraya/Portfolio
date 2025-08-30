import { NextResponse } from 'next/server';
import { verifyAdmin } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import Archive from '../../../../lib/models/Archive';

const dummyData = [
  {
    title: 'Harvard Business School Design System',
    company: 'Upstatement',
    date: '2022-01-01',
    tech: ['Storybook', 'React', 'TypeScript'],
    github: null,
    external: null,
    ios: null,
    android: null,
    content: 'Design system for Harvard Business School'
  },
  {
    title: 'Threadable',
    company: 'Upstatement',
    date: '2022-02-01',
    tech: ['React Native', 'Ruby on Rails', 'Firebase'],
    github: null,
    external: null,
    ios: null,
    android: null,
    content: 'Mobile app for thread management'
  },
  {
    title: 'Pratt',
    company: 'Upstatement',
    date: '2022-03-01',
    tech: ['WordPress', 'Timber', 'WordPress Multisite', 'Gutenk'],
    github: null,
    external: null,
    ios: null,
    android: null,
    content: 'Website for Pratt Institute'
  },
  {
    title: 'Everytown Gun Law Rankings',
    company: 'Upstatement',
    date: '2022-04-01',
    tech: ['WordPress', 'Timber', 'PHP', 'Airtable API'],
    github: null,
    external: null,
    ios: null,
    android: null,
    content: 'Gun law rankings website'
  }
];

export async function POST(request) {
  try {
    // Verify admin access
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if data already exists
    const existingCount = await Archive.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Archive already has data. Skipping seed.',
        existingCount
      });
    }

    // Generate slugs and save data
    const savedProjects = [];
    for (const project of dummyData) {
      const slug = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newArchive = new Archive({
        ...project,
        slug
      });

      await newArchive.save();
      savedProjects.push(newArchive);
    }

    return NextResponse.json({
      message: 'Archive seeded successfully',
      projectsAdded: savedProjects.length,
      projects: savedProjects
    });

  } catch (error) {
    console.error('Error seeding archive:', error);
    return NextResponse.json(
      { error: `Failed to seed archive: ${error.message}` },
      { status: 500 }
    );
  }
}
