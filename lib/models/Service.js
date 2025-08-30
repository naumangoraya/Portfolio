import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
  },
  image: {
    publicId: String, // Cloudinary public ID
    url: String,      // Cloudinary URL
    alt: String,      // Alt text for accessibility
  },
  features: [{
    type: String,
    trim: true,
  }],
  pricing: {
    type: String,
    trim: true,
  },
  duration: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 1,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    enum: ['Development', 'Design', 'Consulting', 'Training', 'Other'],
    default: 'Development'
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
