const { validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const { asyncHandler } = require('../utils/asyncHandler');
const { sendContactNotification } = require('../services/emailService');

function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase();
}

const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { name, email, phone, message } = req.body;
  const username = normalizeUsername(req.body.username || email);
  const doc = await ContactMessage.create({ username, name, email, phone, message });
  let emailStatus = { sent: false };
  try {
    emailStatus = await sendContactNotification({ name, email, phone, message });
  } catch (e) {
    emailStatus = { sent: false, error: String(e.message || e) };
  }
  res.status(201).json({ success: true, data: { id: doc._id, username }, email: emailStatus });
});

const historyByUsername = asyncHandler(async (req, res) => {
  const username = normalizeUsername(req.params.username);
  if (!username) {
    return res.status(400).json({ success: false, message: 'חובה להזין שם משתמש' });
  }
  const items = await ContactMessage.find({ username })
    .sort({ createdAt: -1 })
    .select('username name email phone message read createdAt updatedAt');
  res.json({ success: true, data: items });
});

const updateFromHistory = asyncHandler(async (req, res) => {
  const message = String(req.body.message || '').trim();
  if (message.length < 10) {
    return res.status(400).json({ success: false, message: 'נא לכתוב לפחות 10 תווים' });
  }
  const doc = await ContactMessage.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { message, read: false } },
    { new: true }
  ).select('username name email phone message read createdAt updatedAt');
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: doc });
});

const removeFromHistory = asyncHandler(async (req, res) => {
  const doc = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true });
});

const list = asyncHandler(async (req, res) => {
  const items = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

const markRead = asyncHandler(async (req, res) => {
  const doc = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true, data: doc });
});

const remove = asyncHandler(async (req, res) => {
  const doc = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'לא נמצא' });
  }
  res.json({ success: true });
});

module.exports = {
  create,
  historyByUsername,
  updateFromHistory,
  removeFromHistory,
  list,
  markRead,
  remove
};
