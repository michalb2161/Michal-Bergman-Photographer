const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'ILS', trim: true, uppercase: true },
    imageUrl: { type: String, default: '', trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    visible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

productSchema.index({ visible: 1, sortOrder: 1 });

module.exports = mongoose.model('Product', productSchema);
