import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import About from '../../../../lib/models/About';

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
    await dbConnect();
    
    const deletedAbout = await About.findByIdAndDelete(params.id);
    
    if (!deletedAbout) {
      return NextResponse.json(
        { error: 'About section not found' },
        { status: 404 }
      );
    }
    
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
