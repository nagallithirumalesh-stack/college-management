const express = require('express');
const router = express.Router();
const { getMyMarks, addMark } = require('../controllers/markController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/my-marks', protect, getMyMarks);
router.post('/', protect, restrictTo('faculty', 'admin'), addMark);

module.exports = router;
