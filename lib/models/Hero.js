import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  subtitle: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    required: false,
    trim: false, // Keep backticks for green formatting
    default: '',
  },
  longDescription: {
    type: String,
    required: false,
    trim: false, // Keep backticks for green formatting
    default: '',
  },
  ctaText: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  image: {
    publicId: { type: String, required: false, default: '' },
    url: { type: String, required: false, default: '' },
    alt: { type: String, required: false, default: '' },
  },
  backgroundImage: {
    publicId: { type: String, required: false, default: '' },
    url: { type: String, required: false, default: '' },
    alt: { type: String, required: false, default: '' },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 1,
  },
  // Additional fields for flexibility
  greeting: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  name: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  tagline: {
    type: String,
    required: false,
    trim: false, // Keep backticks for green formatting
    default: '',
  },
}, {
  timestamps: true,
  strict: false, // Allow additional fields
});

export default mongoose.models.Hero || mongoose.model('Hero', heroSchema);
