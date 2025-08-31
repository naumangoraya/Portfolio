import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Hero from '../../../lib/models/Hero';
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

export async function GET() {
  try {
    console.log('🔍 Hero API called');
    console.log('🔍 Environment:', process.env.NODE_ENV);
    console.log('🔍 MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');
    
    const hero = await Hero.findOne({ isActive: true }).sort({ order: 1 });
    console.log('Hero query result:', hero ? 'Found' : 'Not found');
    
    if (!hero) {
      console.log('No hero found, returning null');
      return NextResponse.json({ hero: null });
    }
    
    console.log('Hero data being returned:', JSON.stringify(hero, null, 2));
    return NextResponse.json({ hero });
  } catch (error) {
    console.error('❌ Error fetching hero:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Verify admin token
    const authResult = verifyAdmin(request);
    if (!authResult.success) {
      console.log('Auth failed:', authResult.message);
      return NextResponse.json(
        { error: authResult.message },
        { status: 401 }
      );
    }

    console.log('Admin verified, connecting to database...');
    await dbConnect();
    
    const updateData = await request.json();
    console.log('Received update data:', updateData);
    
    // Find the active hero record
    let hero = await Hero.findOne({ isActive: true });
    console.log('Existing hero found:', hero ? 'Yes' : 'No');
    
    if (!hero) {
      // Create new hero record if none exists
      console.log('Creating new hero record...');
      // Set default values for required fields if they're missing
      const defaultData = {
        title: updateData.greeting || updateData.title || 'Hi, my name is',
        subtitle: updateData.name || updateData.subtitle || 'Your Name',
        description: updateData.tagline || 'I build things for the web',
        longDescription: updateData.description || 'I\'m a full stack developer specializing in building exceptional digital experiences.',
        ctaText: updateData.ctaText || 'Get In Touch',
        email: updateData.email || 'naumanjaat@gmail.com',
        isActive: true,
        order: updateData.order || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Creating hero with data:', defaultData);
      
      try {
        hero = new Hero(defaultData);
        await hero.save();
        console.log('Hero created successfully');
      } catch (saveError) {
        console.error('Error saving new hero:', saveError);
        if (saveError.name === 'ValidationError') {
          return NextResponse.json(
            { error: 'Validation error', details: saveError.message },
            { status: 400 }
          );
        }
        throw saveError;
      }
    } else {
      // Update existing hero record with partial data
      console.log('Updating existing hero record...');
      // Only update fields that are provided
      const fieldsToUpdate = {};
      
      // Handle both old and new field names for backward compatibility
      // Priority: new field names first, then fallback to old names
      if (updateData.greeting !== undefined) {
        fieldsToUpdate.title = updateData.greeting;
      } else if (updateData.title !== undefined) {
        fieldsToUpdate.title = updateData.title;
      }
      
      if (updateData.name !== undefined) {
        fieldsToUpdate.subtitle = updateData.name;
      } else if (updateData.subtitle !== undefined) {
        fieldsToUpdate.subtitle = updateData.subtitle;
      }
      
      if (updateData.tagline !== undefined) {
        fieldsToUpdate.description = updateData.tagline;
      }
      
      if (updateData.description !== undefined) {
        fieldsToUpdate.longDescription = updateData.description;
      }
      
      if (updateData.longDescription !== undefined) {
        fieldsToUpdate.longDescription = updateData.longDescription;
      }
      
      if (updateData.ctaText !== undefined) {
        fieldsToUpdate.ctaText = updateData.ctaText;
      }
      
      if (updateData.email !== undefined) {
        fieldsToUpdate.email = updateData.email;
      }
      
      if (updateData.order !== undefined) {
        fieldsToUpdate.order = updateData.order;
      }
      
      fieldsToUpdate.updatedAt = new Date();
      
      console.log('Fields to update:', fieldsToUpdate);
      
      // Only update if there are fields to update
      if (Object.keys(fieldsToUpdate).length > 0) {
        try {
          hero = await Hero.findByIdAndUpdate(
            hero._id,
            fieldsToUpdate,
            { new: true, runValidators: true }
          );
          console.log('Hero updated successfully');
        } catch (updateError) {
          console.error('Error updating hero:', updateError);
          if (updateError.name === 'ValidationError') {
            return NextResponse.json(
              { error: 'Validation error', details: updateError.message },
              { status: 400 }
            );
          }
          throw updateError;
        }
      } else {
        console.log('No fields to update');
      }
    }
    
    console.log('Final hero data:', hero);
    
    return NextResponse.json({ 
      success: true, 
      hero,
      message: 'Hero section updated successfully' 
    });
  } catch (error) {
    console.error('Error updating hero:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
