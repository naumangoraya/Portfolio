import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
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
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  image: {
    publicId: String, // Cloudinary public ID
    url: String,      // Cloudinary URL
    alt: String,      // Alt text for accessibility
  },
  gallery: [{
    publicId: String,
    url: String,
    alt: String,
    caption: String
  }],
  github: {
    type: String,
    trim: true,
  },
  external: {
    type: String,
    trim: true,
  },
  ios: {
    type: String,
    trim: true,
  },
  android: {
    type: String,
    trim: true,
  },
  tech: [{
    type: String,
    trim: true,
  }],
  company: {
    type: String,
    trim: true,
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
  startDate: Date,
  endDate: Date,
}, {
  timestamps: true,
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
