const Classroom = require('../models/Classroom');
const User = require('../models/User');
const { StudentFee } = require('../modules/fees/models'); // Modular Import

// @desc    Get My Classroom (for Class Teacher)
// @route   GET /api/classroom/my-class
// @access  Faculty
exports.getMyClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findOne({ where: { classTeacherId: req.user.id } });
        if (!classroom) {
            return res.json(null); // No class assigned
        }

        // Optional: Fetch student count or stats for this class
        const studentCount = await User.count({
            where: {
                department: classroom.department,
                semester: classroom.semester,
                role: 'student'
            }
        });

        res.json({
            ...classroom.toJSON(),
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
        const classroom = await Classroom.findOne({ where: { classTeacherId: req.user.id } });
        if (!classroom) {
            return res.status(404).json({ message: 'No class assigned.' });
        }

        const students = await User.findAll({
            where: {
                department: classroom.department,
                semester: classroom.semester,
                role: 'student'
            },
            attributes: { exclude: ['password'] }
        });

        // Enrich with Fee Data
        // Ideally use 'include' in query, but modular separation makes 'module' import safer or manual join
        const studentIds = students.map(s => s.id);
        const fees = await StudentFee.findAll({
            where: { studentId: studentIds }
        });

        const enrichedStudents = students.map(student => {
            const fee = fees.find(f => f.studentId === student.id);
            return {
                ...student.toJSON(),
                feeStatus: fee ? fee.status : 'UNKNOWN',
                feeDue: fee ? fee.totalAmount - fee.paidAmount : 0
            };
        });

        res.json(enrichedStudents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
