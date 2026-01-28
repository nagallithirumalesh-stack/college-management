const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// Get my notifications
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, recipient: req.user.id });
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
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'All marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Notification (Internal use mostly, or via Postman for testing)
router.post('/', protect, async (req, res) => {
    try {
        const { recipientId, title, message, type, relatedLink } = req.body;
        const notification = new Notification({
            recipient: recipientId,
            title,
            message,
            type,
            relatedLink
        });
        const savedNote = await notification.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
