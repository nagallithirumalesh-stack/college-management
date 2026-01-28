const Classroom = require('../models/Classroom');
const User = require('../models/User');

// @desc    Get My Classroom (for Class Teacher)
// @route   GET /api/classroom/my-class
// @access  Faculty
exports.getMyClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findOne({ classTeacher: req.user._id });
        if (!classroom) {
            return res.json(null); // No class assigned
        }

        // Optional: Fetch student count or stats for this class
        const studentCount = await User.countDocuments({
            department: classroom.department,
            semester: classroom.semester
        });

        res.json({
            ...classroom.toObject(),
            studentCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get Students in My Class
// @route   GET /api/classroom/students
// @access  Faculty
exports.getClassStudents = async (req, res) => {
    try {
        const classroom = await Classroom.findOne({ classTeacher: req.user._id });
        if (!classroom) {
            return res.status(404).json({ message: 'No class assigned.' });
        }

        const students = await User.find({
            department: classroom.department,
            semester: classroom.semester,
            role: 'student'
        }).select('-password');

        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
