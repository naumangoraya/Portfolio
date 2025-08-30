import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Project from '../../../../lib/models/Project';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify admin token
const verifyAdmin = async (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No token provided', status: 401 };
    }
    
    const token = authHeader.substring(7);
    
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if token is expired
      if (decoded.exp < Date.now() / 1000) {
        return { error: 'Token expired', status: 401 };
      }
      
      // Check if user has admin role
      if (!decoded.isAdmin) {
        return { error: 'Insufficient permissions', status: 403 };
      }
      
      return { success: true, user: decoded };
    } catch (jwtError) {
      return { error: 'Invalid token', status: 401 };
    }
  } catch (error) {
    return { error: 'Token verification failed', status: 500 };
  }
};

// GET single project by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const project = await Project.findById(params.id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT update project by ID
export async function PUT(request, { params }) {
  try {
    // Verify admin access
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();
    
    const projectData = await request.json();
    
    // Update showInProjects based on featured status
    if (projectData.featured !== undefined) {
      projectData.showInProjects = !projectData.featured;
    }
    
    // No validation needed since fields are optional
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      { ...projectData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      project: updatedProject 
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE project by ID
export async function DELETE(request, { params }) {
  try {
    // Verify admin access
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();
    
    const deletedProject = await Project.findByIdAndDelete(params.id);
    
    if (!deletedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project', details: error.message },
      { status: 500 }
    );
  }
}
