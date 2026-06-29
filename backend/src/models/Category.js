const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    nameHe: { type: String, required: true, trim: true },
    nameEn: { type: String, trim: true, default: '' },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    coverImageUrl: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
