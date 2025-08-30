import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import About from '../../../lib/models/About';
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
    
    const about = await About.findOne({ isActive: true }).sort({ order: 1 });
    
    if (!about) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about:', error);
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
    
    const updateData = await request.json();
    
    // Find the active about record
    let about = await About.findOne({ isActive: true });
    
    if (!about) {
      // Create new about record if none exists
      about = new About({
        ...updateData,
        isActive: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Update existing about record
      about = await About.findByIdAndUpdate(
        about._id,
        { 
          ...updateData,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      about,
      message: 'About section updated successfully' 
    });
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
