const Testimonial = require('../models/Testimonial');
const { asyncHandler } = require('../utils/asyncHandler');

const listPublic = asyncHandler(async (req, res) => {
  const items = await Testimonial.find({ visible: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, data: items });
});

const listAdmin = asyncHandler(async (req, res) => {
  const items = await Testimonial.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json({ success: true, data: items });
});

const create = asyncHandler(async (req, res) => {
  const item = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: item });
});

const update = asyncHandler(async (req, res) => {
  const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: item });
});

const remove = asyncHandler(async (req, res) => {
  const item = await Testimonial.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true });
});

module.exports = { listPublic, listAdmin, create, update, remove };
