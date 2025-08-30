import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Education from '../../../../lib/models/Education';
import { verifyAdmin } from '../../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    // Verify admin access
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    await dbConnect();
    
    const updateData = await request.json();
    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedEducation) {
      return NextResponse.json(
        { error: 'Education entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Education entry updated successfully',
      education: updatedEducation
    });
  } catch (error) {
    console.error('Error updating education entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Verify admin access
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    await dbConnect();
    
    const deletedEducation = await Education.findByIdAndDelete(id);
    
    if (!deletedEducation) {
      return NextResponse.json(
        { error: 'Education entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Education entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting education entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
