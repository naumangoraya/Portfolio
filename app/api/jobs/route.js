import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Job from '../../../lib/models/Job';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Change this to a secure secret

// Middleware to verify admin token
const verifyAdmin = (request) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: 'No token provided' };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.exp < Date.now() / 1000) {
      return { success: false, message: 'Token expired' };
    }

    if (decoded.role !== 'admin') {
      return { success: false, message: 'Insufficient permissions' };
    }

    return { success: true, user: decoded };
  } catch (jwtError) {
    return { success: false, message: 'Invalid token' };
  }
};

export async function GET() {
  try {
    await dbConnect();
    
    const jobs = await Job.find({ isActive: true }).sort({ order: 1 });
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify admin token
    const authResult = verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const jobData = await request.json();
    
    // Create new job
    const newJob = new Job({
      ...jobData,
      isActive: true,
      order: 999, // Will be updated later
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newJob.save();
    
    // Update order for all jobs
    const allJobs = await Job.find({ isActive: true }).sort({ order: 1 });
    for (let i = 0; i < allJobs.length; i++) {
      await Job.findByIdAndUpdate(allJobs[i]._id, { order: i + 1 });
    }
    
    return NextResponse.json({ 
      success: true, 
      job: newJob,
      message: 'Job created successfully' 
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Verify admin token
    const authResult = verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { jobId, updates } = await request.json();
    
    // Find and update the job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { 
        ...updates,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      job: updatedJob,
      message: 'Job updated successfully' 
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Verify admin token
    const authResult = verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { jobId } = await request.json();
    
    // Soft delete the job
    const deletedJob = await Job.findByIdAndUpdate(
      jobId,
      { 
        isActive: false,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!deletedJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Update order for remaining jobs
    const remainingJobs = await Job.find({ isActive: true }).sort({ order: 1 });
    for (let i = 0; i < remainingJobs.length; i++) {
      await Job.findByIdAndUpdate(remainingJobs[i]._id, { order: i + 1 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Job deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
