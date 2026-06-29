const mongoose = require('mongoose');

const homepageSectionSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, required: true, unique: true, trim: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    body: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    ctaLabel: { type: String, default: '' },
    ctaHref: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomepageSection', homepageSectionSchema);
