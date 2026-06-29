const express = require('express');
const imageController = require('../controllers/imageController');
const { upload } = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', imageController.list);
router.post('/:id/like', imageController.toggleLike);
router.post(
  '/',
  protect(),
  adminOnly(),
  upload.array('images', 12),
  imageController.createMany
);
router.patch('/:id', protect(), adminOnly(), imageController.update);
router.delete('/:id', protect(), adminOnly(), imageController.remove);

module.exports = router;
