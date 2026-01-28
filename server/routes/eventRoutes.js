const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const { protect } = require('../middleware/authMiddleware');

// Get all events (optionally filter by date range later)
router.get('/', protect, async (req, res) => {
    try {
        const events = await Event.find().sort({ start: 1 }).populate('organizer', 'name email');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new event
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, resource, start, end } = req.body;

        // Basic validation
        if (new Date(start) >= new Date(end)) {
            return res.status(400).json({ message: "End time must be after start time" });
        }

        const newEvent = new Event({
            title,
            description,
            resource,
            start,
            end,
            organizer: req.user.id,
            status: req.user.role === 'admin' ? 'Approved' : 'Pending'
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete event
router.delete('/:id', protect, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
