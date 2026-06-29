const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { summary } = require('../controllers/adminStatsController');

const router = express.Router();

router.use(protect(), adminOnly());
router.get('/stats', summary);

module.exports = router;
