const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    alt: { type: String, default: '', trim: true },
    description: { type: String, default: '' },
    url: { type: String, required: true },
    thumbUrl: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    featured: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0, min: 0 },
    sortOrder: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    mimeType: { type: String, default: 'image/webp' }
  },
  { timestamps: true }
);

imageSchema.index({ category: 1, createdAt: -1 });
imageSchema.index({ featured: 1 });

module.exports = mongoose.model('Image', imageSchema);
