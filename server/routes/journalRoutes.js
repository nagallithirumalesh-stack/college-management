const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get journal history
// @route   GET /api/journal
router.get('/', protect, async (req, res) => {
    try {
        const journals = await Journal.findAll({
            where: { userId: req.user.id },
            order: [['date', 'DESC']]
        });
        res.json(journals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create a journal entry
// @route   POST /api/journal
router.post('/', protect, async (req, res) => {
    try {
        const { title, content, mood, date } = req.body;
        const journal = await Journal.create({
            userId: req.user.id,
            title,
            content,
            mood,
            date: date || new Date()
        });
        res.status(201).json(journal);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
