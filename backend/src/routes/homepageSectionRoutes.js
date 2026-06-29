const express = require('express');
const homepageSectionController = require('../controllers/homepageSectionController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/public', homepageSectionController.listPublic);
router.get('/', protect(), adminOnly(), homepageSectionController.listAdmin);
router.put('/upsert', protect(), adminOnly(), homepageSectionController.upsert);
router.patch('/:id', protect(), adminOnly(), homepageSectionController.update);
router.delete('/:id', protect(), adminOnly(), homepageSectionController.remove);

module.exports = router;
