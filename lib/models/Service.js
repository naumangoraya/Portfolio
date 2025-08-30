import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  icon: {
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
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 1,
  },
  // Additional fields for flexibility
  category: {
    type: String,
    required: false,
    default: '',
  },
  price: {
    type: String,
    required: false,
    default: '',
  },
  duration: {
    type: String,
    required: false,
    default: '',
  },
  features: [{
    type: String,
    required: false,
    default: '',
  }],
  technologies: [{
    type: String,
    required: false,
    default: '',
  }],
  portfolio: [{
    title: { type: String, required: false, default: '' },
    description: { type: String, required: false, default: '' },
    image: {
      publicId: { type: String, required: false, default: '' },
      url: { type: String, required: false, default: '' },
      alt: { type: String, required: false, default: '' },
    }
  }],
}, {
  timestamps: true,
  strict: false, // Allow additional fields
});

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);

