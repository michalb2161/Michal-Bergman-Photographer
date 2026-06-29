const express = require('express');
const categoryController = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', categoryController.list);
router.get('/slug/:slug', categoryController.getBySlug);
router.post('/', protect(), adminOnly(), categoryController.create);
router.patch('/:id', protect(), adminOnly(), categoryController.update);
router.delete('/:id', protect(), adminOnly(), categoryController.remove);

module.exports = router;
