const User = require('../models/User');

// @desc    Get global leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({ role: 'student' })
            .sort({ points: -1 })
            .limit(10)
            .select('name department points band');
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
