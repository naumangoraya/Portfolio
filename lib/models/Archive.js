import mongoose from 'mongoose';

const archiveSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  // Project-specific fields
  company: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  tech: [{
    type: String,
    required: false,
    trim: true,
    default: '',
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
  slug: {
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
  tags: [{
    type: String,
    required: false,
    trim: true,
    default: '',
  }],
  category: {
    type: String,
    required: false,
    trim: true,
    default: '',
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
  author: {
    type: String,
    required: false,
    default: '',
  },
  publishDate: { type: Date, required: false },
  readTime: {
    type: String,
    required: false,
    default: '',
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Published'
  },
  seo: {
    metaTitle: { type: String, required: false, default: '' },
    metaDescription: { type: String, required: false, default: '' },
    keywords: [{ type: String, required: false, default: '' }],
  },
}, {
  timestamps: true,
  strict: false, // Allow additional fields
});

// Pre-save hook to generate slug from title
archiveSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.models.Archive || mongoose.model('Archive', archiveSchema);
