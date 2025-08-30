import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Hero from '../../../lib/models/Hero';
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
    
    const hero = await Hero.findOne({ isActive: true }).sort({ order: 1 });
    
    if (!hero) {
      return NextResponse.json({ hero: null });
    }
    
    return NextResponse.json({ hero });
  } catch (error) {
    console.error('Error fetching hero:', error);
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
    
    // Find the active hero record
    const hero = await Hero.findOne({ isActive: true });
    
    if (!hero) {
      return NextResponse.json(
        { error: 'No active hero record found' },
        { status: 404 }
      );
    }
    
    // Update the hero record
    const updatedHero = await Hero.findByIdAndUpdate(
      hero._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      hero: updatedHero,
      message: 'Hero updated successfully' 
    });
  } catch (error) {
    console.error('Error updating hero:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
