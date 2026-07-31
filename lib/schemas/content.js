import { z } from 'zod';
import { str, SafeHref, ImageRef, StringList, DateLike, Order, Flag } from './_shared.js';

/**
 * Request-body schemas for the eight content models.
 *
 * Every field is optional: the admin UI PUTs whatever the open form rendered,
 * and the models themselves mark almost nothing as required. What these buy is
 * (a) type safety before values reach Mongo and (b) an explicit field list,
 * exported as `*_FIELDS`, which `defineResource` uses as its write whitelist.
 * Without that whitelist, `strict: false` lets any admin-token holder write
 * arbitrary keys into the documents.
 */

export const HeroSchema = z
  .object({
    title: str(200),
    subtitle: str(300),
    description: str(2000),
    longDescription: str(5000),
    ctaText: str(100),
    email: z.union([z.email(), z.literal('')]),
    image: ImageRef,
    backgroundImage: ImageRef,
    isActive: Flag,
    order: Order,
    greeting: str(200),
    name: str(200),
    tagline: str(300),
  })
  .partial();

export const AboutSchema = z
  .object({
    title: str(200),
    description: str(5000),
    image: ImageRef,
    skills: z.array(z.union([z.string().max(120), z.object({}).loose()])).max(200),
    experience: z.object({}).loose(),
    education: z.array(z.object({}).loose()).max(50),
    isActive: Flag,
    order: Order,
    bio: str(5000),
    achievements: StringList(100),
    interests: StringList(100),
  })
  .partial();

export const JobSchema = z
  .object({
    title: str(200),
    company: str(200),
    location: str(200),
    range: str(120),
    description: str(5000),
    url: SafeHref,
    logo: ImageRef,
    isActive: Flag,
    order: Order,
    startDate: DateLike,
    endDate: DateLike,
    current: Flag,
    achievements: StringList(100, 1000),
    technologies: StringList(100),
    responsibilities: StringList(100, 1000),
    salary: str(100),
    employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']),
  })
  .partial();

export const ServiceSchema = z
  .object({
    title: str(200),
    description: str(5000),
    icon: str(120),
    image: ImageRef,
    isActive: Flag,
    order: Order,
    category: str(120),
    price: str(100),
    duration: str(100),
    features: StringList(100, 500),
    technologies: StringList(100),
    portfolio: z.array(z.object({}).loose()).max(50),
  })
  .partial();

export const ProjectSchema = z
  .object({
    title: str(200),
    description: str(5000),
    content: str(20000),
    image: ImageRef,
    gallery: z.array(z.object({}).loose()).max(50),
    github: SafeHref,
    external: SafeHref,
    ios: SafeHref,
    android: SafeHref,
    tech: StringList(60),
    company: str(200),
    featured: Flag,
    showInProjects: Flag,
    order: Order,
    isActive: Flag,
    category: z.enum(['Web App', 'Mobile App', 'Design', 'Other']),
    status: z.enum(['Completed', 'In Progress', 'Planning']),
    startDate: DateLike,
    endDate: DateLike,
    tags: StringList(60),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Expert']),
    teamSize: z.number().int().min(0).max(10000),
    role: str(200),
  })
  .partial();

export const ContactSchema = z
  .object({
    title: str(200),
    description: str(5000),
    email: z.union([z.email(), z.literal('')]),
    phone: str(60),
    address: str(500),
    social: z.object({}).loose(),
    isActive: Flag,
    order: Order,
    responseTime: str(120),
    timezone: str(120),
    contactForm: z.object({}).loose(),
    customFields: z.array(z.object({}).loose()).max(50),
  })
  .partial();

export const EducationSchema = z
  .object({
    degree: str(200),
    school: str(200),
    institution: str(200),
    location: str(200),
    year: str(60),
    description: str(5000),
    logo: ImageRef,
    isActive: Flag,
    order: Order,
    // Education stores these as Strings (unlike Job, which uses Date).
    startDate: z.string().max(64),
    endDate: z.string().max(64),
    current: Flag,
    gpa: str(40),
    achievements: StringList(100, 1000),
    courses: StringList(100),
    relevantCoursework: StringList(100),
    skills: StringList(100),
    certificate: ImageRef,
    type: z.enum(['Degree', 'Certificate', 'Course', 'Workshop', 'Other']),
    status: z.enum(['Completed', 'In Progress', 'Dropped']),
  })
  .partial();

export const ArchiveSchema = z
  .object({
    title: str(200),
    description: str(5000),
    content: str(50000),
    company: str(200),
    date: DateLike,
    tech: StringList(60),
    github: SafeHref,
    external: SafeHref,
    ios: SafeHref,
    android: SafeHref,
    slug: z
      .string()
      .max(200)
      .regex(/^[a-z0-9-]*$/, 'Slug may contain lowercase letters, digits and dashes only'),
    image: ImageRef,
    tags: StringList(60),
    category: str(120),
    isActive: Flag,
    order: Order,
    author: str(200),
    publishDate: DateLike,
    readTime: str(60),
    views: z.number().int().min(0),
    likes: z.number().int().min(0),
    featured: Flag,
    status: z.enum(['Draft', 'Published', 'Archived']),
  })
  .partial();

/** Write whitelists — the field list each schema declares. */
const fieldsOf = schema => Object.keys(schema.shape);

export const HERO_FIELDS = fieldsOf(HeroSchema);
export const ABOUT_FIELDS = fieldsOf(AboutSchema);
export const JOB_FIELDS = fieldsOf(JobSchema);
export const SERVICE_FIELDS = fieldsOf(ServiceSchema);
export const PROJECT_FIELDS = fieldsOf(ProjectSchema);
export const CONTACT_FIELDS = fieldsOf(ContactSchema);
export const EDUCATION_FIELDS = fieldsOf(EducationSchema);
export const ARCHIVE_FIELDS = fieldsOf(ArchiveSchema);
