import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Contact from '../../../lib/models/Contact';

export async function GET() {
  try {
    await dbConnect();
    
    const contact = await Contact.findOne({ isActive: true });
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact information not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Find existing contact or create new one
    let contact = await Contact.findOne({ isActive: true });
    
    if (contact) {
      // Update existing
      contact = await Contact.findByIdAndUpdate(
        contact._id,
        { ...data, isActive: true },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      contact = await Contact.create({ ...data, isActive: true });
    }

    return NextResponse.json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
