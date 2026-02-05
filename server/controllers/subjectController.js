const Subject = require('../models/Subject');
const User = require('../models/User');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
exports.getSubjects = async (req, res) => {
    try {
        let whereClause = {};

        // If student, filter by their department and semester
        if (req.user.role === 'student') {
            whereClause = {
                department: req.user.department,
                semester: req.user.semester
            };
        }

        const subjects = await Subject.findAll({
            where: whereClause,
            include: [{ model: User, as: 'faculty', attributes: ['name', 'email'] }]
        });
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
        const subject = await Subject.create({
            name,
            code,
            department,
            semester,
            facultyId
        });

        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all faculties
// @route   GET /api/subjects/faculties
// @access  Admin
exports.getFaculties = async (req, res) => {
    try {
        const faculties = await User.findAll({
            where: { role: 'faculty' },
            attributes: ['id', 'name', 'email']
        });
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
        const subject = await Subject.findByPk(req.params.id, {
            include: [{ model: User, as: 'faculty', attributes: ['name', 'email'] }]
        });

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my subjects (student-specific)
// @route   GET /api/subjects/my
// @access  Student
exports.getMySubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            where: {
                department: req.user.department,
                semester: req.user.semester
            },
            include: [{ model: User, as: 'faculty', attributes: ['name', 'email'] }]
        });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

