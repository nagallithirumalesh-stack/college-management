const Subject = require('../models/Subject');
const User = require('../models/User');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('faculty', 'name email');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Admin
exports.createSubject = async (req, res) => {
    const { name, code, department, semester, facultyId } = req.body;

    try {
        const subject = new Subject({
            name,
            code,
            department,
            semester,
            faculty: facultyId
        });

        const createdSubject = await subject.save();
        res.status(201).json(createdSubject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all faculties
// @route   GET /api/subjects/faculties
// @access  Admin
exports.getFaculties = async (req, res) => {
    try {
        const faculties = await User.find({ role: 'faculty' }).select('name email');
        res.json(faculties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get single subject by ID
// @route   GET /api/subjects/:id
// @access  Private
exports.getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id).populate('faculty', 'name email');
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
