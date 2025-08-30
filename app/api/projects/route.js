import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Project from '../../../lib/models/Project';

// GET all projects
export async function GET() {
  try {
    await dbConnect();
    
    const projects = await Project.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST new project
export async function POST(request) {
  try {
    await dbConnect();
    
    const projectData = await request.json();
    
    const project = new Project(projectData);
    await project.save();
    
    return NextResponse.json({ 
      success: true, 
      project 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
