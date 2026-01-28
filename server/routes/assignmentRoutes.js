const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignmentModel');
const Submission = require('../models/submissionModel');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

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

        const assignment = new Assignment({
            title,
            description,
            subject: subjectId,
            faculty: req.user.id,
            dueDate: new Date(dueDate),
            maxMarks: maxMarks || 100,
            fileUrl: req.file ? req.file.path : null
        });

        const savedAssignment = await assignment.save();
        res.status(201).json(savedAssignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get Assignments by Subject
// @route   GET /api/assignments/subject/:subjectId
router.get('/subject/:subjectId', protect, async (req, res) => {
    try {
        const assignments = await Assignment.find({ subject: req.params.subjectId })
            .sort({ dueDate: 1 });

        // Include submission status if Student
        if (req.user.role === 'student') {
            const submissions = await Submission.find({
                student: req.user.id,
                assignment: { $in: assignments.map(a => a._id) }
            });

            const result = assignments.map(a => {
                const sub = submissions.find(s => s.assignment.toString() === a._id.toString());
                return { ...a.toObject(), submission: sub || null };
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
        const existing = await Submission.findOne({ assignment: assignmentId, student: req.user.id });
        if (existing) return res.status(400).json({ message: 'Already submitted' });

        const submission = new Submission({
            assignment: assignmentId,
            student: req.user.id,
            fileUrl: req.file.path
        });

        const savedSubmission = await submission.save();
        res.status(201).json(savedSubmission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get Submissions for an Assignment
// @route   GET /api/assignments/submissions/:assignmentId
// @access  Faculty
router.get('/submissions/:assignmentId', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({ assignment: req.params.assignmentId })
            .populate('student', 'name email')
            .sort({ submittedAt: 1 });
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

        const submission = await Submission.findById(req.params.id);
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
