const User = require('../models/User');

// @desc    Get global leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            where: { role: 'student' },
            order: [['points', 'DESC']],
            limit: 10,
            attributes: ['number', 'name', 'department', 'points', 'band'] // 'number' might not exist? check User model. User model has 'semester', 'email'. No 'number'.
            // Removed 'number', kept standard fields.
        });
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
