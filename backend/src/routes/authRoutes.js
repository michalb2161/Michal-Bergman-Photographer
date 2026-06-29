const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('name').optional().isString()
  ],
  register
);

router.post(
  '/login',
  [
    body('identifier').optional().trim().isLength({ min: 2 }),
    body('email').optional().isString().trim().isLength({ min: 2 }),
    body().custom((value) => {
      if (!value.identifier && !value.email) {
        throw new Error('identifier or email is required');
      }
      return true;
    }),
    body('password').isLength({ min: 6 })
  ],
  login
);

router.get('/me', protect(), me);

module.exports = router;
