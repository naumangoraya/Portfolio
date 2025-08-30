import { NextResponse } from 'next/server';
import { verifyAdmin } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import Archive from '../../../../lib/models/Archive';

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

    const { slug } = params;
    const body = await request.json();
    const { title, company, date, tech, github, external, ios, android, content } = body;

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!date || !date.trim()) {
      return NextResponse.json(
        { error: 'Date is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Clean and validate data
    const cleanTitle = title.trim();
    const cleanCompany = company && company.trim() ? company.trim() : null;
    const cleanDate = date.trim();
    const cleanTech = Array.isArray(tech) ? tech.filter(t => t && t.trim()) : [];
    const cleanGithub = github && github.trim() ? github.trim() : null;
    const cleanExternal = external && external.trim() ? external.trim() : null;
    const cleanIos = ios && ios.trim() ? ios.trim() : null;
    const cleanAndroid = android && android.trim() ? android.trim() : null;
    const cleanContent = content && content.trim() ? content.trim() : '';

    // Check if project exists
    await dbConnect();
    const existingProject = await Archive.findOne({ slug });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Archive entry not found' },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let newSlug = slug;
    if (cleanTitle !== existingProject.title) {
      newSlug = cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if new slug already exists
      const slugExists = await Archive.findOne({ slug: newSlug, _id: { $ne: existingProject._id } });
      if (slugExists) {
        return NextResponse.json(
          { error: 'A project with this title already exists' },
          { status: 400 }
        );
      }
    }

    // Update the archive entry
    const updatedProject = await Archive.findOneAndUpdate(
      { slug },
      {
        title: cleanTitle,
        company: cleanCompany,
        date: cleanDate,
        tech: cleanTech,
        github: cleanGithub,
        external: cleanExternal,
        ios: cleanIos,
        android: cleanAndroid,
        content: cleanContent,
        slug: newSlug
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ 
      message: 'Archive entry updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Error updating archive entry:', error);
    return NextResponse.json(
      { error: `Failed to update archive entry: ${error.message}` },
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

    const { slug } = params;
    console.log('Attempting to delete archive entry with slug:', slug);

    // Check if project exists
    await dbConnect();
    const existingProject = await Archive.findOne({ slug });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: `Archive entry not found: ${slug}` },
        { status: 404 }
      );
    }

    // Delete the archive entry
    await Archive.findOneAndDelete({ slug });
    console.log('Successfully deleted archive entry:', slug);

    return NextResponse.json({ 
      message: 'Archive entry deleted successfully',
      deletedSlug: slug
    });

  } catch (error) {
    console.error('Error deleting archive entry:', error);
    return NextResponse.json(
      { error: `Failed to delete archive entry: ${error.message}` },
      { status: 500 }
    );
  }
}
