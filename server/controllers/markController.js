const Mark = require('../models/Mark');

// @desc    Get all marks for the logged-in student
// @route   GET /api/marks/my-marks
// @access  Private (Student)
exports.getMyMarks = async (req, res) => {
    try {
        const marks = await Mark.find({ student: req.user.userId })
            .populate('subject', 'name code')
            .sort({ createdAt: -1 });
        res.json(marks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a mark (For internal use or Teacher)
// @route   POST /api/marks
// @access  Private (Faculty/Admin)
exports.addMark = async (req, res) => {
    try {
        const { studentId, subjectId, assessmentType, score, maxScore } = req.body;
        const mark = await Mark.create({
            student: studentId,
            subject: subjectId,
            assessmentType,
            score,
            maxScore
        });
        res.status(201).json(mark);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
