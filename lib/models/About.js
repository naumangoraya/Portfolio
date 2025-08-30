import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
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
  image: {
    publicId: { type: String, required: false, default: '' },
    url: { type: String, required: false, default: '' },
    alt: { type: String, required: false, default: '' },
  },
  skills: [{
    name: { type: String, required: false, default: '' },
    category: { type: String, required: false, default: '' },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    }
  }],
  experience: {
    years: { type: Number, required: false, default: 0 },
    companies: [{ type: String, required: false, default: '' }],
    highlights: [{ type: String, required: false, default: '' }]
  },
  education: {
    degree: { type: String, required: false, default: '' },
    institution: { type: String, required: false, default: '' },
    year: { type: String, required: false, default: '' },
    description: { type: String, required: false, default: '' }
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
  bio: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  achievements: [{
    type: String,
    required: false,
    default: '',
  }],
  interests: [{
    type: String,
    required: false,
    default: '',
  }],
}, {
  timestamps: true,
  strict: false, // Allow additional fields
});

export default mongoose.models.About || mongoose.model('About', aboutSchema);
