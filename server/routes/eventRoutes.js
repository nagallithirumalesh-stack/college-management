const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User'); // Include user for organizer population

// Get all events
router.get('/', protect, async (req, res) => {
    try {
        const events = await Event.findAll({
            order: [['start', 'ASC']],
            include: [{ model: User, as: 'organizer', attributes: ['name', 'email'] }]
        });
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

        const newEvent = await Event.create({
            title,
            description,
            resource,
            start,
            end,
            organizerId: req.user.id,
            status: req.user.role === 'admin' ? 'Approved' : 'Pending'
        });

        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete event
router.delete('/:id', protect, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        await event.destroy();
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
