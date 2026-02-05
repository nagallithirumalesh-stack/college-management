const sequelize = require('./config/database');
const models = require('./models');

const fixAttendance = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Find Student
        const student = await models.User.findOne({ where: { role: 'student' } });
        if (!student) {
            console.log('No student found.');
            process.exit(0);
        }
        console.log(`Found Student: ${student.name}`);

        // 2. Find Faculty
        const faculty = await models.User.findOne({ where: { role: 'faculty' } });
        if (!faculty) {
            console.log('No faculty found.');
            process.exit(0);
        }

        // 3. Find Subjects (for this student's dept/sem)
        const subjects = await models.Subject.findAll({
            where: {
                department: student.department || 'CSE',
                semester: student.semester || 1
            }
        });

        if (subjects.length === 0) {
            console.log('No subjects found. Run fix_timetable_classroom.js first.');
            process.exit(0);
        }

        console.log(`Found ${subjects.length} subjects.`);

        // 4. Create Sessions & Records
        for (const sub of subjects) {
            console.log(`Processing Subject: ${sub.name}...`);

            // Check if sessions exist
            const sessionCount = await models.AttendanceSession.count({ where: { subjectId: sub.id } });

            if (sessionCount < 5) {
                console.log(`   Creating valid past sessions...`);
                // Create 10 sessions in the past 2 weeks
                for (let i = 1; i <= 10; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - i); // Past date (yesterday, day before...)

                    const session = await models.AttendanceSession.create({
                        date: date,
                        startTime: new Date(date.setHours(9, 0, 0)),
                        endTime: new Date(date.setHours(10, 0, 0)),
                        isActive: false, // Past session
                        subjectId: sub.id,
                        facultyId: faculty.id,
                        qrCode: `ARCHIVED_QR_${sub.code}_${i}`
                    });

                    // Mark student present in 80% (8 out of 10)
                    if (i <= 8) {
                        await models.AttendanceRecord.create({
                            status: 'present',
                            timestamp: new Date(date.setHours(9, 15, 0)),
                            sessionId: session.id,
                            studentId: student.id,
                            verificationMethod: 'qr'
                        });
                    }
                }
                console.log(`   Created 10 sessions (8 attended).`);
            } else {
                console.log(`   Sessions already exist (${sessionCount}).`);

                // Ensure at least one record exists for this student if valid sessions exist
                const recordCount = await models.AttendanceRecord.count({
                    include: [{
                        model: models.AttendanceSession,
                        as: 'session',
                        where: { subjectId: sub.id }
                    }],
                    where: { studentId: student.id }
                });

                if (recordCount === 0) {
                    console.log('   No attendance records for student. Adding some...');
                    const sessions = await models.AttendanceSession.findAll({ where: { subjectId: sub.id }, limit: 5 });
                    for (const sess of sessions) {
                        await models.AttendanceRecord.create({
                            status: 'present',
                            timestamp: sess.date || new Date(),
                            sessionId: sess.id,
                            studentId: student.id,
                            verificationMethod: 'manual'
                        });
                    }
                    console.log(`   Added 5 records.`);
                }
            }
        }

        console.log('✅ ATTENDANCE FIX COMPLETE.');

    } catch (error) {
        console.error('Error fixing attendance:', error);
    } finally {
        await sequelize.close();
    }
};

fixAttendance();
