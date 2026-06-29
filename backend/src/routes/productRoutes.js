const express = require('express');
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', productController.list);
router.get('/:id', productController.getById);
router.post('/', protect(), adminOnly(), productController.create);
router.patch('/:id', protect(), adminOnly(), productController.update);
router.delete('/:id', protect(), adminOnly(), productController.remove);

module.exports = router;
