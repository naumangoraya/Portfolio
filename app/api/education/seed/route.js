import { NextResponse } from 'next/server';
import { verifyAdmin } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import Education from '../../../../lib/models/Education';

const dummyEducationData = [
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'University of Technology',
    location: 'Lahore, Pakistan',
    startDate: '2018',
    endDate: '2022',
    description: 'Focused on `software engineering` and `web development`. Completed coursework in `data structures`, `algorithms`, and `database systems`.',
    gpa: '3.8/4.0',
    relevantCoursework: [
      'Data Structures & Algorithms',
      'Web Development',
      'Database Systems',
      'Software Engineering',
      'Machine Learning Fundamentals'
    ],
    achievements: [
      'Dean\'s List for 3 consecutive years',
      'Best Final Year Project Award',
      'Member of Computer Science Society'
    ],
    isActive: true,
    order: 1
  },
  {
    degree: 'Master of Science in Artificial Intelligence',
    school: 'Tech Institute',
    location: 'Karachi, Pakistan',
    startDate: '2022',
    endDate: '2024',
    description: 'Specialized in `machine learning`, `deep learning`, and `natural language processing`. Research focused on `RAG systems` and `AI automation`.',
    gpa: '3.9/4.0',
    relevantCoursework: [
      'Advanced Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'AI Ethics & Governance'
    ],
    achievements: [
      'Research Assistant in AI Lab',
      'Published 2 research papers',
      'Graduated with Distinction'
    ],
    isActive: true,
    order: 2
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
    const existingCount = await Education.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Education already has data. Skipping seed.',
        existingCount
      });
    }

    // Save education data
    const savedEducation = [];
    for (const education of dummyEducationData) {
      const newEducation = new Education(education);
      await newEducation.save();
      savedEducation.push(newEducation);
    }

    return NextResponse.json({
      message: 'Education seeded successfully',
      educationAdded: savedEducation.length,
      education: savedEducation
    });

  } catch (error) {
    console.error('Error seeding education:', error);
    return NextResponse.json(
      { error: `Failed to seed education: ${error.message}` },
      { status: 500 }
    );
  }
}
