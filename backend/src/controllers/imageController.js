const Image = require('../models/Image');
const { asyncHandler } = require('../utils/asyncHandler');
const { processAndSaveImage } = require('../services/imageService');

const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 48));
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.featured === 'true') {
    filter.featured = true;
  }
  const [items, total] = await Promise.all([
    Image.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'nameHe slug'),
    Image.countDocuments(filter)
  ]);
  res.json({ success: true, data: items, page, limit, total, hasMore: page * limit < total });
});

const createMany = asyncHandler(async (req, res) => {
  const files = req.files || [];
  if (!files.length) {
    return res.status(400).json({ success: false, message: 'לא הועלו קבצים' });
  }
  const category =
    req.body.category && String(req.body.category).trim() !== '' ? req.body.category : null;
  const featured = req.body.featured === 'true';
  const created = [];
  for (const file of files) {
    const saved = await processAndSaveImage(file.buffer);
    const doc = await Image.create({
      title: file.originalname || '',
      alt: req.body.alt || '',
      url: saved.url,
      thumbUrl: saved.thumbUrl,
      category: category || null,
      featured,
      width: saved.width,
      height: saved.height
    });
    created.push(await doc.populate('category', 'nameHe slug'));
  }
  res.status(201).json({ success: true, data: created });
});

const update = asyncHandler(async (req, res) => {
  const doc = await Image.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(
    'category',
    'nameHe slug'
  );
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: doc });
});

const remove = asyncHandler(async (req, res) => {
  const doc = await Image.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true });
});

const toggleLike = asyncHandler(async (req, res) => {
  const liked = req.body?.liked === true;
  const doc = await Image.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  const current = Number(doc.likeCount || 0);
  doc.likeCount = liked ? current + 1 : Math.max(0, current - 1);
  await doc.save();
  res.json({ success: true, data: { _id: doc._id, likeCount: doc.likeCount, liked } });
});

module.exports = { list, createMany, update, remove, toggleLike };
