/**
 * Content-sniffing upload validation.
 *
 * `file.type` on a multipart part is set by the client, so it is a hint, not a
 * fact. The routes used to trust it, and lib/cloudinary then hardcoded
 * `image/jpeg` on the data URI and passed `resource_type: 'auto'`, letting
 * Cloudinary re-sniff and happily store non-images. SVG in particular passed
 * the old `startsWith('image/')` check and can carry inline script.
 */

export const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_PDF_BYTES = 5 * 1024 * 1024;

const startsWith = (buf, bytes) => bytes.every((b, i) => buf[i] === b);

/**
 * @returns {string|null} the sniffed MIME type, or null when unrecognised
 */
export function sniffMimeType(buffer) {
  if (!buffer || buffer.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';

  // JPEG: FF D8 FF
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return 'image/jpeg';

  // GIF: "GIF87a" / "GIF89a"
  if (startsWith(buffer, [0x47, 0x49, 0x46, 0x38])) return 'image/gif';

  // WEBP: "RIFF" .... "WEBP"
  if (
    startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }

  // PDF: "%PDF-"
  if (startsWith(buffer, [0x25, 0x50, 0x44, 0x46, 0x2d])) return 'application/pdf';

  return null;
}

/**
 * @returns {{ ok: true, mimeType: string } | { ok: false, message: string }}
 */
export function validateUpload(buffer, { allowed, maxBytes, label = 'File' }) {
  if (!buffer || buffer.length === 0) {
    return { ok: false, message: `${label} is empty` };
  }

  if (buffer.length > maxBytes) {
    return {
      ok: false,
      message: `${label} must be smaller than ${Math.round(maxBytes / 1024 / 1024)}MB`,
    };
  }

  const mimeType = sniffMimeType(buffer);

  if (!mimeType || !allowed.includes(mimeType)) {
    return {
      ok: false,
      message: `${label} must be one of: ${allowed.join(', ')}`,
    };
  }

  return { ok: true, mimeType };
}
