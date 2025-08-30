import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Service from '../../../lib/models/Service';

export async function GET() {
  try {
    await dbConnect();
    
    const services = await Service.find({ isActive: true })
      .sort({ order: 1 })
      .select('-__v');
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
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
    
    // Create new service
    const service = await Service.create(data);

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
