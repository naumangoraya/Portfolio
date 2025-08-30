import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  social: {
    github: { type: String, required: false, default: '' },
    linkedin: { type: String, required: false, default: '' },
    twitter: { type: String, required: false, default: '' },
    instagram: { type: String, required: false, default: '' },
    facebook: { type: String, required: false, default: '' },
    youtube: { type: String, required: false, default: '' },
    dribbble: { type: String, required: false, default: '' },
    behance: { type: String, required: false, default: '' },
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
  responseTime: {
    type: String,
    required: false,
    default: '',
  },
  timezone: {
    type: String,
    required: false,
    default: '',
  },
  contactForm: {
    enabled: { type: Boolean, default: true },
    fields: [{
      name: { type: String, required: false, default: '' },
      type: { type: String, required: false, default: 'text' },
      required: { type: Boolean, default: false },
      placeholder: { type: String, required: false, default: '' }
    }]
  },
  // Custom fields for additional contact information
  customFields: [{
    type: { type: String, required: false, default: 'text' },
    label: { type: String, required: false, default: '' },
    value: { type: String, required: false, default: '' },
    icon: { type: String, required: false, default: 'portfolio' },
    customIcon: { type: String, required: false, default: null }
  }],
}, {
  timestamps: true,
  strict: false, // Allow additional fields
});

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
