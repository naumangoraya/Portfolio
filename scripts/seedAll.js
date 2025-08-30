import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import models
import Hero from '../lib/models/Hero.js';
import About from '../lib/models/About.js';
import Project from '../lib/models/Project.js';
import Job from '../lib/models/Job.js';
import Service from '../lib/models/Service.js';
import Contact from '../lib/models/Contact.js';
import Education from '../lib/models/Education.js';
import Archive from '../lib/models/Archive.js';
import User from '../lib/models/User.js';

// Sample data
const sampleData = {
  hero: {
    title: "Hi, my name is",
    subtitle: "Nauman Noor",
    description: "I build things for the web",
    longDescription: "I'm a full stack developer specializing in building exceptional digital experiences.",
    ctaText: "Get In Touch",
    email: "naumanjaat@gmail.com",
    greeting: "Hi, my name is",
    name: "Nauman Noor",
    tagline: "I build things for the web",
    isActive: true,
    order: 1
  },
  
  about: {
    title: "About Me",
    description: "I'm a software engineer who specializes in building exceptional digital experiences.",
    bio: "Currently, I'm focused on building accessible, human-centered products at Upstatement.",
    skills: [
      { name: "JavaScript", category: "Frontend", level: "Expert" },
      { name: "React", category: "Frontend", level: "Expert" },
      { name: "Node.js", category: "Backend", level: "Advanced" },
      { name: "Python", category: "Backend", level: "Intermediate" },
      { name: "MongoDB", category: "Database", level: "Advanced" }
    ],
    experience: {
      years: 5,
      companies: ["Upstatement", "Scout", "Starry"],
      highlights: ["Led development of multiple client projects", "Mentored junior developers", "Improved application performance by 40%"]
    },
    education: {
      degree: "Bachelor of Science in Computer Science",
      institution: "Northeastern University",
      year: "2019",
      description: "Graduated with honors"
    },
    achievements: ["Dean's List", "Best Capstone Project Award", "Hackathon Winner"],
    interests: ["Web Development", "Open Source", "Photography", "Travel"],
    isActive: true,
    order: 1
  },
  
  projects: [
    {
      title: "Halcyon Theme",
      description: "A minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more.",
      content: "Halcyon is a minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more. Available on Visual Studio Marketplace, Package Control, Atom Package Manager, and more.",
      github: "https://github.com/bchiang7/halcyon-vscode",
      external: "https://bchiang7.github.io/halcyon-site/",
      tech: ["VS Code", "Sublime Text", "Atom", "iTerm"],
      company: "Personal",
      featured: true,
      category: "Design",
      status: "Completed",
      tags: ["theme", "dark", "minimal"],
      difficulty: "Easy",
      teamSize: 1,
      role: "Developer & Designer"
    },
    {
      title: "Spotify Profile",
      description: "A web app for visualizing personalized Spotify data built with React, Node.js, and the Spotify Web API.",
      content: "A web app for visualizing personalized Spotify data built with React, Node.js, and the Spotify Web API. Analyze your listening habits and discover new music.",
      github: "https://github.com/bchiang7/spotify-profile",
      external: "https://spotify-profile.herokuapp.com/",
      tech: ["React", "Node.js", "Spotify API", "Chart.js"],
      company: "Personal",
      featured: true,
      category: "Web App",
      status: "Completed",
      tags: ["music", "spotify", "data", "visualization"],
      difficulty: "Medium",
      teamSize: 1,
      role: "Full Stack Developer"
    }
  ],
  
  jobs: [
    {
      title: "Software Engineer",
      company: "Upstatement",
      location: "Boston, MA",
      range: "May 2018 - Present",
      description: "Write modern, performant, maintainable code for a diverse array of client and internal projects",
      url: "https://www.upstatement.com/",
      current: true,
      achievements: [
        "Built and shipped the company's first internal project management system",
        "Interfaced with clients on a weekly basis, providing technological expertise",
        "Built and shipped 2 major features of a ground-breaking social media campaign management platform"
      ],
      technologies: ["React", "Node.js", "MongoDB", "AWS"],
      responsibilities: [
        "Write modern, performant, maintainable code",
        "Work with a variety of different languages, platforms, frameworks, and content management systems",
        "Communicate with multi-disciplinary teams of engineers, designers, producers, and clients on a daily basis"
      ],
      employmentType: "Full-time",
      isActive: true,
      order: 1
    },
    {
      title: "UI Engineer Co-op",
      company: "Scout",
      location: "Somerville, MA",
      range: "July 2017 - December 2017",
      description: "Developed and maintained code for in-house and client websites",
      url: "https://www.scoutstudio.com/",
      current: false,
      achievements: [
        "Built and shipped the company's first internal project management system",
        "Interfaced with clients on a weekly basis, providing technological expertise"
      ],
      technologies: ["JavaScript", "HTML", "CSS", "WordPress"],
      responsibilities: [
        "Developed and maintained code for in-house and client websites",
        "Tested sites in various browsers and devices to ensure cross-browser compatibility"
      ],
      employmentType: "Internship",
      isActive: true,
      order: 2
    }
  ],
  
  services: [
    {
      title: "Web Development",
      description: "I build responsive, accessible, and performant websites and web applications.",
      icon: "💻",
      category: "Development",
      price: "Starting at $2,000",
      duration: "2-8 weeks",
      features: [
        "Responsive Design",
        "SEO Optimization",
        "Performance Optimization",
        "Cross-browser Compatibility"
      ],
      technologies: ["React", "Next.js", "Node.js", "MongoDB"],
      isActive: true,
      order: 1
    },
    {
      title: "UI/UX Design",
      description: "I create beautiful, intuitive, and user-friendly interfaces that enhance user experience.",
      icon: "🎨",
      category: "Design",
      price: "Starting at $1,500",
      duration: "1-4 weeks",
      features: [
        "User Research",
        "Wireframing & Prototyping",
        "Visual Design",
        "User Testing"
      ],
      technologies: ["Figma", "Adobe XD", "Sketch", "InVision"],
      isActive: true,
      order: 2
    },
    {
      title: "Consulting",
      description: "I provide technical consulting to help you make informed decisions about your technology stack.",
      icon: "🤝",
      category: "Consulting",
      price: "$150/hour",
      duration: "Flexible",
      features: [
        "Technology Assessment",
        "Architecture Review",
        "Performance Audit",
        "Security Review"
      ],
      technologies: ["Various"],
      isActive: true,
      order: 3
    }
  ],
  
  contact: {
    title: "Get In Touch",
    description: "",
    email: "naumanjaat@gmail.com",
    phone: "+1 (555) 123-4567",
    address: "Boston, MA",
    social: {
      github: "https://github.com/naumannoor",
      linkedin: "https://linkedin.com/in/naumannoor",
      twitter: "https://twitter.com/naumannoor",
      instagram: "",
      facebook: "",
      youtube: "",
      dribbble: "",
      behance: ""
    },
    responseTime: "Usually responds within 24 hours",
    timezone: "Eastern Time (ET)",
    contactForm: {
      enabled: true,
      fields: [
        { name: "name", type: "text", required: true, placeholder: "Your Name" },
        { name: "email", type: "email", required: true, placeholder: "Your Email" },
        { name: "subject", type: "text", required: false, placeholder: "Subject" },
        { name: "message", type: "textarea", required: true, placeholder: "Your Message" }
      ]
    },
    isActive: true,
    order: 1
  },
  
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Northeastern University",
      location: "Boston, MA",
      year: "2015 - 2019",
      description: "Graduated with honors. Relevant coursework included Data Structures, Algorithms, Computer Systems, and Software Engineering.",
      gpa: "3.8/4.0",
      achievements: ["Dean's List", "Best Capstone Project Award", "Hackathon Winner"],
      courses: ["Data Structures", "Algorithms", "Computer Systems", "Software Engineering"],
      skills: ["Java", "Python", "C++", "Data Structures", "Algorithms"],
      type: "Degree",
      status: "Completed",
      isActive: true,
      order: 1
    },
    {
      degree: "Web Development Bootcamp",
      institution: "General Assembly",
      location: "Boston, MA",
      year: "2018",
      description: "Intensive 12-week program covering full-stack web development.",
      gpa: "Pass",
      achievements: ["Graduated with distinction", "Best final project"],
      courses: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"],
      skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      type: "Certificate",
      status: "Completed",
      isActive: true,
      order: 2
    }
  ],
  
  archive: [
    {
      title: "Building a Portfolio with Next.js",
      description: "A comprehensive guide to building a modern portfolio website using Next.js, MongoDB, and Cloudinary.",
      content: "In this post, I'll walk you through the process of building a modern portfolio website...",
      tags: ["Next.js", "MongoDB", "Portfolio", "Web Development"],
      category: "Tutorial",
      author: "Nauman Noor",
      readTime: "8 min read",
      featured: true,
      status: "Published",
      seo: {
        metaTitle: "Building a Portfolio with Next.js - Complete Guide",
        metaDescription: "Learn how to build a modern portfolio website using Next.js, MongoDB, and Cloudinary.",
        keywords: ["Next.js", "MongoDB", "Portfolio", "Web Development", "Tutorial"]
      },
      isActive: true,
      order: 1
    },
    {
      title: "The Future of Web Development",
      description: "Exploring emerging trends and technologies that will shape the future of web development.",
      content: "As we look toward the future of web development, several trends are emerging...",
      tags: ["Web Development", "Future", "Technology", "Trends"],
      category: "Article",
      author: "Nauman Noor",
      readTime: "12 min read",
      featured: false,
      status: "Published",
      seo: {
        metaTitle: "The Future of Web Development - Emerging Trends",
        metaDescription: "Discover the emerging trends and technologies that will shape the future of web development.",
        keywords: ["Web Development", "Future", "Technology", "Trends", "Emerging"]
      },
      isActive: true,
      order: 2
    }
  ],
  
  adminUser: {
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
    name: "Admin User",
    role: "ADMIN",
    isAdmin: true,
    isActive: true
  }
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_v4';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Hero.deleteMany({}),
      About.deleteMany({}),
      Project.deleteMany({}),
      Job.deleteMany({}),
      Service.deleteMany({}),
      Contact.deleteMany({}),
      Education.deleteMany({}),
      Archive.deleteMany({}),
      User.deleteMany({})
    ]);

    // Seed Hero
    console.log('Seeding Hero...');
    const hero = new Hero(sampleData.hero);
    await hero.save();

    // Seed About
    console.log('Seeding About...');
    const about = new About(sampleData.about);
    await about.save();

    // Seed Projects
    console.log('Seeding Projects...');
    for (const projectData of sampleData.projects) {
      const project = new Project(projectData);
      await project.save();
    }

    // Seed Jobs
    console.log('Seeding Jobs...');
    for (const jobData of sampleData.jobs) {
      const job = new Job(jobData);
      await job.save();
    }

    // Seed Services
    console.log('Seeding Services...');
    for (const serviceData of sampleData.services) {
      const service = new Service(serviceData);
      await service.save();
    }

    // Seed Contact
    console.log('Seeding Contact...');
    const contact = new Contact(sampleData.contact);
    await contact.save();

    // Seed Education
    console.log('Seeding Education...');
    for (const educationData of sampleData.education) {
      const education = new Education(educationData);
      await education.save();
    }

    // Seed Archive
    console.log('Seeding Archive...');
    for (const archiveData of sampleData.archive) {
      const archive = new Archive(archiveData);
      await archive.save();
    }

    // Seed Admin User
    console.log('Seeding Admin User...');
    const adminUser = new User({
      ...sampleData.adminUser,
      password: sampleData.adminUser.password // Let the User model hash it
    });
    await adminUser.save();

    console.log('Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log(`Email: ${sampleData.adminUser.email}`);
    console.log(`Password: ${sampleData.adminUser.password}`);
    console.log('\nYou can now log in to the admin panel with these credentials.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding
seedDatabase();
