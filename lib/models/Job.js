import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: false,
    default: '',
  },
  company: {
    type: String,
    required: false,
    trim: false,
    default: '',
  },
  location: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  range: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    required: false,
    trim: false,
    default: '',
  },
  url: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  logo: {
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
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  current: {
    type: Boolean,
    default: false,
  },
  achievements: [{
    type: String,
    required: false,
    default: '',
  }],
  technologies: [{
    type: String,
    required: false,
    default: '',
  }],
  responsibilities: [{
    type: String,
    required: false,
    default: '',
  }],
  salary: {
    type: String,
    required: false,
    default: '',
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    default: 'Full-time'
  },
}, {
  timestamps: true,
  strict: false, // Allow additional fields
});

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
