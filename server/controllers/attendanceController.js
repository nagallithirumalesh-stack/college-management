const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Subject = require('../models/Subject');
const User = require('../models/User');
const crypto = require('crypto');
const Mark = require('../models/Mark');
const { Op } = require('sequelize');

// Utility: Check microwave signal proximity
function checkMicrowaveProximity(signalStrength, threshold) {
    // Signal strength is typically negative dBm values
    // Stronger signal = less negative (e.g., -30 dBm is stronger than -70 dBm)
    // Threshold should be a negative dBm value (e.g., -60 dBm)
    // Threshold should be a negative dBm value (e.g., -60 dBm)
    return signalStrength >= threshold;
}

// Utility: Haversine Formula for Distance (Meters)
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0; // Fallback if location missing
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
        const { subjectId, periodId, microwaveThreshold } = req.body;

        // Generate random session code
        const qrCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        const session = await AttendanceSession.create({
            subjectId,
            periodId,
            facultyId: req.user.id,
            qrCode,
            isActive: true,
            type: req.body.type || 'QR',
            microwaveSignalThreshold: microwaveThreshold || -60, // Default -60 dBm
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
        const session = await AttendanceSession.findOne({
            where: { qrCode, isActive: true }
        });

        if (!session) return res.status(400).json({ error: 'Invalid or Expired QR Code' });

        // Check Geofence
        // session.location is JSON
        const sessionLocation = session.location || {};
        const distance = getDistanceFromLatLonInM(
            sessionLocation.latitude,
            sessionLocation.longitude,
            latitude,
            longitude
        );

        if (distance > sessionLocation.radius) {
            return res.status(403).json({
                error: 'Attendance Failed: You are outside the campus geofence.',
                distance: Math.round(distance)
            });
        }

        // Check duplicate
        const existing = await AttendanceRecord.findOne({
            where: {
                sessionId: session.id,
                studentId: req.user.id
            }
        });
        if (existing) {
            return res.status(400).json({ error: 'Attendance already marked.' });
        }

        // Record Attendance
        const record = await AttendanceRecord.create({
            sessionId: session.id,
            studentId: req.user.id,
            status: 'present',
            verificationMethod: 'qr',
            deviceInfo: { latitude, longitude, distance },
            distanceMetadata: { distance, allowedRadius: sessionLocation.radius, units: 'meters' }
        });

        res.json({ message: 'Attendance Marked Successfully', record });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// 3. Get Report (Faculty)
exports.getReport = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const records = await AttendanceRecord.findAll({
            where: { sessionId },
            include: [{ model: User, as: 'student', attributes: ['name', 'email'] }]
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Get Subject Stats (Faculty - Student List for Subject)
exports.getSubjectStats = async (req, res) => {
    try {
        const { subjectId } = req.params;

        // 1. Get total sessions for this subject
        const totalSessions = await AttendanceSession.count({ where: { subjectId } });

        // 2. Get All Students
        const students = await User.findAll({
            where: { role: 'student' },
            attributes: ['id', 'name', 'email']
        });

        // 3. Get all sessions for this subject to filter records
        const sessions = await AttendanceSession.findAll({
            where: { subjectId },
            attributes: ['id']
        });
        const sessionIds = sessions.map(s => s.id);

        const report = [];

        for (const student of students) {
            // Count attended sessions
            const attendedCount = await AttendanceRecord.count({
                where: {
                    studentId: student.id,
                    status: 'present',
                    sessionId: { [Op.in]: sessionIds }
                }
            });

            report.push({
                _id: student.id,
                name: student.name,
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


// 4.5 Get Manual Attendance List (Improved)
// 4.5 Get Manual Attendance List (Improved)
exports.getManualList = async (req, res) => {
    try {
        const { subjectId, year, department, section } = req.query;

        // 1. Build Student Filter
        const studentFilter = { role: 'student' };
        if (department) studentFilter.department = department;
        if (section) studentFilter.section = section;
        if (year) {
            const y = parseInt(year);
            studentFilter.semester = { [Op.in]: [(y * 2) - 1, y * 2] };
        }

        // 2. Get Students
        const students = await User.findAll({
            where: studentFilter,
            attributes: ['id', 'name', 'email', 'rollNo', 'department', 'semester', 'section']
        });

        // 3. Find if there's ALREADY a session for this specific criteria today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Find today's session for this subject (QR or MANUAL)
        const todaysSession = await AttendanceSession.findOne({
            where: {
                subjectId,
                createdAt: { [Op.between]: [todayStart, todayEnd] }
            },
            order: [['createdAt', 'DESC']]
        });

        let attendanceMap = {};
        if (todaysSession) {
            const records = await AttendanceRecord.findAll({
                where: { sessionId: todaysSession.id }
            });
            records.forEach(r => {
                attendanceMap[r.studentId] = { status: r.status, method: r.verificationMethod };
            });
        }

        const manualList = await Promise.all(students.map(async (student) => {
            const record = attendanceMap[student.id];

            return {
                id: student.id,
                name: student.name,
                rollNumber: student.rollNumber || 'N/A',
                email: student.email,
                department: student.department,
                semester: student.semester,
                section: student.section,
                marksSummary: { grade: 'N/A', gpa: '0.0' }, // Kept lightweight
                attendanceStatus: record ? record.status : 'absent', // Default absent for realtime visibility
                verificationMethod: record ? record.method : null,
                sessionId: todaysSession ? todaysSession.id : null
            };
        }));

        res.json(manualList);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// 7. Save Manual Session (Bulk)
// 7. Save Manual Session (Bulk)
exports.saveManualSession = async (req, res) => {
    try {
        console.log('---/api/attendance/manual-save HIT---');
        console.log('Body:', req.body);
        console.log('User (auth):', req.user ? req.user.id : 'NO USER');

        const { subjectId, date, records, lock } = req.body;
        // records: [{ studentId, status }, ...]

        const sessionDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(sessionDate); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(sessionDate); endOfDay.setHours(23, 59, 59, 999);

        // Find match (prioritize existing session to merge data)
        let session = await AttendanceSession.findOne({
            where: {
                subjectId,
                createdAt: { [Op.between]: [startOfDay, endOfDay] }
            },
            order: [['createdAt', 'DESC']]
        });

        if (!session) {
            session = await AttendanceSession.create({
                subjectId,
                facultyId: req.user.id,
                type: 'MANUAL',
                isActive: !lock,
                qrCode: 'MANUAL-' + Date.now()
            });
        } else {
            // Update lock status if requested
            if (lock) {
                session.isActive = false;
                await session.save();
            }
        }

        // 2. Bulk Upsert Records
        for (const record of records) {
            const existingRecord = await AttendanceRecord.findOne({
                where: { sessionId: session.id, studentId: record.studentId }
            });

            if (existingRecord) {
                if (existingRecord.status !== record.status) {
                    existingRecord.status = record.status;
                    existingRecord.verificationMethod = 'manual'; // Override as manual
                    existingRecord.deviceInfo = { ...existingRecord.deviceInfo, manualBy: req.user.id, editedAt: new Date() };
                    await existingRecord.save();
                }
            } else {
                await AttendanceRecord.create({
                    sessionId: session.id,
                    studentId: record.studentId,
                    status: record.status,
                    verificationMethod: 'manual',
                    deviceInfo: { manualBy: req.user.id }
                });
            }
        }

        res.json({ message: "Attendance Saved Successfully", sessionId: session.id });

    } catch (error) {
        console.error("Save Manual Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 5. Get Attendance Grid (Faculty - Detailed View)
exports.getAttendanceGrid = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const subId = parseInt(subjectId, 10);

        if (isNaN(subId)) {
            return res.status(400).json({ error: "Invalid Subject ID" });
        }

        // 1. Get all sessions ordered by date
        const sessions = await AttendanceSession.findAll({
            where: { subjectId: subId },
            order: [['createdAt', 'ASC']],
            attributes: ['id', 'createdAt', 'qrCode']
        }) || [];

        // 2. Get All Students
        const students = await User.findAll({
            where: { role: 'student' },
            attributes: ['id', 'name', 'email']
        }) || [];

        // 3. Get all records for these sessions
        const sessionIds = sessions.map(s => s.id);
        let records = [];
        if (sessionIds.length > 0) {
            records = await AttendanceRecord.findAll({
                where: {
                    sessionId: { [Op.in]: sessionIds }
                }
            });
        }

        // 4. Map records for O(1) access
        const recordMap = {};
        records.forEach(r => {
            if (r.studentId && r.sessionId) {
                if (!recordMap[r.studentId]) recordMap[r.studentId] = {};
                recordMap[r.studentId][r.sessionId] = r.status;
            }
        });

        // 5. Build Grid Data
        const gridData = students.map(student => {
            const studentAttendance = {};
            sessions.forEach(session => {
                studentAttendance[session.id] = (recordMap[student.id] && recordMap[student.id][session.id]) ? recordMap[student.id][session.id] : 'absent';
            });

            const presentCount = Object.values(studentAttendance).filter(s => s === 'present').length;
            const percentage = sessions.length > 0 ? Math.round((presentCount / sessions.length) * 100) : 0;

            return {
                id: student.id,
                name: student.name,
                email: student.email,
                attendance: studentAttendance,
                stats: {
                    present: presentCount,
                    absent: sessions.length - presentCount,
                    percentage
                }
            };
        });

        const subject = await Subject.findByPk(subId);

        res.json({
            subjectName: subject ? subject.name : 'Unknown Subject',
            dates: sessions.map(s => ({ id: s.id, date: s.createdAt })),
            students: gridData
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Manual Toggle (Faculty) - Mark Attendance Manually
exports.toggleAttendance = async (req, res) => {
    try {
        const { sessionId, studentId, status } = req.body; // status: 'present' | 'absent'

        // Check if session exists
        const session = await AttendanceSession.findByPk(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        let record = await AttendanceRecord.findOne({
            where: { sessionId, studentId }
        });

        if (record) {
            record.status = status;
            await record.save();
        } else {
            record = await AttendanceRecord.create({
                sessionId,
                studentId,
                status,
                verificationMethod: 'manual',
                deviceInfo: { manualBy: req.user.id }
            });
        }
        res.json({ message: 'Attendance updated', record });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
