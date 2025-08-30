import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Job from '../../../lib/models/Job';
import jwt from 'jsonwebtoken';

// Middleware to verify admin token
const verifyAdmin = (request) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: 'No token provided' };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.exp < Date.now() / 1000) {
      return { success: false, message: 'Token expired' };
    }

    if (!decoded.isAdmin) {
      return { success: false, message: 'Insufficient permissions' };
    }

    return { success: true, user: decoded };
  } catch (jwtError) {
    return { success: false, message: 'Invalid token' };
  }
};

// GET - Fetch all jobs
export async function GET() {
  try {
    await dbConnect();
    
    const jobs = await Job.find({ isActive: true })
      .sort({ order: 1, startDate: -1 });
    
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new job
export async function POST(request) {
  try {
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
    const job = new Job({
      ...jobData,
      isActive: true,
      order: jobData.order || 1,
      current: jobData.current || false
    });
    
    await job.save();
    
    return NextResponse.json({ 
      success: true, 
      job,
      message: 'Job created successfully' 
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update job
export async function PUT(request) {
  try {
    const authResult = verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const updateData = await request.json();
    const { id, ...updateFields } = updateData;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const job = await Job.findByIdAndUpdate(
      id,
      { ...updateFields, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      job,
      message: 'Job updated successfully' 
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete job
export async function DELETE(request) {
  try {
    const authResult = verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const job = await Job.findByIdAndDelete(id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Job deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
