const express = require('express');
const { getLeaderboard } = require('../controllers/gamificationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
