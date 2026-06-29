const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024, files: 12 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('רק קבצי תמונה מותרים'));
    }
    cb(null, true);
  }
});

module.exports = { upload };
