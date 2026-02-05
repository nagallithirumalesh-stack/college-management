const sequelize = require('./config/database');
const { User, Classroom, Subject, Timetable, Announcement, Event } = require('./models');

const seedFull = async () => {
    try {
        await sequelize.sync({ force: false }); // Do not wipe users if possible, or use force: true if we want clean slate. 
        // Let's use clean slate for robustness since previous seed was partial
        // actually force: false is safer if we just want to ADD missing data.

        // 1. Get or Create Users (re-upping these just in case)
        let student = await User.findOne({ where: { email: 'student@test.com' } });
        if (!student) {
            student = await User.create({
                name: 'Test Student',
                email: 'student@test.com',
                password: 'password123',
                role: 'student',
                department: 'CSE',
                semester: 6,
                username: 'student1'
            });
            console.log('Created Student');
        }

        let faculty = await User.findOne({ where: { email: 'faculty@test.com' } });
        if (!faculty) {
            faculty = await User.create({
                name: 'Test Faculty',
                email: 'faculty@test.com',
                password: 'password123',
                role: 'faculty',
                department: 'CSE',
                username: 'faculty1'
            });
            console.log('Created Faculty');
        }

        // 2. Create Classroom
        let classroom = await Classroom.findOne({
            where: { department: 'CSE', semester: 6, section: 'A' }
        });
        if (!classroom) {
            classroom = await Classroom.create({
                department: 'CSE',
                semester: 6,
                section: 'A',
                classTeacherId: faculty.id
            });
            console.log('Created Classroom: CSE Sem 6 Sec A');
        }

        // 3. Create Subject
        let subject = await Subject.findOne({ where: { code: 'CS601' } });
        if (!subject) {
            subject = await Subject.create({
                name: 'Advanced Web Development',
                code: 'CS601',
                department: 'CSE',
                semester: 6,
                credits: 4,
                facultyId: faculty.id
            });
            console.log('Created Subject: Advanced Web Development');
        }

        // 4. Create Timetable Entries
        // Monday 09:00 - 10:00
        const slot1 = await Timetable.findOne({
            where: {
                day: 'Monday',
                startTime: '09:00',
                classroomId: classroom.id
            }
        });

        if (!slot1) {
            await Timetable.create({
                day: 'Monday',
                startTime: '09:00',
                endTime: '10:00',
                type: 'LECTURE',
                room: 'LH-101',
                subjectId: subject.id,
                facultyId: faculty.id,
                classroomId: classroom.id
            });
            console.log('Created Timetable Slot: Mon 9-10');
        }

        // Tuesday 10:00 - 11:00
        const slot2 = await Timetable.findOne({
            where: {
                day: 'Tuesday',
                startTime: '10:00',
                classroomId: classroom.id
            }
        });

        if (!slot2) {
            await Timetable.create({
                day: 'Tuesday',
                startTime: '10:00',
                endTime: '11:00',
                type: 'LAB',
                room: 'Lab-2',
                subjectId: subject.id,
                facultyId: faculty.id,
                classroomId: classroom.id
            });
            console.log('Created Timetable Slot: Tue 10-11');
        }

        // 5. Create Sample Announcement
        await Announcement.create({
            title: 'Welcome to the new semester!',
            content: 'Classes will begin from Monday.',
            postedBy: faculty.id,
            targetRole: 'student',
            department: 'CSE'
        });
        console.log('Created Announcement');

        console.log('Full Seeding Completed!');
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedFull();
