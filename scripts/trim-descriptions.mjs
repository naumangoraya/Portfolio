// Idempotent content trim: shortens Hero/About/Jobs/Education/Projects descriptions
// that were too dense for their sections. Only touches the description/longDescription
// field on each doc — leaves tech, dates, order, isActive, etc. untouched.
//
// Usage:
//   node scripts/trim-descriptions.mjs --dry-run   (prints the diff, writes nothing)
//   node scripts/trim-descriptions.mjs             (applies it)

import mongoose from 'mongoose';
import fs from 'fs';

const DRY_RUN = process.argv.includes('--dry-run');

const envContent = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
const uri = envContent.match(/MONGODB_URI=(.+)/)[1].trim();

await mongoose.connect(uri);
const db = mongoose.connection.db;

async function updateField(collection, filter, field, value, label) {
  const before = await db.collection(collection).findOne(filter);
  if (!before) {
    console.log(`\n[${collection}] ${label} — NOT FOUND, skipping`);
    return;
  }
  console.log(`\n[${collection}] ${label}`);
  console.log(`  before (${before[field]?.length ?? 0} chars): ${before[field]}`);
  console.log(`  after  (${value.length} chars): ${value}`);
  if (!DRY_RUN) {
    await db
      .collection(collection)
      .updateOne(filter, { $set: { [field]: value, updatedAt: new Date() } });
  }
}

await updateField(
  'heroes',
  { title: 'Hi, my name is' },
  'longDescription',
  "I'm a software engineer based in Lahore, Pakistan, building full-stack apps, AI-powered systems, and automations at `Kcube AI`.",
  'Hero intro paragraph'
);

await updateField(
  'abouts',
  { _id: new mongoose.Types.ObjectId('68b38b192bdd6678915eb360') },
  'description',
  [
    "I'm a software engineer with about a year of experience building full-stack web apps, `AI-powered systems`, and automations end to end — comfortable across `React`, `Python` (`FastAPI`, `Flask`, `Django`), and `SQL`.",
    "At `Kcube AI`, I've shipped a bilingual voice assistant, re-architected an AI recruitment platform for speed, and automated internal operations on `n8n` and the `Microsoft Power Platform`. On the AI/LLM side, I work with retrieval pipelines and `LangChain`/`LangGraph`.",
    'BS in Computer Science from `FAST-NUCES`.',
    'Here are a few technologies I’ve been working with recently:',
  ].join('\n\n'),
  'About bio'
);

await updateField(
  'jobs',
  { _id: new mongoose.Types.ObjectId('68b38b1a2bdd6678915eb36b') },
  'description',
  'Build full-stack web apps, AI-powered systems, and automations end to end — from problem to production, solo and in teams. Shipped a bilingual voice assistant for `Fausto Commercial`, re-architected an AI recruitment platform into a `React` + `FastAPI` pipeline, and built automation suites on `n8n` and the `Microsoft Power Platform` for a financial-advisory firm and a photography agency.',
  'Kcube AI job description'
);

await updateField(
  'jobs',
  { _id: new mongoose.Types.ObjectId('68b38b1a2bdd6678915eb36d') },
  'description',
  'Hands-on traineeship in data science and computer vision — trained models to extract fields from ID cards and documents, built web-scraping workflows with `Selenium` and `BeautifulSoup`, and used LLMs plus `Pandas`/`NumPy` for text extraction and analysis.',
  'Programmers Force job description'
);

await updateField(
  'educations',
  { _id: new mongoose.Types.ObjectId('68b4102a91ba16e920b9cac2') },
  'description',
  'Completed 130/130 credits, with semester GPA rising from 1.82 to 3.50 in the final year. Final Year Project: `Advanced Clickstream Data Analytics` — an ETL + ML forecasting + Power BI platform. Coursework: AI, NLP, Computer Vision, Database Systems.',
  'BS Computer Science description'
);

const projectDescriptions = [
  {
    title: 'SP-Talent Finder — AI Recruitment Platform',
    description:
      'Re-architected a slow, expensive candidate-search platform for a Swiss recruitment firm — replaced Django + Azure AI Search with a custom `React` + `FastAPI` pipeline: ETL, SQL-backed retrieval, and windowed LLM processing. Self-reported: cut per-query cost from ~$30-35 to under $1, and raised relevant results from ~4-5 to dozens.',
  },
  {
    title: 'AVP Automation — Bilingual Voice Assistant',
    description:
      "Built a bilingual (English/Spanish) inbound voice assistant for a Miami real-estate brokerage — language routing, listing/agent lookup, lead capture into `Airtable`, and automated follow-ups. Runs 24/7; self-reported to replace ~5-6 reception staff's call-handling workload.",
  },
  {
    title: 'Advanced Clickstream Data Analytics',
    description:
      'Final-year project consolidating e-commerce sales, campaign, and feedback data into one platform — `ETL` pipelines, ML forecasting (XGBoost, Prophet, LSTM), sentiment analysis, and `Power BI` dashboards with a chatbot for insights.',
  },
  {
    title: '49 Financial — Power Platform Automation Suite',
    description:
      'Built a three-app internal operations suite (~25 screens) on the `Microsoft Power Platform` for a financial-advisory firm — a `SharePoint` contract registry with approval routing, a ticketing hub with SLA countdowns, and a compliance dashboard replacing a manual Excel workbook.',
  },
  {
    title: 'BKP Automation — Lead-to-Task Pipeline',
    description:
      'Automated the lead-to-task pipeline for a photography agency — new leads trigger a `Zapier` workflow that creates a `Trello` card, auto-assigns staff, and syncs to `Google Sheets`, with `n8n` handling orchestration.',
  },
  {
    title: 'AI Auto Interviewer — Eligibility Screening Platform',
    description:
      'Joined an existing `FastAPI` + `React` platform for AI-driven interviews and eligibility screening for government funding programs — focused on debugging and stabilizing existing features rather than building from scratch.',
  },
];

for (const project of projectDescriptions) {
  await updateField(
    'projects',
    { title: project.title },
    'description',
    project.description,
    project.title
  );
}

console.log(DRY_RUN ? '\nDRY RUN — nothing was written.' : '\nDone — all descriptions trimmed.');
await mongoose.disconnect();
