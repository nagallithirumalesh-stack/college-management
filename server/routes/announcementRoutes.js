const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// @desc    Get all announcements
// @route   GET /api/announcements
router.get('/', protect, async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        // Basic filtering
        if (type) query.type = type;

        // Role based filtering (Students shouldn't see faculty-only circulars)
        if (req.user.role === 'student') {
            query.targetAudience = { $in: ['All', 'Student'] };
        } else if (req.user.role === 'faculty') {
            query.targetAudience = { $in: ['All', 'Faculty'] };
        }

        const announcements = await Announcement.find(query)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name role');

        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create Announcement
// @route   POST /api/announcements
// @access  Faculty/Admin
router.post('/', protect, restrictTo('admin', 'faculty'), async (req, res) => {
    try {
        const { title, content, type, targetAudience, department } = req.body;

        const announcement = new Announcement({
            title,
            content,
            type,
            targetAudience,
            department,
            createdBy: req.user.id
        });

        const savedAnnouncement = await announcement.save();
        res.status(201).json(savedAnnouncement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Delete Announcement
// @route   DELETE /api/announcements/:id
// @access  Faculty/Admin
router.delete('/:id', protect, restrictTo('admin', 'faculty'), async (req, res) => {
    try {
        // Find announcement
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) return res.status(404).json({ message: 'Not found' });

        // Only Admin or the Creator can delete
        if (req.user.role !== 'admin' && announcement.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
