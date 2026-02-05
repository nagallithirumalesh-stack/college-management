const PerformanceMetric = require('../models/PerformanceMetric');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceSession = require('../models/AttendanceSession');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Note = require('../models/Note');

exports.getStudentAnalytics = async (req, res) => {
    try {
        const studentId = req.user.id; // Corrected from userId

        // 1. Calculate Attendance %
        const totalSessions = await AttendanceSession.count(); // Ideally filtered by subject
        const attended = await AttendanceRecord.count({
            where: { studentId: studentId, status: 'present' }
        });
        const attendancePct = totalSessions > 0 ? (attended / totalSessions) * 100 : 100;

        // 2. Average Assignment Marks
        const submissions = await Submission.findAll({
            where: { studentId: studentId, status: 'Graded' }
        });
        let totalMarks = 0;

        if (submissions.length > 0) {
            for (let sub of submissions) {
                totalMarks += sub.grade || 0;
            }
        }
        const avgMarks = submissions.length > 0 ? (totalMarks / submissions.length) : 0;

        // 3. Participation (Notes Uploaded)
        const notesCount = await Note.count({ where: { uploadedById: studentId } });
        const partScore = notesCount * 10; // 10 points per note

        // 4. Update/Create Metric
        let metric = await PerformanceMetric.findOne({ where: { studentId: studentId } });

        if (!metric) {
            metric = await PerformanceMetric.create({
                studentId: studentId,
                attendancePercentage: Math.round(attendancePct),
                cpa: Math.round(avgMarks) / 10, // Assuming CPA is roughly related to marks
                creditsEarned: partScore // Mapping logic
            });
        } else {
            metric.attendancePercentage = Math.round(attendancePct);
            // metric.avgAssignmentMarks = Math.round(avgMarks); // Model doesn't have this field?
            // Refactored model has: cpa, attendancePercentage, creditsEarned
            metric.cpa = Math.round(avgMarks) / 10;
            metric.creditsEarned = partScore; // Using credits as score holder
            await metric.save();
        }

        res.json(metric);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
