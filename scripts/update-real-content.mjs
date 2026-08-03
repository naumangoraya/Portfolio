// Idempotent content update: replaces placeholder Hero/About/Jobs/Education/Contact/Projects
// content with Nauman's real profile data. Safe to re-run — every write is an upsert keyed
// on a stable field (existing _id where known, title/degree elsewhere), never a blind insert.
//
// Usage:
//   node scripts/update-real-content.mjs --dry-run   (prints the diff, writes nothing)
//   node scripts/update-real-content.mjs             (applies it)

import mongoose from 'mongoose';
import fs from 'fs';

const DRY_RUN = process.argv.includes('--dry-run');

const envContent = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
const uri = envContent.match(/MONGODB_URI=(.+)/)[1].trim();

await mongoose.connect(uri);
const db = mongoose.connection.db;

async function upsert(collection, filter, update, label) {
  const before = await db.collection(collection).findOne(filter);
  console.log(`\n[${collection}] ${label}`);
  console.log(before ? `  UPDATE existing _id=${before._id}` : `  INSERT new document`);
  if (!DRY_RUN) {
    await db
      .collection(collection)
      .updateOne(filter, { $set: { ...update, updatedAt: new Date() } }, { upsert: true });
  }
}

// ---------- Hero (collection is currently empty) ----------
await upsert(
  'heroes',
  { title: 'Hi, my name is' },
  {
    title: 'Hi, my name is',
    subtitle: 'Nauman Noor.',
    description: 'I ship `code`, teach it to `think`, then automate the rest.',
    longDescription:
      "I'm a software engineer based in Lahore, Pakistan, currently building full-stack apps, AI-powered systems, and automations at `Kcube AI`. Recently I've re-architected an AI recruitment platform for speed and accuracy, shipped a bilingual voice assistant for real-estate call handling, and automated internal operations for a financial-services client. I hold a BS in Computer Science from `FAST-NUCES`.",
    ctaText: 'Check out my work!',
    email: 'naumanjaat@gmail.com',
    isActive: true,
    order: 1,
  },
  'greeting / name / tagline / longDescription'
);

// ---------- About (update the one existing doc) ----------
await upsert(
  'abouts',
  { _id: new mongoose.Types.ObjectId('68b38b192bdd6678915eb360') },
  {
    title: 'About Me',
    description: [
      "I'm a software engineer with about a year of industry experience building full-stack web applications, `AI-powered systems`, and low-code/no-code automations end to end.",
      "I'm comfortable across the stack — `React` and the MERN ecosystem on the frontend and backend, `Python` with `FastAPI`, `Flask`, and `Django` on the server, and `SQL` and data pipelines underneath.",
      "At `Kcube AI`, I've shipped a bilingual voice assistant that handles inbound real-estate calls, re-architected an AI recruitment platform from Django + Azure AI Search into a much faster React + FastAPI system, and automated internal operations on `n8n`, `Zapier`, and the `Microsoft Power Platform`.",
      'On the AI/LLM side, I work with retrieval pipelines, document extraction, and `LangChain`/`LangGraph` chatbots. My BS in Computer Science from `FAST-NUCES` included a final-year project applying ETL pipelines and machine learning to e-commerce campaign analytics.',
      'Here are a few technologies I’ve been working with recently:',
    ].join('\n\n'),
    skills: [
      { name: 'JavaScript' },
      { name: 'Python' },
      { name: 'React' },
      { name: 'Node.js / FastAPI' },
      { name: 'MongoDB / SQL' },
      { name: 'LangChain & LangGraph' },
      { name: 'n8n / Zapier / Make' },
      { name: 'Microsoft Power Platform' },
    ],
  },
  'bio + skills list'
);

// ---------- Jobs (update the two existing placeholder docs) ----------
await upsert(
  'jobs',
  { _id: new mongoose.Types.ObjectId('68b38b1a2bdd6678915eb36b') },
  {
    title: 'Associate Full Stack Developer',
    company: 'Kcube AI',
    location: 'Lahore, Pakistan',
    range: 'August 2025 - Present',
    description:
      'Build and deliver full-stack web applications, AI-powered systems, and low-code/no-code automations end to end — working solo and in teams, owning features (sometimes entire products) from problem to production. Shipped a bilingual (English/Spanish) voice assistant for `Fausto Commercial` that answers real-estate inquiries and captures leads 24/7, re-architected an AI recruitment search from Django + Azure AI Search into a custom `React` + `FastAPI` pipeline with SQL-backed retrieval and windowed LLM processing, and built internal automation suites on `n8n`, `Zapier`, and the `Microsoft Power Platform` for clients including a financial-advisory firm and a photography agency.',
    tech: [
      'React',
      'FastAPI',
      'Python',
      'n8n',
      'LangChain',
      'LangGraph',
      'Microsoft Power Platform',
      'Vapi',
      'Twilio',
    ],
    employmentType: 'Full-time',
    current: true,
    isActive: true,
    order: 1,
  },
  'Kcube AI'
);

await upsert(
  'jobs',
  { _id: new mongoose.Types.ObjectId('68b38b1a2bdd6678915eb36d') },
  {
    title: 'Data Science Trainee',
    company: 'Programmers Force',
    location: 'Lahore, Pakistan',
    range: 'August 2024 - September 2024',
    description:
      'Hands-on traineeship in data science and computer vision. Trained and used models to extract information from images — locating coordinates, re-aligning, and pulling fields from ID cards and other documents — and built automated web-scraping workflows with `Selenium` and `BeautifulSoup`. Used LLMs to extract and process information from unstructured text, applying `Pandas`, `NumPy`, `Seaborn`, and `Matplotlib` for analysis and visualization.',
    tech: ['Python', 'OpenCV', 'Selenium', 'BeautifulSoup', 'Pandas', 'NumPy'],
    employmentType: 'Internship',
    current: false,
    isActive: true,
    order: 2,
  },
  'Programmers Force'
);

// ---------- Education: update the existing degree doc ----------
await upsert(
  'educations',
  { _id: new mongoose.Types.ObjectId('68b4102a91ba16e920b9cac2') },
  {
    degree: 'BS Computer Science',
    school: 'FAST National University of Computer and Emerging Sciences (FAST-NUCES)',
    institution: 'FAST National University of Computer and Emerging Sciences (FAST-NUCES)',
    location: 'Lahore, Pakistan',
    year: '2021 - 2025',
    description:
      'Completed 130/130 credits with a strong upward trajectory — semester GPA rose from 1.82 to 3.50 across the final year. Final Year Project: `Advanced Clickstream Data Analytics for Enhanced Campaign Performance` — an end-to-end platform spanning ETL pipelines, ML forecasting, sentiment analysis, and Power BI dashboards. Relevant coursework: Artificial Intelligence, Natural Language Processing, Computer Vision, Database Systems, Software Engineering.',
    gpa: '2.76/4.00 (best semester: 3.50)',
    type: 'Degree',
    status: 'Completed',
    isActive: true,
    order: 1,
  },
  'BS Computer Science - FAST-NUCES'
);

// ---------- Education: certificates (new docs, upserted by degree+type) ----------
const certificates = [
  {
    degree: 'Oracle Cloud Infrastructure 2025 Certified Foundations Associate',
    school: 'Oracle',
    institution: 'Oracle',
    year: 'Oct 2025',
    order: 2,
  },
  {
    degree: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    school: 'Oracle',
    institution: 'Oracle',
    year: 'Oct 2025',
    order: 3,
  },
  {
    degree: 'Artificial Intelligence (ML, DL)',
    school: 'NAVTTC',
    institution: 'National Vocational and Technical Training Commission',
    year: 'Sep 2024',
    order: 4,
  },
  {
    degree: 'Meta Front-End Developer (Specialization)',
    school: 'Meta (Coursera)',
    institution: 'Meta (Coursera)',
    year: 'Nov 2023',
    order: 5,
  },
  {
    degree: 'Introduction to Python',
    school: 'DataCamp',
    institution: 'DataCamp',
    year: 'Jul 2023',
    order: 6,
  },
];

for (const cert of certificates) {
  await upsert(
    'educations',
    { degree: cert.degree, type: 'Certificate' },
    {
      ...cert,
      type: 'Certificate',
      status: 'Completed',
      isActive: true,
    },
    cert.degree
  );
}

// ---------- Projects (collection is currently empty) ----------
const projects = [
  {
    title: 'SP-Talent Finder — AI Recruitment Platform',
    description:
      'Re-architected a slow, expensive, low-accuracy candidate-search platform for a Swiss recruitment firm — replacing Django + Azure AI Search with a custom `React` + `FastAPI` pipeline: a purpose-built ETL layer, SQL-backed retrieval, a custom ranking algorithm, and windowed LLM processing so the model only ever sees candidates that fit its context window. Self-reported: cut per-query cost from roughly $30-35 to under $1, and raised relevant results surfaced from ~4-5 to the dozens.',
    tech: ['React', 'FastAPI', 'Azure OpenAI', 'LangGraph', 'SQL', 'ETL'],
    company: 'Stellen-Profis',
    featured: true,
    category: 'Web App',
    order: 1,
  },
  {
    title: 'AVP Automation — Bilingual Voice Assistant',
    description:
      'Built a bilingual (English/Spanish) inbound voice-assistant system for a Miami commercial real-estate brokerage — automatic language routing, listing/agent lookup, lead capture into `Airtable`, and automated follow-up emails. Runs 24/7 and, self-reported, replaces the call-handling workload of roughly 5-6 reception/coordination staff.',
    tech: ['Vapi', 'n8n', 'Airtable', 'Deepgram', 'Twilio', 'Gmail API'],
    company: 'Fausto Commercial',
    featured: true,
    category: 'Other',
    order: 2,
  },
  {
    title: 'Advanced Clickstream Data Analytics',
    description:
      'Final-year project consolidating sales, campaign, and customer-feedback data from multiple e-commerce platforms into one analytics platform — `ETL` pipelines feeding a star-schema data warehouse, machine learning models (Random Forest, XGBoost, Prophet, LSTM) for sales forecasting, sentiment analysis on reviews, and interactive `Power BI` dashboards with a chatbot for insights.',
    tech: ['Python', 'ETL', 'Power BI', 'XGBoost', 'Prophet', 'SQL'],
    company: '',
    featured: true,
    category: 'Web App',
    order: 3,
  },
  {
    title: '49 Financial — Power Platform Automation Suite',
    description:
      'Built a three-app internal operations suite (~25 screens) for a financial-advisory firm entirely on the `Microsoft Power Platform` — a `SharePoint`-backed contract-management registry with COO approval routing and renewal reminders, a multi-department ticketing hub with SLA countdowns, and a compliance-suitability dashboard replacing a manual Excel workbook with scheduled data pulls and a full audit trail.',
    tech: ['Power Apps', 'Power Automate', 'SharePoint', 'Power BI'],
    company: '49 Financial',
    featured: false,
    category: 'Other',
    order: 4,
  },
  {
    title: 'BKP Automation — Lead-to-Task Pipeline',
    description:
      'Automated the lead-to-task pipeline for a photography agency — new leads in `Sprout` trigger a `Zapier` workflow that creates a `Trello` card, Trello Butler generates checklists and assigns staff, the board syncs to `Google Sheets`, and Apps Script applies conditional logic, with `n8n` handling orchestration.',
    tech: ['Zapier', 'Trello', 'n8n', 'Google Apps Script'],
    company: '',
    featured: false,
    category: 'Other',
    order: 5,
  },
  {
    title: 'AI Auto Interviewer — Eligibility Screening Platform',
    description:
      'Joined an existing `FastAPI` + `React` platform for AI-driven multi-language interviews, face verification, and eligibility screening for government funding programs. Focused on debugging and stabilizing existing features — AI interviews, face verification, and the admin panel — rather than building from scratch.',
    tech: ['FastAPI', 'React', 'PostgreSQL', 'InsightFace', 'OpenAI Whisper'],
    company: '',
    featured: false,
    category: 'Web App',
    order: 6,
  },
];

for (const project of projects) {
  await upsert(
    'projects',
    { title: project.title },
    { ...project, isActive: true, showInProjects: true, status: 'Completed' },
    project.title
  );
}

// ---------- Contact (update the one existing doc) ----------
await upsert(
  'contacts',
  { _id: new mongoose.Types.ObjectId('68b38b1b2bdd6678915eb375') },
  {
    title: 'Get In Touch',
    description:
      "I'm currently open to full-time roles in software engineering, AI/ML, and backend/full-stack systems — feel free to reach out.",
    email: 'naumanjaat@gmail.com',
    phone: '+92 310 6623823',
    social: {
      github: 'https://github.com/naumangoraya',
      linkedin: 'https://www.linkedin.com/in/nauman-noor-goraya/',
      twitter: 'https://twitter.com/Naumangoraya1',
    },
  },
  'email / phone / socials'
);

console.log(DRY_RUN ? '\nDRY RUN — nothing was written.' : '\nDone — all documents updated.');
await mongoose.disconnect();
