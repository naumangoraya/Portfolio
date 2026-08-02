import React from 'react';
import PropTypes from 'prop-types';
import { notFound } from 'next/navigation';
import {
  AboutSchema,
  ContactSchema,
  EducationSchema,
  HeroSchema,
  JobSchema,
  ProjectSchema,
  ServiceSchema,
} from '../../../../lib/schemas/content.js';
import ResourceTable from './ResourceTable';

/**
 * One route for all seven content models.
 *
 * `lib/schemas/content.js` exports `*_FIELDS` as a plain list of field-name
 * strings — it is the API's write whitelist, not a UI description. SchemaForm
 * needs descriptor objects (label, control type, hints, column span), so those
 * are authored here from the same Zod shapes. Keeping them next to the route
 * that consumes them means adding a field is one edit, not three.
 *
 * Deliberately not rendered: every `ImageRef` field (image, logo, certificate,
 * backgroundImage) and every loose-object field (about.skills, about.experience,
 * contact.social, project.gallery, ...). There is no `image` or `repeater` entry
 * in FIELD_COMPONENTS yet, and a control that cannot round-trip its value is
 * worse than no control — the values pass through untouched instead.
 */

const ORDER_FIELD = {
  name: 'order',
  label: 'Order',
  type: 'number',
  min: 0,
  hint: 'Lower numbers render first.',
};

const ACTIVE_FIELD = {
  name: 'isActive',
  label: 'Active',
  type: 'switch',
  onLabel: 'Live',
  offLabel: 'Hidden',
  default: true,
  hint: 'Hidden records stay in the database but are not returned to the site.',
};

const RESOURCE_REGISTRY = {
  jobs: {
    label: 'Experience',
    endpoint: '/api/jobs',
    schema: JobSchema,
    idKey: '_id',
    singleton: false,
    primaryField: 'title',
    fields: [
      { name: 'title', label: 'Role', type: 'text', required: true, max: 200, colSpan: 2 },
      { name: 'company', label: 'Company', type: 'text', max: 200 },
      { name: 'location', label: 'Location', type: 'text', max: 200 },
      {
        name: 'range',
        label: 'Date range',
        type: 'text',
        max: 120,
        hint: 'Free text shown on the site, e.g. "2021 — Present".',
      },
      {
        name: 'employmentType',
        label: 'Employment type',
        type: 'select',
        options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      },
      { name: 'startDate', label: 'Start date', type: 'text', placeholder: 'YYYY-MM-DD' },
      { name: 'endDate', label: 'End date', type: 'text', placeholder: 'YYYY-MM-DD' },
      { name: 'current', label: 'Current role', type: 'switch', onLabel: 'Yes', offLabel: 'No' },
      { name: 'salary', label: 'Salary', type: 'text', max: 100 },
      { name: 'url', label: 'Company link', type: 'text', placeholder: 'https://' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4, colSpan: 2 },
      { name: 'responsibilities', label: 'Responsibilities', type: 'tags', max: 100, colSpan: 2 },
      { name: 'achievements', label: 'Achievements', type: 'tags', max: 100, colSpan: 2 },
      { name: 'technologies', label: 'Technologies', type: 'tags', max: 100, colSpan: 2 },
      ORDER_FIELD,
      ACTIVE_FIELD,
    ],
  },

  services: {
    label: 'Services',
    endpoint: '/api/services',
    schema: ServiceSchema,
    idKey: '_id',
    singleton: false,
    primaryField: 'title',
    fields: [
      { name: 'title', label: 'Service', type: 'text', required: true, max: 200, colSpan: 2 },
      { name: 'category', label: 'Category', type: 'text', max: 120 },
      {
        name: 'icon',
        label: 'Icon',
        type: 'text',
        max: 120,
        hint: 'An emoji or short glyph shown above the title.',
      },
      { name: 'price', label: 'Price', type: 'text', max: 100 },
      { name: 'duration', label: 'Duration', type: 'text', max: 100 },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4, colSpan: 2 },
      { name: 'features', label: 'Features', type: 'tags', max: 100, colSpan: 2 },
      { name: 'technologies', label: 'Technologies', type: 'tags', max: 100, colSpan: 2 },
      ORDER_FIELD,
      ACTIVE_FIELD,
    ],
  },

  projects: {
    label: 'Projects',
    endpoint: '/api/projects',
    schema: ProjectSchema,
    idKey: '_id',
    singleton: false,
    primaryField: 'title',
    fields: [
      { name: 'title', label: 'Project', type: 'text', required: true, max: 200, colSpan: 2 },
      { name: 'company', label: 'Company', type: 'text', max: 200 },
      { name: 'role', label: 'Your role', type: 'text', max: 200 },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: ['Web App', 'Mobile App', 'Design', 'Other'],
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ['Completed', 'In Progress', 'Planning'],
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: ['Easy', 'Medium', 'Hard', 'Expert'],
      },
      { name: 'teamSize', label: 'Team size', type: 'number', min: 0, max: 10000 },
      { name: 'startDate', label: 'Start date', type: 'text', placeholder: 'YYYY-MM-DD' },
      { name: 'endDate', label: 'End date', type: 'text', placeholder: 'YYYY-MM-DD' },
      { name: 'github', label: 'GitHub', type: 'text', placeholder: 'https://' },
      { name: 'external', label: 'Live link', type: 'text', placeholder: 'https://' },
      { name: 'ios', label: 'App Store', type: 'text', placeholder: 'https://' },
      { name: 'android', label: 'Play Store', type: 'text', placeholder: 'https://' },
      { name: 'description', label: 'Short description', type: 'textarea', rows: 3, colSpan: 2 },
      {
        name: 'content',
        label: 'Body',
        type: 'textarea',
        rows: 8,
        colSpan: 2,
        hint: 'Long-form write-up shown on the project page.',
      },
      { name: 'tech', label: 'Tech stack', type: 'tags', max: 60, colSpan: 2 },
      { name: 'tags', label: 'Tags', type: 'tags', max: 60, colSpan: 2 },
      {
        name: 'featured',
        label: 'Featured',
        type: 'switch',
        onLabel: 'Featured',
        offLabel: 'No',
        hint: 'Shows in the highlighted projects strip.',
      },
      {
        name: 'showInProjects',
        label: 'In project grid',
        type: 'switch',
        onLabel: 'Shown',
        offLabel: 'Hidden',
      },
      ORDER_FIELD,
      ACTIVE_FIELD,
    ],
  },

  education: {
    label: 'Education',
    endpoint: '/api/education',
    schema: EducationSchema,
    idKey: '_id',
    singleton: false,
    primaryField: 'degree',
    fields: [
      { name: 'degree', label: 'Degree', type: 'text', required: true, max: 200, colSpan: 2 },
      { name: 'school', label: 'School', type: 'text', max: 200 },
      {
        name: 'institution',
        label: 'Institution',
        type: 'text',
        max: 200,
        hint: 'Used by older records; leave blank if School is set.',
      },
      { name: 'location', label: 'Location', type: 'text', max: 200 },
      { name: 'year', label: 'Year', type: 'text', max: 60 },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        options: ['Degree', 'Certificate', 'Course', 'Workshop', 'Other'],
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ['Completed', 'In Progress', 'Dropped'],
      },
      { name: 'startDate', label: 'Start date', type: 'text', max: 64, placeholder: 'YYYY-MM-DD' },
      { name: 'endDate', label: 'End date', type: 'text', max: 64, placeholder: 'YYYY-MM-DD' },
      { name: 'current', label: 'Currently enrolled', type: 'switch' },
      { name: 'gpa', label: 'GPA', type: 'text', max: 40 },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4, colSpan: 2 },
      { name: 'achievements', label: 'Achievements', type: 'tags', max: 100, colSpan: 2 },
      { name: 'courses', label: 'Courses', type: 'tags', max: 100, colSpan: 2 },
      {
        name: 'relevantCoursework',
        label: 'Relevant coursework',
        type: 'tags',
        max: 100,
        colSpan: 2,
      },
      { name: 'skills', label: 'Skills', type: 'tags', max: 100, colSpan: 2 },
      ORDER_FIELD,
      ACTIVE_FIELD,
    ],
  },

  hero: {
    label: 'Hero',
    endpoint: '/api/hero',
    schema: HeroSchema,
    idKey: '_id',
    singleton: true,
    primaryField: 'title',
    // `tagline` is intentional, not a typo for `description`: /api/hero's
    // transformIn maps tagline -> description and description -> longDescription.
    // Posting `description` here would silently overwrite the long copy.
    fields: [
      {
        name: 'title',
        label: 'Greeting',
        type: 'text',
        max: 200,
        colSpan: 2,
        placeholder: 'Hi, my name is',
      },
      { name: 'subtitle', label: 'Name', type: 'text', max: 300, colSpan: 2 },
      {
        name: 'tagline',
        label: 'Tagline',
        type: 'textarea',
        rows: 2,
        colSpan: 2,
        hint: 'The big second line. Backticks render as green inline code.',
      },
      {
        name: 'longDescription',
        label: 'Intro paragraph',
        type: 'textarea',
        rows: 6,
        colSpan: 2,
        hint: 'Backticks render as green inline code.',
      },
      { name: 'ctaText', label: 'Button label', type: 'text', max: 100 },
      { name: 'email', label: 'Email', type: 'text', placeholder: 'you@example.com' },
      ORDER_FIELD,
      ACTIVE_FIELD,
    ],
  },

  about: {
    label: 'About',
    endpoint: '/api/about',
    schema: AboutSchema,
    idKey: '_id',
    singleton: true,
    primaryField: 'title',
    fields: [
      { name: 'title', label: 'Heading', type: 'text', max: 200, colSpan: 2 },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 6,
        colSpan: 2,
        hint: 'The main About copy.',
      },
      { name: 'bio', label: 'Short bio', type: 'textarea', rows: 4, colSpan: 2 },
      { name: 'achievements', label: 'Achievements', type: 'tags', max: 100, colSpan: 2 },
      { name: 'interests', label: 'Interests', type: 'tags', max: 100, colSpan: 2 },
      ORDER_FIELD,
      ACTIVE_FIELD,
    ],
  },

  contact: {
    label: 'Contact',
    endpoint: '/api/contact',
    schema: ContactSchema,
    idKey: '_id',
    singleton: true,
    primaryField: 'title',
    fields: [
      { name: 'title', label: 'Heading', type: 'text', max: 200, colSpan: 2 },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4, colSpan: 2 },
      { name: 'email', label: 'Email', type: 'text', placeholder: 'you@example.com' },
      { name: 'phone', label: 'Phone', type: 'text', max: 60 },
      { name: 'address', label: 'Address', type: 'textarea', rows: 2, colSpan: 2 },
      { name: 'responseTime', label: 'Response time', type: 'text', max: 120 },
      { name: 'timezone', label: 'Timezone', type: 'text', max: 120 },
      ORDER_FIELD,
      ACTIVE_FIELD,
    ],
  },
};

export async function generateMetadata({ params }) {
  const { resource } = await params;
  const entry = RESOURCE_REGISTRY[resource];
  return { title: entry ? `${entry.label} - Admin` : 'Admin' };
}

export default async function ContentResourcePage({ params }) {
  // Next 16: `params` is a Promise in both layouts and pages.
  const { resource } = await params;

  const entry = RESOURCE_REGISTRY[resource];
  if (!entry) {
    notFound();
  }

  // `entry.schema` is a Zod instance and cannot cross the server/client
  // boundary, so ResourceTable re-resolves it from the same module by slug.
  // Everything else here is plain data and serialises fine.
  return (
    <ResourceTable
      resource={resource}
      label={entry.label}
      endpoint={entry.endpoint}
      fields={entry.fields}
      idKey={entry.idKey}
      singleton={entry.singleton}
      primaryField={entry.primaryField}
    />
  );
}

ContentResourcePage.propTypes = {
  params: PropTypes.object,
};
