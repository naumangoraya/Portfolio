import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '../../../../lib/mongodb';
import Hero from '../../../../lib/models/Hero';
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

// GET single hero section by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const hero = await Hero.findById(params.id);
    
    if (!hero) {
      return NextResponse.json(
        { error: 'Hero section not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero section' },
      { status: 500 }
    );
  }
}

// PUT update hero section by ID
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

    const heroData = await request.json();
    
    // Validate required fields
    if (!heroData.title || !heroData.subtitle || !heroData.description) {
      return NextResponse.json(
        { error: 'Title, subtitle, and description are required' },
        { status: 400 }
      );
    }
    
    const updatedHero = await Hero.findByIdAndUpdate(
      params.id,
      heroData,
      { new: true, runValidators: true }
    );
    
    if (!updatedHero) {
      return NextResponse.json(
        { error: 'Hero section not found' },
        { status: 404 }
      );
    }
    
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      hero: updatedHero
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
}

// DELETE hero section by ID
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

    const deletedHero = await Hero.findByIdAndDelete(params.id);
    
    if (!deletedHero) {
      return NextResponse.json(
        { error: 'Hero section not found' },
        { status: 404 }
      );
    }
    
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Hero section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero section' },
      { status: 500 }
    );
  }
}
