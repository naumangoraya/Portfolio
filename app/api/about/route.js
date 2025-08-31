import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import About from '../../../lib/models/About';
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

// GET - Fetch about data
export async function GET() {
  try {
    await dbConnect();
    
    const about = await About.findOne({ isActive: true }).sort({ order: 1 });
    
    if (!about) {
      return NextResponse.json({ about: null });
    }
    
    return NextResponse.json({ about });
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new about record
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
    
    const aboutData = await request.json();
    
    // Create new about record
    const about = new About({
      ...aboutData,
      isActive: true,
      order: aboutData.order || 1
    });
    
    await about.save();
    
    return NextResponse.json({ 
      success: true, 
      about,
      message: 'About section created successfully' 
    });
  } catch (error) {
    console.error('Error creating about:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update about data
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
    
    // Find the active about record
    let about = await About.findOne({ isActive: true });
    
    if (!about) {
      // Create new about record if none exists
      about = new About({
        ...updateData,
        isActive: true,
        order: updateData.order || 1
      });
    } else {
      // Update existing about record
      Object.assign(about, updateData);
      about.updatedAt = new Date();
    }
    
    await about.save();
    
    return NextResponse.json({ 
      success: true, 
      about,
      message: 'About section updated successfully' 
    });
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete about record
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
        { error: 'About ID is required' },
        { status: 400 }
      );
    }
    
    const about = await About.findByIdAndDelete(id);
    
    if (!about) {
      return NextResponse.json(
        { error: 'About record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'About section deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting about:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
