import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { uploadImage } from '../../../lib/cloudinary';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify admin token
const verifyAdmin = (request) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: 'No token provided' };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
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

export async function POST(request) {
  try {
    // Verify admin token
    const authResult = verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.message },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Cloudinary
    const result = await uploadImage(buffer, {
      folder: 'portfolio',
      public_id: `project_${Date.now()}`,
      overwrite: false
    });

    // Return the Cloudinary URL
    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
