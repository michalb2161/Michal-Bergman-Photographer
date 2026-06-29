const Product = require('../models/Product');
const { asyncHandler } = require('../utils/asyncHandler');

function slugFromTitle(title, explicitSlug) {
  const raw = explicitSlug && String(explicitSlug).trim() ? String(explicitSlug).trim() : String(title || '').trim();
  let s = raw
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u0590-\u05ff-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (s.length >= 2) return s.slice(0, 80);
  return `product-${Date.now()}`;
}

async function uniqueSlug(base) {
  let slug = base;
  let n = 0;
  // eslint-disable-next-line no-await-in-loop
  while (await Product.exists({ slug })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

const list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.visible === 'true') {
    filter.visible = true;
  }
  const items = await Product.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, data: items });
});

const getById = asyncHandler(async (req, res) => {
  const doc = await Product.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: doc });
});

const create = asyncHandler(async (req, res) => {
  const { title, description, price, currency, imageUrl, slug, visible, sortOrder } = req.body;
  if (!title || !String(title).trim()) {
    return res.status(400).json({ success: false, message: 'חובה להזין כותרת' });
  }
  const baseSlug = slugFromTitle(title, slug);
  const unique = await uniqueSlug(baseSlug);
  const doc = await Product.create({
    title: String(title).trim(),
    description: description != null ? String(description) : '',
    price: price != null ? Math.max(0, Number(price)) || 0 : 0,
    currency: currency != null ? String(currency).trim().toUpperCase().slice(0, 3) : 'ILS',
    imageUrl: imageUrl != null ? String(imageUrl).trim() : '',
    slug: unique,
    visible: visible !== false,
    sortOrder: sortOrder != null ? Number(sortOrder) || 0 : 0
  });
  res.status(201).json({ success: true, data: doc });
});

const update = asyncHandler(async (req, res) => {
  const allowed = ['title', 'description', 'price', 'currency', 'imageUrl', 'slug', 'visible', 'sortOrder'];
  const patch = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      patch[key] = req.body[key];
    }
  }
  if (patch.slug != null) {
    patch.slug = String(patch.slug).trim().toLowerCase();
    const exists = await Product.findOne({ slug: patch.slug, _id: { $ne: req.params.id } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'slug כבר בשימוש' });
    }
  }
  if (patch.price != null) {
    patch.price = Math.max(0, Number(patch.price)) || 0;
  }
  if (patch.currency != null) {
    patch.currency = String(patch.currency).trim().toUpperCase().slice(0, 3);
  }
  const doc = await Product.findByIdAndUpdate(req.params.id, { $set: patch }, { new: true, runValidators: true });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: doc });
});

const remove = asyncHandler(async (req, res) => {
  const doc = await Product.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true });
});

module.exports = { list, getById, create, update, remove };
