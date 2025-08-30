import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Contact from '../../../../lib/models/Contact';

// GET single contact by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const contact = await Contact.findById(params.id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// PUT update contact by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const contactData = await request.json();
    
    // Validate required fields
    if (!contactData.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      params.id,
      contactData,
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      contact: updatedContact 
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// DELETE contact by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const deletedContact = await Contact.findByIdAndDelete(params.id);
    
    if (!deletedContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Contact deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
