import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  ctaText: {
    type: String,
    trim: true,
  },
  ctaLink: {
    type: String,
    trim: true,
  },
  image: {
    publicId: String, // Cloudinary public ID
    url: String,      // Cloudinary URL
    alt: String,      // Alt text for accessibility
  },
  backgroundImage: {
    publicId: String,
    url: String,
    alt: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Hero || mongoose.model('Hero', heroSchema);
