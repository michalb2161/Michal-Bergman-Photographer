const HomepageSection = require('../models/HomepageSection');
const { asyncHandler } = require('../utils/asyncHandler');

const listPublic = asyncHandler(async (req, res) => {
  const items = await HomepageSection.find({ visible: true }).sort({ sortOrder: 1 });
  res.json({ success: true, data: items });
});

const listAdmin = asyncHandler(async (req, res) => {
  const items = await HomepageSection.find().sort({ sortOrder: 1 });
  res.json({ success: true, data: items });
});

const upsert = asyncHandler(async (req, res) => {
  const { sectionKey, ...rest } = req.body;
  if (!sectionKey) {
    return res.status(400).json({ success: false, message: 'חסר מפתח מקטע' });
  }
  const item = await HomepageSection.findOneAndUpdate(
    { sectionKey },
    { sectionKey, ...rest },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json({ success: true, data: item });
});

const update = asyncHandler(async (req, res) => {
  const item = await HomepageSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: item });
});

const remove = asyncHandler(async (req, res) => {
  const item = await HomepageSection.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true });
});

module.exports = { listPublic, listAdmin, upsert, update, remove };
