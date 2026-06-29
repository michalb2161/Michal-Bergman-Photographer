const express = require('express');
const testimonialController = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/public', testimonialController.listPublic);
router.get('/', protect(), adminOnly(), testimonialController.listAdmin);
router.post('/', protect(), adminOnly(), testimonialController.create);
router.patch('/:id', protect(), adminOnly(), testimonialController.update);
router.delete('/:id', protect(), adminOnly(), testimonialController.remove);

module.exports = router;
