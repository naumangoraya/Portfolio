import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '../../../../lib/mongodb';
import About from '../../../../lib/models/About';
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

// GET single about section by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const about = await About.findById(params.id);
    
    if (!about) {
      return NextResponse.json(
        { error: 'About section not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about section' },
      { status: 500 }
    );
  }
}

// PUT update about section by ID
export async function PUT(request, { params }) {
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
    
    // Validate required fields
    if (!aboutData.title || !aboutData.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    const updatedAbout = await About.findByIdAndUpdate(
      params.id,
      aboutData,
      { new: true, runValidators: true }
    );
    
    if (!updatedAbout) {
      return NextResponse.json(
        { error: 'About section not found' },
        { status: 404 }
      );
    }
    
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      about: updatedAbout
    });
  } catch (error) {
    console.error('Error updating about section:', error);
    return NextResponse.json(
      { error: 'Failed to update about section' },
      { status: 500 }
    );
  }
}

// DELETE about section by ID
export async function DELETE(request, { params }) {
  try {
    const authResult = verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();

    const deletedAbout = await About.findByIdAndDelete(params.id);
    
    if (!deletedAbout) {
      return NextResponse.json(
        { error: 'About section not found' },
        { status: 404 }
      );
    }
    
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'About section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting about section:', error);
    return NextResponse.json(
      { error: 'Failed to delete about section' },
      { status: 500 }
    );
  }
}
