const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../utils/asyncHandler');
const User = require('../models/User');

function protect() {
  return asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'לא מורשה' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return res.status(401).json({ success: false, message: 'משתמש לא נמצא' });
      }
      req.user = user;
      next();
    } catch {
      return res.status(401).json({ success: false, message: 'טוקן לא תקין' });
    }
  });
}

function adminOnly() {
  return (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'נדרשות הרשאות מנהל' });
    }
    next();
  };
}

module.exports = { protect, adminOnly };
