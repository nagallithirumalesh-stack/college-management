const Mark = require('../models/Mark');
const Subject = require('../models/Subject');

// @desc    Get all marks for the logged-in student
// @route   GET /api/marks/my-marks
// @access  Private (Student)
exports.getMyMarks = async (req, res) => {
    try {
        const marks = await Mark.findAll({
            where: { studentId: req.user.id },
            include: [{ model: Subject, as: 'subject', attributes: ['name', 'code'] }],
            order: [['createdAt', 'DESC']]
        });
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

        // Map request fields to model fields
        // Model: examType, marksObtained, maxMarks

        const mark = await Mark.create({
            studentId,
            subjectId,
            examType: assessmentType,
            marksObtained: score,
            maxMarks: maxScore
        });
        res.status(201).json(mark);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
