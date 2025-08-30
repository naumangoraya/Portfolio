import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Service from '../../../../lib/models/Service';

// GET single service by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const service = await Service.findById(params.id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT update service by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const serviceData = await request.json();
    
    // No validation needed since fields are optional
    const updatedService = await Service.findByIdAndUpdate(
      params.id,
      serviceData,
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      service: updatedService 
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE service by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const deletedService = await Service.findByIdAndDelete(params.id);
    
    if (!deletedService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Service deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
