const sequelize = require('./config/database');
const models = require('./models');
const bcrypt = require('bcryptjs');

const seedDemoData = async () => {
    try {
        console.log('Syncing Database...');
        await sequelize.query("PRAGMA foreign_keys = OFF");
        await sequelize.sync({ force: true });
        await sequelize.query("PRAGMA foreign_keys = ON");
        console.log('Database Cleared & Synced.');

        // --- 1. Create Users (Faculty) ---
        console.log('Creating Faculty...');
        const facultyData = [
            { name: 'Shaheen Madam', email: 'shaheen@edtrack.com', subjectCode: 'AI', subjectName: 'Artificial Intelligence' },
            { name: 'Teja Malathi Madam', email: 'teja@edtrack.com', subjectCode: 'MEFA', subjectName: 'Managerial Economics & Financial Accounting' },
            { name: 'Swarnakala Madam', email: 'swarnakala@edtrack.com', subjectCode: 'SMDS', subjectName: 'Statistics & Mathematical Data Science' },
            { name: 'Vyshnavi Madam', email: 'vyshnavi@edtrack.com', subjectCode: 'IDS', subjectName: 'IDS' },
            { name: 'Revathi Madam', email: 'revathi@edtrack.com', subjectCode: 'DTI', subjectName: 'Design Thinking & Innovation' }
        ];

        const facultyMap = {}; // name -> user object
        const subjectMap = {}; // code -> subject object

        for (const fac of facultyData) {
            const user = await models.User.create({
                name: fac.name,
                email: fac.email,
                password: 'password123',
                role: 'faculty',
                department: 'AIDSS',
                semester: 0,
                rollNo: 'FAC' + fac.subjectCode
            });
            facultyMap[fac.name] = user;

            // --- 2. Create Subjects ---
            const subject = await models.Subject.create({
                name: fac.subjectName,
                code: fac.subjectCode,
                department: 'AIDSS',
                semester: 4, // Assuming 2nd year = sem 3/4, let's say 4
                credits: 3,
                facultyId: user.id
            });
            subjectMap[fac.subjectCode] = subject;
        }

        // Admin
        await models.User.create({
            name: 'System Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            department: 'Administration',
            semester: 0,
            rollNo: 'ADMIN001'
        });

        // --- 3. Create Students (Roll No Format: 24AK1A30G1...10) ---
        console.log('Creating Students...');
        const students = [];
        for (let i = 1; i <= 10; i++) {
            const rollNo = `24AK1A30G${i}`;
            const student = await models.User.create({
                name: `Student ${i}`, // Or specific names if provided
                email: `student${i}@example.com`,
                password: 'password123',
                role: 'student',
                department: 'AIDSS',
                semester: 4,
                section: 'A',
                rollNo: rollNo,
                points: Math.floor(Math.random() * 100),
                band: i % 2 === 0 ? 'Gold' : 'Silver'
            });
            students.push(student);
        }

        // --- 4. Timetable ---
        console.log('Creating Timetable...');
        // Weekly Timetable Example
        // Time	Monday	Tuesday	Wednesday	Thursday	Friday
        // 9-10	AI	    MEFA	IDS	    SMDS	DTI
        // 10-11 AI	    MEFA	IDS	    SMDS	DTI
        // 11-12 SMDS	AI	    MEFA	IDS	    AI
        // 1-2	 IDS	SMDS	AI	    MEFA	SMDS
        // 2-3	 DTI	IDS	    SMDS	AI	    MEFA

        // We need 'Period' model logic, or Timetable Module logic.
        // Assuming Timetable Module stores in 'TimetableSlots' or similar.
        // Let's check models... 'Period.js'? No, user has 'modules/timetable'.
        // Let's look at available models for timetable.
        // models.TimetableEntry?
        // Wait, for now let's skip complex timetable structure if the model isn't obvious, 
        // OR better, try to create basic periods if standard models exist.
        // There is 'Period.js' in the file list earlier. Let's assume it links Subject -> Day/Time.

        // Previous placeholder comments removed.

        // Insert logic if Timetable model exists. 
        // If "modules/timetable" is used, we might need that model. 
        // Just in case, let's create a Classroom first.
        const classroom = await models.Classroom.create({
            department: 'AIDSS',
            semester: 4,
            section: 'A',
            classTeacherId: facultyMap['Revathi Madam'].id
        });

        // --- 4. Timetable (Actually Create Records) ---
        console.log('Creating Timetable...');
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const periods = [
            { time: '09:00', endTime: '10:00', subjects: ['AI', 'MEFA', 'IDS', 'SMDS', 'DTI'] },
            { time: '10:00', endTime: '11:00', subjects: ['AI', 'MEFA', 'IDS', 'SMDS', 'DTI'] },
            { time: '11:00', endTime: '12:00', subjects: ['SMDS', 'AI', 'MEFA', 'IDS', 'AI'] },
            { time: '13:00', endTime: '14:00', subjects: ['IDS', 'SMDS', 'AI', 'MEFA', 'SMDS'] },
            { time: '14:00', endTime: '15:00', subjects: ['DTI', 'IDS', 'SMDS', 'AI', 'MEFA'] }
        ];

        for (const [dayIndex, day] of days.entries()) {
            for (const period of periods) {
                const subjectCode = period.subjects[dayIndex];
                const subject = subjectMap[subjectCode];
                if (subject) {
                    await models.Timetable.create({
                        day: day,
                        startTime: period.time,
                        endTime: period.endTime,
                        type: 'LECTURE',
                        room: 'LH-101',
                        subjectId: subject.id,
                        facultyId: subject.facultyId, // Assigned faculty for this subject
                        classroomId: classroom.id
                    });
                }
            }
        }

        // --- 5. Attendance & Marks ---
        console.log('Adding Sample Attendance & Marks...');

        // Sample Marks for Student G2 (Sunil) - Roll No 24AK1A30G2 (Index 1 in array)
        const targetStudent = students[1];
        // Roll No	AI	MEFA	SMDS	IDS	DTI	%
        // 24AK1A30G2	85	78	90	80	88	84%

        const marksData = {
            'AI': 85, 'MEFA': 78, 'SMDS': 90, 'IDS': 80, 'DTI': 88
        };

        for (const [subjCode, score] of Object.entries(marksData)) {
            const subj = subjectMap[subjCode];
            if (subj) {
                await models.Mark.create({
                    studentId: targetStudent.id,
                    subjectId: subj.id,
                    marksObtained: score,
                    totalMarks: 100,
                    examType: 'Mid-1', // Assumption
                    semester: 4
                });
            }
        }

        // Sample Attendance for AI Class
        // Roll No	Name	Status
        // 24AK1A30G1	Ramesh	Present
        // 24AK1A30G2	Sunil	Present
        // 24AK1A30G3	Sita	Absent
        // 24AK1A30G4	Kiran	Present

        const aiSubject = subjectMap['AI'];
        const session = await models.AttendanceSession.create({
            facultyId: facultyMap['Shaheen Madam'].id,
            subjectId: aiSubject.id,
            classroomId: classroom.id,
            date: new Date(),
            startTime: '09:00',
            endTime: '10:00',
            status: 'COMPLETED',
            type: 'QR'
        });

        const statuses = ['PRESENT', 'PRESENT', 'ABSENT', 'PRESENT'];
        for (let i = 0; i < 4; i++) {
            await models.AttendanceRecord.create({
                sessionId: session.id,
                studentId: students[i].id,
                status: statuses[i],
                date: new Date()
            });
        }

        console.log('Demo Data Seeded Successfully!');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
};

seedDemoData();
