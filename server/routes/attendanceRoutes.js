const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const controller = require('../controllers/attendanceController');

// Student Stats
router.get('/stats/:studentId', protect, async (req, res) => {
    // Keep existing inline stats logic or move to controller if preferred. 
    // For now, let's keep the existing complex stats aggregation here or import if moved.
    // The controller didn't have this specific "stats" method in the view I saw, 
    // so I will leave this inline block OR check if I should move it. 
    // The user wants "how much student has attendance". 
    // Let's assume the inline logic from step 1906 is good for /stats/:studentId.
    // BUT I need to add the other routes.

    // Actually, to avoid mixing, let's just add the new routes and keep stats inline for now unless I see a conflict.
    // Wait, I can't overwrite the file easily if I don't provide the full content or precise range.
    // I'll replace the whole file to clean it up and map everything.

    // However, I need to make sure the "stats" logic is preserved if it's not in controller.
    // Controller has: startSession, markAttendance, getReport.
    // It DOES NOT have getStudentStats.

    // So I will:
    // 1. Mount controller methods.
    // 2. Keep /stats/:studentId inline (or move to controller in a separate step, but inline is fine).
    // 3. Replace /mark-qr inline with controller.markAttendance.

    try {
        const studentId = req.params.studentId;
        const AttendanceSession = require('../models/AttendanceSession');
        const AttendanceRecord = require('../models/AttendanceRecord');
        const Subject = require('../models/Subject');

        const subjects = await Subject.find({});
        const subjectStats = [];
        let totalClassesAll = 0;
        let totalAttendedAll = 0;

        for (const sub of subjects) {
            // Count total sessions for this subject
            // We count ALL sessions that are inactive (finished) or active? 
            // Usually valid sessions.
            const totalSessions = await AttendanceSession.countDocuments({ subject: sub._id });

            const attendedCount = await AttendanceRecord.countDocuments({
                student: studentId,
                status: 'present',
                session: { $in: await AttendanceSession.find({ subject: sub._id }).distinct('_id') }
            });

            if (totalSessions >= 0) { // even if 0, show it
                const percentage = totalSessions === 0 ? 0 : Math.round((attendedCount / totalSessions) * 100);
                subjectStats.push({
                    subjectId: sub._id,
                    name: sub.name,
                    percentage,
                    attended: attendedCount,
                    total: totalSessions
                });
                totalClassesAll += totalSessions;
                totalAttendedAll += attendedCount;
            }
        }

        const overallPercentage = totalClassesAll > 0 ? Math.round((totalAttendedAll / totalClassesAll) * 100) : 100;

        res.json({
            overallPercentage,
            subjectWise: subjectStats
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Faculty: Start Session
router.post('/session/start', protect, controller.startSession);

// Faculty: Get Report (Live Stats)
router.get('/report/:sessionId', protect, controller.getReport);

// Faculty: Get Subject Stats (Student List)
router.get('/subject/:subjectId/stats', protect, controller.getSubjectStats);

// Student: Mark Attendance
router.post('/mark-qr', protect, controller.markAttendance);

module.exports = router;
