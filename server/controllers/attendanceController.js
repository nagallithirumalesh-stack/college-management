const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const crypto = require('crypto');

// Utility: Haversine Formula for distance in meters
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Distance in meters
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// 1. Start Session (Faculty)
exports.startSession = async (req, res) => {
    try {
        const { subjectId, latitude, longitude, radius } = req.body;

        // Generate random session code
        const qrCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        const session = await AttendanceSession.create({
            subject: subjectId,
            faculty: req.user._id,
            qrCode,
            active: true,
            geofence: {
                latitude: latitude || 12.9716, // Default Mock (Bangalore)
                longitude: longitude || 77.5946,
                radius: radius || 200
            },
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins active
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Mark Attendance (Student)
exports.markAttendance = async (req, res) => {
    try {
        const { qrCode, latitude, longitude } = req.body;

        // Find Active Session
        const session = await AttendanceSession.findOne({ qrCode, active: true });
        if (!session) return res.status(404).json({ error: 'Invalid or Expired QR Code' });

        // Check Geofence
        const distance = getDistanceFromLatLonInM(
            session.geofence.latitude,
            session.geofence.longitude,
            latitude,
            longitude
        );

        if (distance > session.geofence.radius) {
            return res.status(403).json({
                error: 'Attendance Failed: You are outside the campus geofence.',
                distance: Math.round(distance)
            });
        }

        // Record Attendance
        const record = await AttendanceRecord.create({
            session: session._id,
            student: req.user._id,
            status: 'present',
            locationVerified: true,
            locationData: { latitude, longitude, distance }
        });

        res.json({ message: 'Attendance Marked Successfully', record });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Attendance already marked.' });
        }
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Report (Faculty)
exports.getReport = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const records = await AttendanceRecord.find({ session: sessionId })
            .populate('student', 'name rollNumber');
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// 4. Get Subject Stats (Faculty - Student List for Subject)
exports.getSubjectStats = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const Subject = require('../models/Subject');
        const User = require('../models/User'); // Assuming students are Users

        // 1. Get total sessions for this subject
        const totalSessions = await AttendanceSession.countDocuments({ subject: subjectId });

        // 2. Get All Students (Mock: just get all students, or filter by enrollment if that exists)
        // For now, assuming all students with role 'student' are eligible, or we need an Enrollment model.
        // Let's assume we fetch all users of role 'student' (Simple version)
        const students = await User.find({ role: 'student' }).select('name rollNumber email');

        const report = [];

        for (const student of students) {
            // Count attended sessions for this student in this subject
            const attendedCount = await AttendanceRecord.countDocuments({
                student: student._id,
                status: 'present',
                session: { $in: await AttendanceSession.find({ subject: subjectId }).distinct('_id') }
            });

            report.push({
                _id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                email: student.email,
                attended: attendedCount,
                total: totalSessions,
                percentage: totalSessions === 0 ? 0 : Math.round((attendedCount / totalSessions) * 100)
            });
        }

        res.json({
            subjectId,
            totalSessions,
            students: report
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
