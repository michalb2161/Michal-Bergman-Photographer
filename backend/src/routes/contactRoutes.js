const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('username').optional().trim().isLength({ min: 2 }),
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('message').trim().notEmpty().isLength({ min: 10 })
  ],
  contactController.create
);

router.get('/history/:username', contactController.historyByUsername);
router.patch(
  '/history/:username/:id',
  [body('message').trim().notEmpty().isLength({ min: 10 })],
  contactController.updateFromHistory
);
router.delete('/history/:username/:id', contactController.removeFromHistory);
router.delete('/public/:id', contactController.removeFromHistory);
router.get('/', protect(), adminOnly(), contactController.list);
router.patch('/:id/read', protect(), adminOnly(), contactController.markRead);
router.delete('/:id', protect(), adminOnly(), contactController.remove);

module.exports = router;
