import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import cloudinary from '../../../../lib/cloudinary';
import { requireAdmin } from '../../../../lib/api/requireAdmin';
import { fail } from '../../../../lib/api/respond';
import { handleDbError } from '../../../../lib/api/handleDbError';
import { validateUpload, MAX_PDF_BYTES } from '../../../../lib/api/fileValidation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  // Auth first. This route used to `await request.formData()` BEFORE checking
  // the token, so any anonymous caller could force us to buffer an arbitrary
  // payload. The token also arrived in the form body rather than a header,
  // which is why it had to be read late; it is an Authorization header now,
  // like every other route.
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file || typeof file.arrayBuffer !== 'function') {
      return fail(400, 'VALIDATION', 'No file uploaded');
    }

    if (file.size > MAX_PDF_BYTES) {
      return fail(400, 'VALIDATION', 'Resume must be smaller than 5MB');
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Without this, anything at all was stored under a .pdf name on the CDN.
    const check = validateUpload(buffer, {
      allowed: ['application/pdf'],
      maxBytes: MAX_PDF_BYTES,
      label: 'Resume',
    });

    if (!check.ok) {
      return fail(400, 'VALIDATION', check.message);
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'raw',
            folder: 'resumes',
            public_id: `resume_${Date.now()}_${randomUUID().slice(0, 8)}`,
            format: 'pdf',
          },
          (error, uploaded) => (error ? reject(error) : resolve(uploaded))
        )
        .end(buffer);
    });

    revalidatePath('/');

    return NextResponse.json({
      ok: true,
      success: true,
      message: 'Resume uploaded successfully',
      data: { resumeUrl: result.secure_url, publicId: result.public_id },
      resumeUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return handleDbError(error, 'resume/upload');
  }
}
