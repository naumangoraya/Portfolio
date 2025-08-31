import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Contact from '../../../lib/models/Contact';
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

// GET - Fetch contact data
export async function GET() {
  try {
    await dbConnect();
    
    const contact = await Contact.findOne({ isActive: true }).sort({ order: 1 });
    
    if (!contact) {
      return NextResponse.json({ contact: null });
    }
    
    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new contact record
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
    
    const contactData = await request.json();
    
    // Create new contact record
    const contact = new Contact({
      ...contactData,
      isActive: true,
      order: contactData.order || 1
    });
    
    await contact.save();
    
    return NextResponse.json({ 
      success: true, 
      contact,
      message: 'Contact section created successfully' 
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update contact data
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
    
    // Find the active contact record
    let contact = await Contact.findOne({ isActive: true });
    
    if (!contact) {
      // Create new contact record if none exists
      contact = new Contact({
        ...updateData,
        isActive: true,
        order: updateData.order || 1
      });
    } else {
      // Update existing contact record
      Object.assign(contact, updateData);
      contact.updatedAt = new Date();
    }
    
    await contact.save();
    
    return NextResponse.json({ 
      success: true, 
      contact,
      message: 'Contact section updated successfully' 
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact record
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
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Contact section deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
