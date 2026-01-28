const express = require('express');
const { getSubjects, createSubject, getFaculties, getSubjectById } = require('../controllers/subjectController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getSubjects) // Students/Faculty need to see subjects too
    .post(protect, restrictTo('admin'), createSubject);


router.route('/faculties')
    .get(protect, restrictTo('admin'), getFaculties);

router.route('/:id')
    .get(protect, getSubjectById);

module.exports = router;
