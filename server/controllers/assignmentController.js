const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Subject = require('../models/Subject');

// --- Assignments ---

// Create Assignment (Faculty)
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, subjectId, dueAt, totalMarks } = req.body;

        // Verify Subject ownership? (Optional for now)

        const assignment = await Assignment.create({
            title,
            description,
            subject: subjectId,
            dueAt,
            totalMarks,
            createdBy: req.user._id,
            attachments: req.file ? [req.file.path] : [] // Simple file handling
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Assignments by Subject
exports.getAssignmentsBySubject = async (req, res) => {
    try {
        const assignments = await Assignment.find({ subject: req.params.subjectId })
            .sort({ dueAt: 1 }); // Soonest first
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Submissions ---

// Submit Assignment (Student)
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId, textContent } = req.body;

        // Check if late
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

        const isLate = new Date() > new Date(assignment.dueAt);

        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user._id,
            textContent,
            fileUrl: req.file ? req.file.path : null, // Assuming multer middleware
            status: isLate ? 'late' : 'submitted'
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Submissions for an Assignment (Faculty)
exports.getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ assignment: req.params.assignmentId })
            .populate('student', 'name email rollNumber');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Grade Submission (Faculty)
exports.gradeSubmission = async (req, res) => {
    try {
        const { marks, feedback } = req.body;
        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { marks, feedback, status: 'graded' },
            { new: true }
        );
        res.json(submission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
