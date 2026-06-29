const { validationResult } = require('express-validator');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { asyncHandler } = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  if (process.env.REGISTER_ENABLED !== 'true') {
    return res.status(403).json({ success: false, message: 'הרשמה סגורה' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { name, password } = req.body;
  const email = String(req.body.email || '').trim().toLowerCase();
  const username = email;
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(400).json({ success: false, message: 'האימייל כבר בשימוש' });
  }
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, username, email, passwordHash, role: 'user' });
  const token = signToken(user._id);
  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role }
  });
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { password } = req.body;
  const identifier = String(req.body.identifier || req.body.email || '').trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  }).select('+passwordHash');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'פרטי התחברות שגויים' });
  }
  const token = signToken(user._id);
  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = { register, login, me };
