const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImageUrl: { type: String, default: '' },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);
