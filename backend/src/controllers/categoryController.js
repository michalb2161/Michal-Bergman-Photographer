const Category = require('../models/Category');
const { asyncHandler } = require('../utils/asyncHandler');

//רשימת הקטגוריות
const list = asyncHandler(async (req, res) => {
  const items = await Category.find().sort({ sortOrder: 1, nameHe: 1 });
  res.json({ success: true, data: items });
});

//פונקציית שליפה
const getBySlug = asyncHandler(async (req, res) => {
  const item = await Category.findOne({ slug: req.params.slug });
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: item });
});

const create = asyncHandler(async (req, res) => {
  const item = await Category.create(req.body);
  res.status(201).json({ success: true, data: item });
});

const update = asyncHandler(async (req, res) => {
  const item = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: item });
});

const remove = asyncHandler(async (req, res) => {
  const item = await Category.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true });
});

module.exports = { list, getBySlug, create, update, remove };
