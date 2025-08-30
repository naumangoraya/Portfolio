import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import models
import User from '../lib/models/User.js';
import Hero from '../lib/models/Hero.js';
import Project from '../lib/models/Project.js';
import Job from '../lib/models/Job.js';
import Service from '../lib/models/Service.js';
import About from '../lib/models/About.js';
import Contact from '../lib/models/Contact.js';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Hero.deleteMany({}),
      Project.deleteMany({}),
      Job.deleteMany({}),
      Service.deleteMany({}),
      About.deleteMany({}),
      Contact.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing data');

    // Create admin user (password will be hashed by the pre-save hook)
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed automatically
      name: 'Admin User',
      role: 'ADMIN',
    });
    console.log('👤 Created admin user:', adminUser.email);

    // Create hero section
    const hero = await Hero.create({
      title: "Hi, my name is",
      subtitle: "Nauman Noor.",
      description: "I build things for the web.",
      ctaText: "Get In Touch",
      ctaLink: "mailto:nauman.noor@gmail.com",
      image: {
        url: "/me.jpg",
        alt: "Profile Picture"
      },
    });
    console.log('🎯 Created hero section');

    // Create sample projects
    const projects = await Project.create([
      {
        title: "Halcyon Theme",
        description: "A minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more.",
        summary: "A beautiful theme for developers",
        image: {
          url: "/halcyon.png",
          alt: "Halcyon Theme Preview"
        },
        github: "https://github.com/bchiang7/halcyon-theme",
        external: "https://halcyon-theme.netlify.com/",
        tech: ["CSS", "Sass", "JavaScript", "HTML"],
        featured: true,
        order: 1,
        category: "Design",
        status: "Completed"
      },
      {
        title: "Build a Spotify Connected App",
        description: "Having struggled with understanding how the Spotify OAuth flow works, I made the course I wish I could have had.",
        summary: "Learn to build Spotify apps",
        image: {
          url: "/course-card.png",
          alt: "Spotify Course Preview"
        },
        external: "https://www.newline.co/courses/build-a-spotify-connected-app",
        tech: ["React", "Express", "Spotify API", "Styled Components"],
        featured: true,
        order: 2,
        category: "Web App",
        status: "Completed"
      },
      {
        title: "Spotify Profile",
        description: "A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track.",
        summary: "Spotify data visualization app",
        image: {
          url: "/demo.png",
          alt: "Spotify Profile App"
        },
        github: "https://github.com/bchiang7/spotify-profile",
        external: "https://spotify-profile.herokuapp.com/",
        tech: ["React", "Express", "Spotify API", "Heroku"],
        featured: true,
        order: 3,
        category: "Web App",
        status: "Completed"
      },
    ]);
    console.log('💼 Created sample projects');

    // Create sample jobs
    const jobs = await Job.create([
      {
        title: "Software Engineer",
        company: "Upstatement",
        location: "Boston, MA",
        dates: "May 2018 - Present",
        startDate: new Date('2018-05-01'),
        isCurrent: true,
        description: "Write modern, performant, maintainable code for a diverse array of client and internal projects",
        tech: ["React", "Node.js", "TypeScript", "GraphQL"],
        order: 1,
        type: "Full-time"
      },
      {
        title: "Software Engineer",
        company: "Scout",
        location: "Boston, MA",
        dates: "July 2018 - December 2018",
        startDate: new Date('2018-07-01'),
        endDate: new Date('2018-12-31'),
        description: "Worked with a team of developers to build and ship major features of Scout's web app",
        tech: ["React", "Node.js", "MongoDB", "AWS"],
        order: 2,
        type: "Full-time"
      },
    ]);
    console.log('💻 Created sample jobs');

    // Create sample services
    const services = await Service.create([
      {
        title: "Web Development",
        description: "I build responsive, accessible and performant websites. I never work on just frontend or backend, but I bring my full-stack experience to solving problems and finding solutions.",
        shortDescription: "Full-stack web development",
        icon: "💻",
        features: ["Responsive Design", "Performance Optimization", "Accessibility", "SEO"],
        order: 1,
        category: "Development",
        isFeatured: true
      },
      {
        title: "Mobile Development",
        description: "I create cross-platform mobile applications using React Native and other modern technologies.",
        shortDescription: "Cross-platform mobile apps",
        icon: "📱",
        features: ["React Native", "iOS", "Android", "Cross-platform"],
        order: 2,
        category: "Development"
      },
      {
        title: "UI/UX Design",
        description: "I design user interfaces and experiences that are both beautiful and functional.",
        shortDescription: "User-centered design",
        icon: "🎨",
        features: ["User Research", "Wireframing", "Prototyping", "User Testing"],
        order: 3,
        category: "Design"
      },
      {
        title: "Consulting",
        description: "I provide technical consulting and guidance for startups and established companies.",
        shortDescription: "Technical consulting",
        icon: "💡",
        features: ["Architecture Review", "Code Review", "Performance Audit", "Best Practices"],
        order: 4,
        category: "Consulting"
      },
    ]);
    console.log('🛠️ Created sample services');

    // Create about section
    const about = await About.create({
      title: "About Me",
      description: "I'm a software engineer who specializes in building (and occasionally designing) exceptional digital experiences. Currently, I'm focused on building accessible, human-centered products.",
      longDescription: "Currently, I'm an engineer at Upstatement focused on building accessible, inclusive products and digital experiences for a variety of clients.",
      image: {
        url: "/me.jpg",
        alt: "Profile Picture"
      },
      skills: [
        { name: "JavaScript (ES6+)", category: "Programming", level: "Expert" },
        { name: "Python", category: "Programming", level: "Advanced" },
        { name: "React", category: "Frontend", level: "Expert" },
        { name: "Node.js", category: "Backend", level: "Advanced" },
        { name: "Machine Learning", category: "AI/ML", level: "Advanced" },
        { name: "Deep Learning", category: "AI/ML", level: "Intermediate" },
        { name: "Data Science", category: "AI/ML", level: "Advanced" },
        { name: "Generative AI", category: "AI/ML", level: "Intermediate" },
        { name: "RAGs", category: "AI/ML", level: "Intermediate" },
        { name: "Automation", category: "Tools", level: "Advanced" }
      ],
      experience: {
        years: 5,
        companies: ["Upstatement", "Scout"],
        highlights: ["Full-stack development", "AI/ML integration", "Performance optimization"]
      },
      education: {
        degree: "Computer Science",
        institution: "University",
        year: "2018",
        description: "Bachelor's degree in Computer Science"
      }
    });
    console.log('👤 Created about section');

    // Create contact information
    const contact = await Contact.create({
      email: "nauman.noor@gmail.com",
      phone: "+1 (555) 123-4567",
      location: "Boston, MA",
      address: {
        city: "Boston",
        state: "MA",
        country: "USA"
      },
      socialLinks: {
        github: "https://github.com/naumannoor",
        linkedin: "https://linkedin.com/in/naumannoor",
        twitter: "https://twitter.com/naumannoor",
        instagram: "https://instagram.com/naumannoor",
      },
      availability: "Available",
      responseTime: "24 hours",
      workingHours: "9 AM - 6 PM EST",
      timezone: "EST"
    });
    console.log('📞 Created contact information');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Admin user: ${adminUser.email} (password: admin123)`);
    console.log(`- Hero section: ${hero.title}`);
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Jobs: ${jobs.length}`);
    console.log(`- Services: ${services.length}`);
    console.log(`- About section: ${about.title}`);
    console.log(`- Contact: ${contact.email}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedDatabase();
