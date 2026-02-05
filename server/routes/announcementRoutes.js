const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const User = require('../models/User'); // For include
const { protect, restrictTo } = require('../middleware/authMiddleware');
// const { Op } = require('sequelize');

// @desc    Get all announcements
// @route   GET /api/announcements
router.get('/', protect, async (req, res) => {
    try {
        const { type } = req.query;
        let where = {};

        const allAnnouncements = await Announcement.findAll({
            where: {
                // type: type // handled later
            },
            order: [['createdAt', 'DESC']]
            // include: ... (Decoupled, manual fetch if needed)
        });

        const announcements = allAnnouncements.filter(a => {
            let matchType = true;
            if (type) matchType = a.type === type;

            let matchAudience = true;
            if (req.user.role === 'student') {
                matchAudience = ['All', 'Student'].includes(a.targetAudience);
            } else if (req.user.role === 'faculty') {
                matchAudience = ['All', 'Faculty'].includes(a.targetAudience);
            }
            return matchType && matchAudience;
        });

        res.json(announcements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create Announcement
// @route   POST /api/announcements
// @access  Faculty/Admin
router.post('/', protect, restrictTo('admin', 'faculty'), async (req, res) => {
    try {
        const { title, content, type, targetAudience, department } = req.body;

        const announcement = await Announcement.create({
            title,
            content,
            type,
            targetAudience,
            department,
            createdById: req.user.id
        });

        res.status(201).json(announcement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Delete Announcement
// @route   DELETE /api/announcements/:id
// @access  Faculty/Admin
router.delete('/:id', protect, restrictTo('admin', 'faculty'), async (req, res) => {
    try {
        const announcement = await Announcement.findByPk(req.params.id);
        if (!announcement) return res.status(404).json({ message: 'Not found' });

        // Only Admin or the Creator can delete
        // Note: createdById is integer/string. req.user.id is integer/string.
        if (req.user.role !== 'admin' && announcement.createdById !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await announcement.destroy();
        res.json({ message: 'Announcement removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
