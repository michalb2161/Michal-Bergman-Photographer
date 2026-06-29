const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true, trim: true },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    photoUrl: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
