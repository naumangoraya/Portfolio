import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('resume');
    const adminToken = formData.get('adminToken');

    // Verify admin token
    if (!adminToken) {
      return NextResponse.json({ error: 'Admin token required' }, { status: 401 });
    }

    // Verify JWT token (you can add proper JWT verification here)
    // For now, we'll just check if it exists

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'resumes',
          public_id: `resume_${Date.now()}`,
          format: 'pdf',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Store resume info in database (optional)
    // You can create a resume collection to track uploads

    return NextResponse.json({
      success: true,
      resumeUrl: result.secure_url,
      publicId: result.public_id,
      message: 'Resume uploaded successfully'
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
}
