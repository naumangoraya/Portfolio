// Seeds the `sections` collection from the code-defined DEFAULT_LAYOUT.
//
// Idempotent: upserts on `key`, so re-running it never duplicates rows. Only
// the layout fields are written — existing content in Hero/About/Job/... is
// never touched.
//
// Run with:  npm run seed:sections           (writes)
//            npm run seed:sections -- --dry-run   (prints the diff, writes nothing)

import mongoose from 'mongoose';
import { DEFAULT_LAYOUT } from '../lib/sections/layout.js';

const DRY_RUN = process.argv.includes('--dry-run');
const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Run via `npm run seed:sections`.');
  process.exit(1);
}

const sectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    type: { type: String, required: true, trim: true },
    source: { type: String, enum: ['builtin', 'custom'], default: 'custom' },
    title: { type: String, default: '' },
    anchorId: { type: String, default: '' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    navLabel: { type: String, default: '' },
    navVisible: { type: Boolean, default: false },
    numbered: { type: Boolean, default: false },
    content: { type: mongoose.Schema.Types.Mixed, default: () => ({ blocks: [] }) },
  },
  { timestamps: true }
);

const Section = mongoose.models.Section || mongoose.model('Section', sectionSchema);

await mongoose.connect(MONGODB_URI);
console.log('Connected to MongoDB');

const existing = await Section.find({}).lean();
const byKey = new Map(existing.map(row => [row.key, row]));

console.log(
  `\n${existing.length} existing section row(s); ${DEFAULT_LAYOUT.length} in the layout.\n`
);

const operations = [];

for (const item of DEFAULT_LAYOUT) {
  // eslint-disable-next-line no-unused-vars
  const { _id, ...fields } = item;
  const current = byKey.get(item.key);

  if (current) {
    console.log(`  = ${item.key.padEnd(12)} exists (order ${current.order}) — left as is`);
    continue;
  }

  console.log(
    `  + ${item.key.padEnd(12)} order=${String(fields.order).padEnd(3)} ` +
      `anchor=${(fields.anchorId || '-').padEnd(10)} numbered=${fields.numbered}`
  );

  operations.push({
    updateOne: {
      filter: { key: item.key },
      update: { $setOnInsert: fields },
      upsert: true,
    },
  });
}

if (!operations.length) {
  console.log('\nNothing to do — every section already exists.');
} else if (DRY_RUN) {
  console.log(`\n[dry run] would insert ${operations.length} row(s). Nothing written.`);
} else {
  const result = await Section.bulkWrite(operations);
  console.log(`\nInserted ${result.upsertedCount} row(s).`);
  console.log('The rendered order is unchanged: these rows reproduce DEFAULT_LAYOUT exactly.');
}

await mongoose.disconnect();
process.exit(0);
