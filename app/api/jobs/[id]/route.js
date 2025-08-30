import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Job from '../../../../lib/models/Job';

// GET single job by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const job = await Job.findById(params.id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT update job by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const jobData = await request.json();
    
    // No validation needed since fields are optional
    const updatedJob = await Job.findByIdAndUpdate(
      params.id,
      jobData,
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
      job: updatedJob 
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE job by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const deletedJob = await Job.findByIdAndDelete(params.id);
    
    if (!deletedJob) {
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
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
