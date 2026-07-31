import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { uploadImage } from '../../../lib/cloudinary';
import { requireAdmin } from '../../../lib/api/requireAdmin';
import { fail } from '../../../lib/api/respond';
import { handleDbError } from '../../../lib/api/handleDbError';
import {
  validateUpload,
  IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
} from '../../../lib/api/fileValidation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  // Auth BEFORE reading the body, so an anonymous caller cannot make us buffer
  // an arbitrary payload.
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || typeof file.arrayBuffer !== 'function') {
      return fail(400, 'VALIDATION', 'No image file provided');
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return fail(400, 'VALIDATION', 'File size must be less than 5MB');
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const check = validateUpload(buffer, {
      allowed: IMAGE_MIME_TYPES,
      maxBytes: MAX_IMAGE_BYTES,
      label: 'Image',
    });

    if (!check.ok) {
      return fail(400, 'VALIDATION', check.message);
    }

    const result = await uploadImage(buffer, {
      folder: 'portfolio',
      // Date.now() collided for two uploads in the same millisecond.
      public_id: `project_${Date.now()}_${randomUUID().slice(0, 8)}`,
      overwrite: false,
      mimeType: check.mimeType,
    });

    // `url`/`publicId` stay at the root: five client call sites read them there.
    return NextResponse.json({
      ok: true,
      success: true,
      message: 'Image uploaded successfully',
      data: { url: result.url, publicId: result.publicId },
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    return handleDbError(error, 'upload');
  }
}
