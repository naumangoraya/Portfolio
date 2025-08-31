import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Education from '../../../lib/models/Education';
import jwt from 'jsonwebtoken';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

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

// GET - Fetch all education records
export async function GET() {
  try {
    await dbConnect();
    
    const education = await Education.find({ isActive: true })
      .sort({ order: 1, startDate: -1 });
    
    return NextResponse.json({ education });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new education record
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
    
    const educationData = await request.json();
    
    // Create new education record
    const education = new Education({
      ...educationData,
      isActive: true,
      order: educationData.order || 1
    });
    
    await education.save();
    
    return NextResponse.json({ 
      success: true, 
      education,
      message: 'Education record created successfully' 
    });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update education record
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
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }
    
    const education = await Education.findByIdAndUpdate(
      id,
      { ...updateFields, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!education) {
      return NextResponse.json(
        { error: 'Education record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      education,
      message: 'Education record updated successfully' 
    });
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete education record
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
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }
    
    const education = await Education.findByIdAndDelete(id);
    
    if (!education) {
      return NextResponse.json(
        { error: 'Education record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Education record deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
