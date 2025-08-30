import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
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
  longDescription: {
    type: String,
    trim: true,
  },
  image: {
    publicId: String, // Cloudinary public ID
    url: String,      // Cloudinary URL
    alt: String,      // Alt text for accessibility
  },
  skills: [{
    name: String,
    category: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    }
  }],
  experience: {
    years: Number,
    companies: [String],
    highlights: [String]
  },
  education: {
    degree: String,
    institution: String,
    year: String,
    description: String
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

export default mongoose.models.About || mongoose.model('About', aboutSchema);
