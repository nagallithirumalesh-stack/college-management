const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const controller = require('../controllers/classroomController');

router.get('/my-class', protect, restrictTo('faculty'), controller.getMyClassroom);
router.get('/students', protect, restrictTo('faculty'), controller.getClassStudents);

module.exports = router;
