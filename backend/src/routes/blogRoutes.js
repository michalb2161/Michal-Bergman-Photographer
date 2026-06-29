const express = require('express');
const blogController = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/public', blogController.listPublic);
router.get('/public/:slug', blogController.getBySlug);
router.get('/', protect(), adminOnly(), blogController.listAdmin);
router.post('/', protect(), adminOnly(), blogController.create);
router.patch('/:id', protect(), adminOnly(), blogController.update);
router.delete('/:id', protect(), adminOnly(), blogController.remove);

module.exports = router;
