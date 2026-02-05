const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../../middleware/authMiddleware');
const { getMyFees, payFee, createFeeStructure, assignStructureRun, getAdminStats, getFeeStructures, getAllTransactions } = require('./controller');

// Student Routes
router.get('/my', protect, restrictTo('student'), getMyFees);
router.post('/pay', protect, restrictTo('student'), payFee);

// Admin Routes
// Admin Routes
router.post('/structure', protect, restrictTo('admin'), createFeeStructure);
router.get('/structures', protect, restrictTo('admin'), getFeeStructures); // List templates
router.post('/assign-bulk', protect, restrictTo('admin'), assignStructureRun);
router.get('/stats', protect, restrictTo('admin'), getAdminStats);
router.get('/transactions', protect, restrictTo('admin'), getAllTransactions); // Global history

module.exports = router;
