import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  school: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  institution: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  location: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  year: {
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
  startDate: { type: String, required: false, default: '' },
  endDate: { type: String, required: false, default: '' },
  current: {
    type: Boolean,
    required: false,
    default: false,
  },
  gpa: {
    type: String,
    required: false,
    default: '',
  },
  achievements: [{
    type: String,
    required: false,
    default: '',
  }],
  courses: [{
    type: String,
    required: false,
    default: '',
  }],
  relevantCoursework: [{
    type: String,
    required: false,
    default: '',
  }],
  skills: [{
    type: String,
    required: false,
    default: '',
  }],
  certificate: {
    publicId: { type: String, required: false, default: '' },
    url: { type: String, required: false, default: '' },
    alt: { type: String, required: false, default: '' },
  },
  type: {
    type: String,
    enum: ['Degree', 'Certificate', 'Course', 'Workshop', 'Other'],
    default: 'Degree'
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Dropped'],
    default: 'Completed'
  },
}, {
  timestamps: true,
  strict: false, // Allow additional fields
});

export default mongoose.models.Education || mongoose.model('Education', educationSchema);
