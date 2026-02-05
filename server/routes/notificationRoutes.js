const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// Get my notifications
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        notification.read = true;
        await notification.save();
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark all as read
router.put('/read-all', protect, async (req, res) => {
    try {
        await Notification.update(
            { read: true },
            { where: { userId: req.user.id, read: false } }
        );
        res.json({ message: 'All marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Notification
router.post('/', protect, async (req, res) => {
    try {
        const { recipientId, title, message, type, relatedLink } = req.body;
        const notification = await Notification.create({
            userId: recipientId,
            message: message || title, // Map to message
            type: type || 'info',
            // relatedLink // Model checking: I only defined message, type, read.
        });
        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
