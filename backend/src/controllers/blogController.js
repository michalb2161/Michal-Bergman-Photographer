const BlogPost = require('../models/BlogPost');
const { asyncHandler } = require('../utils/asyncHandler');

const listPublic = asyncHandler(async (req, res) => {
  const items = await BlogPost.find({ published: true })
    .sort({ publishedAt: -1, createdAt: -1 })
    .select('-content');
  res.json({ success: true, data: items });
});

const listAdmin = asyncHandler(async (req, res) => {
  const items = await BlogPost.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

const getBySlug = asyncHandler(async (req, res) => {
  const item = await BlogPost.findOne({ slug: req.params.slug, published: true });
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: item });
});

const create = asyncHandler(async (req, res) => {
  const item = await BlogPost.create(req.body);
  res.status(201).json({ success: true, data: item });
});

const update = asyncHandler(async (req, res) => {
  const item = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: item });
});

const remove = asyncHandler(async (req, res) => {
  const item = await BlogPost.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true });
});

module.exports = { listPublic, listAdmin, getBySlug, create, update, remove };
