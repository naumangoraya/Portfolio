import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
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

  content: {
    type: String,
    required: false,
    trim: false, // Keep backticks for green formatting
    default: '',
  },
  image: {
    publicId: { type: String, required: false, default: '' },
    url: { type: String, required: false, default: '' },
    alt: { type: String, required: false, default: '' },
  },
  gallery: [{
    publicId: { type: String, required: false, default: '' },
    url: { type: String, required: false, default: '' },
    alt: { type: String, required: false, default: '' },
    caption: { type: String, required: false, default: '' }
  }],
  github: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  external: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  ios: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  android: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  tech: [{
    type: String,
    required: false,
    trim: true,
    default: '',
  }],
  company: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  showInProjects: {
    type: Boolean,
    default: true,
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
    enum: ['Web App', 'Mobile App', 'Design', 'Other'],
    default: 'Web App'
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Planning'],
    default: 'Completed'
  },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  // Additional fields for flexibility
  tags: [{
    type: String,
    required: false,
    default: '',
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    default: 'Medium'
  },
  teamSize: {
    type: Number,
    required: false,
    default: 1,
  },
  role: {
    type: String,
    required: false,
    default: '',
  },
}, {
  timestamps: true,
  strict: false, // Allow additional fields
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
