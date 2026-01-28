const express = require('express');
const router = express.Router();
const ODRequest = require('../models/odRequestModel');
const { protect } = require('../middleware/authMiddleware');

// Create OD Request
router.post('/', protect, async (req, res) => {
    try {
        const { targetSubjectId, reason, dates, type, documentUrl } = req.body;

        const newOD = new ODRequest({
            student: req.user.id,
            subject: targetSubjectId || null, // null = global/all subjects
            type: type || 'OD',
            reason,
            dates: dates.map(d => new Date(d)),
            documents: documentUrl ? [documentUrl] : []
        });

        const savedOD = await newOD.save();
        res.status(201).json(savedOD);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Get Student's Own Requests
router.get('/my', protect, async (req, res) => {
    try {
        const myRequests = await ODRequest.find({ student: req.user.id })
            .populate('subject', 'name code') // Populate subject details
            .sort({ createdAt: -1 });
        res.json(myRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Requests (For Faculty) - Filter by Status
router.get('/list', protect, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        // If status provided, filter by it. Else return all.
        if (status && status !== 'All') {
            query.status = status;
        }

        const odRequests = await ODRequest.find(query)
            .populate('student', 'name email userId')
            .populate('subject', 'name code')
            .sort({ createdAt: -1 });

        res.json(odRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Status
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const odRequest = await ODRequest.findById(req.params.id);

        if (!odRequest) return res.status(404).json({ message: 'Request not found' });

        odRequest.status = status;
        odRequest.approvalRemarks = remarks;
        odRequest.approvedBy = req.user.id;

        await odRequest.save();

        // If Approved, we should ideally create Attendance records marked as 'OD'
        // Skipping that logic for this thin slice to focus on UI flow

        res.json(odRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
