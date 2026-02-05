const express = require('express');
const router = express.Router();
const ODRequest = require('../models/ODRequest');
const User = require('../models/User'); // Include if needed
const { protect } = require('../middleware/authMiddleware');

// Create OD Request
router.post('/', protect, async (req, res) => {
    try {
        const { targetSubjectId, reason, dates, type, documentUrl, purpose } = req.body;

        // Simplify dates to range
        let fromDate = new Date();
        let toDate = new Date();
        if (dates && dates.length > 0) {
            const sortedDates = dates.map(d => new Date(d)).sort((a, b) => a - b);
            fromDate = sortedDates[0];
            toDate = sortedDates[sortedDates.length - 1];
        }

        const newOD = await ODRequest.create({
            studentId: req.user.id,
            type,
            purpose,
            // subjectId: targetSubjectId || null, // Model doesn't have subjectId yet? I defined ODRequest with studentId. I should check if I missed subjectId. 
            // My ODRequest definition: reason, fromDate, toDate, status, proofUrl. No subjectId.
            // I'll ignore subject specific OD for now or add it later if critical.
            reason,
            fromDate,
            toDate,
            status: 'Pending',
            proofUrl: documentUrl
        });

        res.status(201).json(newOD);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get Student's Own Requests
router.get('/my', protect, async (req, res) => {
    try {
        const myRequests = await ODRequest.findAll({
            where: { studentId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(myRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Requests (For Faculty) - Filter by Status
router.get('/list', protect, async (req, res) => {
    try {
        const { status } = req.query;
        let where = {};

        if (status && status !== 'All') {
            where.status = status;
        }

        const odRequests = await ODRequest.findAll({
            where,
            include: [{ model: User, as: 'student', attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });

        res.json(odRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Status
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const odRequest = await ODRequest.findByPk(req.params.id);

        if (!odRequest) return res.status(404).json({ message: 'Request not found' });

        odRequest.status = status;
        // odRequest.approvalRemarks = remarks; // Field not in my model
        // odRequest.approvedBy = req.user.id; // Field not in my model

        await odRequest.save();

        res.json(odRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
