import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Service from '../../../lib/models/Service';
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

// GET - Fetch all services
export async function GET() {
  try {
    await dbConnect();
    
    const services = await Service.find({ isActive: true })
      .sort({ order: 1 });
    
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new service
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
    
    const serviceData = await request.json();
    
    // Create new service
    const service = new Service({
      ...serviceData,
      isActive: true,
      order: serviceData.order || 1
    });
    
    await service.save();
    
    return NextResponse.json({ 
      success: true, 
      service,
      message: 'Service created successfully' 
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update service
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
    const { id, ...updateFields } = updateData;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }
    
    const service = await Service.findByIdAndUpdate(
      id,
      { ...updateFields, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      service,
      message: 'Service updated successfully' 
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
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
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }
    
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Service deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
