const PerformanceMetric = require('../models/PerformanceMetric');
const AttendanceRecord = require('../models/AttendanceRecord');
const Submission = require('../models/submissionModel');
const Assignment = require('../models/assignmentModel');
const Note = require('../models/Note');

exports.getStudentAnalytics = async (req, res) => {
    try {
        const studentId = req.user.userId;

        // 1. Calculate Attendance %
        // In a real app, we'd count total sessions for their subjects. 
        // For now, we take total sessions marked vs total existing sessions (simplified).
        const totalSessions = await mongoose.model('AttendanceSession').countDocuments(); // Ideally filtered by subject
        const attended = await AttendanceRecord.countDocuments({ student: studentId, status: 'present' });
        const attendancePct = totalSessions > 0 ? (attended / totalSessions) * 100 : 100;

        // 2. Average Assignment Marks
        const submissions = await Submission.find({ student: studentId, status: 'Graded' });
        let totalMarks = 0;
        let maxTotal = 0;

        // Simple Average (ignoring different max marks per assignment for simplicity, just average raw score)
        // Better: (Total Obtained / Total Possible) * 100
        if (submissions.length > 0) {
            for (let sub of submissions) {
                totalMarks += sub.grade || 0;
                // Ideally fetch assignment max marks, but assuming 100 or stored on submission
            }
            // Let's count avg raw marks for now
        }
        const avgMarks = submissions.length > 0 ? (totalMarks / submissions.length) : 0;

        // 3. Participation (Notes Uploaded)
        const notesCount = await Note.countDocuments({ uploadedBy: studentId });
        const partScore = notesCount * 10; // 10 points per note

        // 4. Update/Create Metric
        let metric = await PerformanceMetric.findOne({ student: studentId });
        if (!metric) {
            metric = new PerformanceMetric({ student: studentId });
        }

        metric.attendancePercentage = Math.round(attendancePct);
        metric.avgAssignmentMarks = Math.round(avgMarks);
        metric.participationScore = partScore;

        // Add history point (daily snapshot logic would go here)
        // metric.history.push({ score: (attendancePct + avgMarks)/2 });

        await metric.save();

        res.json(metric);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const mongoose = require('mongoose');
