const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const controller = require('../controllers/attendanceController');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Subject = require('../models/Subject');
// const { Op } = require('sequelize');

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Student Stats
router.get('/stats/:studentId', protect, async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const subjects = await Subject.findAll({});
        const subjectStats = [];
        let totalClassesAll = 0;
        let totalAttendedAll = 0;

        for (const sub of subjects) {
            // Count total sessions for this subject
            const totalSessions = await AttendanceSession.count({
                where: { subjectId: sub.id }
            });

            // Get session IDs for this subject
            const sessions = await AttendanceSession.findAll({
                where: { subjectId: sub.id },
                attributes: ['id']
            });
            const sessionIds = sessions.map(s => s.id);

            const allRecords = await AttendanceRecord.findAll({
                where: {
                    studentId: studentId,
                    status: 'present'
                }
            });
            const attendedCount = allRecords.filter(r => sessionIds.includes(r.sessionId)).length;

            if (totalSessions >= 0) { // even if 0, show it
                const percentage = totalSessions === 0 ? 0 : Math.round((attendedCount / totalSessions) * 100);
                subjectStats.push({
                    subjectId: sub.id,
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
router.get('/session/:sessionId/report', protect, controller.getReport);

// Faculty: Get Subject Stats (Student List)
router.get('/subject/:subjectId/stats', protect, controller.getSubjectStats);

// Student: Mark Attendance
router.post('/mark', protect, controller.markAttendance);



// Faculty: Get Attendance Grid
router.get('/subject/:subjectId/grid', protect, controller.getAttendanceGrid);

// Faculty: Get Manual Attendance List
router.get('/manual-list', protect, controller.getManualList);

// Faculty: Save Manual Session (Bulk)
router.post('/manual-save', protect, controller.saveManualSession);

// Faculty: Toggle Attendance (Single)
router.post('/toggle', protect, controller.toggleAttendance);

// Excel Export Routes
router.get('/export/session/:sessionId', protect, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const records = await AttendanceRecord.findAll({
            where: { sessionId },
            include: [
                { model: AttendanceSession, as: 'session', include: [{ model: Subject, as: 'subject' }] },
                { model: require('../models/User'), as: 'student' }
            ]
        });

        const buffer = exportAttendanceReport(records);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=attendance_session_${sessionId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/export/subject/:subjectId/summary', protect, async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Get total sessions for this subject
        const totalSessions = await AttendanceSession.count({ where: { subjectId } });

        // Get All Students
        const students = await require('../models/User').findAll({
            where: { role: 'student' },
            attributes: ['id', 'name', 'email']
        });

        // Get all sessions for this subject to filter records
        const sessions = await AttendanceSession.findAll({
            where: { subjectId },
            attributes: ['id']
        });
        const sessionIds = sessions.map(s => s.id);

        const report = [];

        for (const student of students) {
            // Count attended sessions
            const allStudentRecords = await AttendanceRecord.findAll({
                where: {
                    studentId: student.id,
                    status: 'present'
                }
            });
            const attendedCount = allStudentRecords.filter(r => sessionIds.includes(r.sessionId)).length;

            report.push({
                id: student.id,
                name: student.name,
                rollNumber: student.email, // Using email as roll number for now
                department: student.department || 'N/A',
                year: student.year || 'N/A',
                section: student.section || 'N/A',
                attended: attendedCount,
                total: totalSessions,
                percentage: totalSessions === 0 ? 0 : Math.round((attendedCount / totalSessions) * 100)
            });
        }

        const buffer = exportStudentSummaryReport(report);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=subject_summary_${subjectId}.xlsx`);
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

