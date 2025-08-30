import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Archive from '../../../lib/models/Archive';
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

// GET - Fetch all archive records
export async function GET() {
  try {
    console.log('🔍 Archive API: Starting GET request...');
    await dbConnect();
    console.log('✅ Archive API: Database connected');
    
    const archive = await Archive.find({ isActive: true })
      .sort({ order: 1, publishDate: -1 });
    
    console.log('📊 Archive API: Found records:', {
      count: archive.length,
      records: archive.map(item => ({
        id: item._id,
        title: item.title,
        slug: item.slug,
        isActive: item.isActive
      }))
    });
    
    return NextResponse.json({ projects: archive });
  } catch (error) {
    console.error('❌ Archive API: Error fetching archive:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new archive record
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
    
    const archiveData = await request.json();
    
    // Generate slug from title
    const slug = archiveData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if slug already exists
    const existingSlug = await Archive.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json(
        { error: 'A project with this title already exists' },
        { status: 400 }
      );
    }
    
    // Create new archive record
    const archive = new Archive({
      ...archiveData,
      slug,
      isActive: true,
      order: archiveData.order || 1,
      status: archiveData.status || 'Published',
      featured: archiveData.featured || false
    });
    
    await archive.save();
    
    return NextResponse.json({ 
      success: true, 
      archive,
      message: 'Archive record created successfully' 
    });
  } catch (error) {
    console.error('Error creating archive:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update archive record
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
    const { slug, ...updateFields } = updateData;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Archive slug is required' },
        { status: 400 }
      );
    }
    
    console.log('✏️ Updating archive with slug:', slug);
    console.log('📝 Update fields:', updateFields);
    
    const archive = await Archive.findOneAndUpdate(
      { slug },
      { ...updateFields, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!archive) {
      console.log('❌ Archive not found with slug:', slug);
      return NextResponse.json(
        { error: 'Archive record not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Archive updated successfully:', archive.title);
    
    return NextResponse.json({ 
      success: true, 
      archive,
      message: 'Archive record updated successfully' 
    });
  } catch (error) {
    console.error('❌ Error updating archive:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete archive record
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
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Archive slug is required' },
        { status: 400 }
      );
    }
    
    console.log('🗑️ Deleting archive with slug:', slug);
    
    const archive = await Archive.findOneAndDelete({ slug });
    
    if (!archive) {
      console.log('❌ Archive not found with slug:', slug);
      return NextResponse.json(
        { error: 'Archive record not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Archive deleted successfully:', archive.title);
    
    return NextResponse.json({ 
      success: true,
      message: 'Archive record deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting archive:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
