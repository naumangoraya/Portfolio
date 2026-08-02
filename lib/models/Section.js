import mongoose from 'mongoose';

/**
 * A section *instance* on the home page.
 *
 * This collection owns LAYOUT, not content:
 *   - `source: 'builtin'` rows wrap the eight existing components. Their content
 *     stays in Hero/About/Job/Service/Project/Education/Contact exactly as
 *     before; the row only owns order, visibility, nav and title. Nothing about
 *     the existing collections changes, which is what makes this additive.
 *   - `source: 'custom'` rows own their content inline as `content.blocks`,
 *     validated by lib/schemas/blocks.js.
 *
 * If this collection is empty or unreachable, lib/sections/registry.js falls
 * back to a code-defined layout, so the page renders correctly before the seed
 * has ever run.
 */
const sectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    // 'hero' | 'about' | ... for builtins, or 'custom'
    type: { type: String, required: true, trim: true },
    source: { type: String, enum: ['builtin', 'custom'], default: 'custom' },

    // '' means "let the component keep its own hardcoded heading"
    title: { type: String, default: '' },

    // DOM id used by nav anchors. '' means the section renders no id.
    anchorId: { type: String, default: '' },

    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },

    navLabel: { type: String, default: '' },
    navVisible: { type: Boolean, default: false },

    // Whether the h2 gets .numbered-heading. The site's 01./02./03. numbers come
    // from a CSS counter with no reset, so this plus DOM order decides them.
    numbered: { type: Boolean, default: false },

    content: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ blocks: [] }),
    },
  },
  { timestamps: true }
);

sectionSchema.index({ visible: 1, status: 1, order: 1 });
sectionSchema.index({ order: 1 });

export default mongoose.models.Section || mongoose.model('Section', sectionSchema);
