const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
// const { Op } = require('sequelize');

// File Upload Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// @desc    Create Assignment
// @route   POST /api/assignments
// @access  Faculty
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        const { title, description, subjectId, dueDate, maxMarks } = req.body;

        const assignment = await Assignment.create({
            title,
            description,
            subjectId,
            facultyId: req.user.id,
            dueDate: new Date(dueDate),
            maxMarks: maxMarks || 100,
            fileUrl: req.file ? req.file.path : null
        });

        res.status(201).json(assignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get Assignments by Subject
// @route   GET /api/assignments/subject/:subjectId
router.get('/subject/:subjectId', protect, async (req, res) => {
    try {
        const assignments = await Assignment.findAll({
            where: { subjectId: req.params.subjectId },
            order: [['dueDate', 'ASC']]
        });

        // Include submission status if Student
        if (req.user.role === 'student') {
            const assignmentIds = assignments.map(a => a.id);
            const allSubmissions = await Submission.findAll({
                where: {
                    studentId: req.user.id
                }
            });
            const submissions = allSubmissions.filter(s => assignmentIds.includes(s.assignmentId));

            const result = assignments.map(a => {
                const sub = submissions.find(s => s.assignmentId === a.id);
                return { ...a.toJSON(), submission: sub || null };
            });
            return res.json(result);
        }

        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Submit Assignment
// @route   POST /api/assignments/submit
// @access  Student
router.post('/submit', protect, upload.single('file'), async (req, res) => {
    try {
        const { assignmentId } = req.body;

        if (!req.file) return res.status(400).json({ message: 'File is required' });

        // Check if already submitted
        const existing = await Submission.findOne({
            where: { assignmentId, studentId: req.user.id }
        });
        if (existing) return res.status(400).json({ message: 'Already submitted' });

        const submission = await Submission.create({
            assignmentId,
            studentId: req.user.id,
            fileUrl: req.file.path
        });

        res.status(201).json(submission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get Submissions for an Assignment
// @route   GET /api/assignments/submissions/:assignmentId
// @access  Faculty
router.get('/submissions/:assignmentId', protect, async (req, res) => {
    try {
        const submissions = await Submission.findAll({
            where: { assignmentId: req.params.assignmentId },
            // include: ['student'],
            order: [['submittedAt', 'ASC']]
        });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Grade Submission
// @route   PATCH /api/assignments/submissions/:id/grade
// @access  Faculty
router.patch('/submissions/:id/grade', protect, async (req, res) => {
    try {
        const { grade, feedback } = req.body;

        const submission = await Submission.findByPk(req.params.id);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'Graded';

        await submission.save();
        res.json(submission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
