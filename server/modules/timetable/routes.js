const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { protect, restrictTo } = require('../../middleware/authMiddleware');

// Get My Schedule (Student)
router.get('/my', protect, restrictTo('student'), controller.getMySchedule);

// Debug: return user, classroom and schedule for troubleshooting
router.get('/debug/my', protect, controller.debugMy);

// Get Teaching Schedule (Faculty)
router.get('/teaching', protect, restrictTo('faculty'), controller.getTeachingSchedule);

// Admin Management
router.post('/', protect, restrictTo('admin'), controller.createSlot);
router.get('/', protect, restrictTo('admin'), controller.getSchedule);

module.exports = router;
