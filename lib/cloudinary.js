import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload image
export const uploadImage = async (file, options = {}) => {
  try {
    const {
      folder = 'portfolio',
      transformation = [],
      public_id = null,
      overwrite = false
    } = options;

    // If file is a Buffer, convert it to a data URI for Cloudinary
    let uploadSource = file;
    if (Buffer.isBuffer(file)) {
      const base64 = file.toString('base64');
      const mimeType = 'image/jpeg'; // Default mime type
      uploadSource = `data:${mimeType};base64,${base64}`;
    }

    const result = await cloudinary.uploader.upload(uploadSource, {
      folder,
      resource_type: 'auto',
      public_id,
      overwrite,
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
        ...transformation
      ]
    });
    
    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

// Helper function to upload PDF
export const uploadPDF = async (file, folder = 'portfolio/documents') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'raw',
      format: 'pdf'
    });
    
    return {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary PDF upload error:', error);
    throw new Error('Failed to upload PDF');
  }
};

// Helper function to delete file
export const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file');
  }
};

// Helper function to get adjustable image URL with transformations
export const getAdjustableImageUrl = (publicId, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'fill',
    quality = 'auto:good',
    format = 'auto'
  } = options;

  const transformation = [
    { width, height, crop },
    { quality },
    { fetch_format: format }
  ];

  return cloudinary.url(publicId, {
    transformation,
    secure: true
  });
};

// Helper function to upload image with specific dimensions
export const uploadImageWithDimensions = async (file, dimensions = {}, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'fill'
  } = dimensions;

  return uploadImage(file, {
    ...options,
    transformation: [
      { width, height, crop },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
      ...(options.transformation || [])
    ]
  });
};
