const sequelize = require('./config/database');
const models = require('./models');

const fixData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Debug: List existing classrooms
        const allCls = await models.Classroom.findAll();
        console.log('Existing Classrooms:', allCls.map(c => `${c.department}-${c.semester}-${c.section}`));

        // Find all students
        const students = await models.User.findAll({ where: { role: 'student' } });

        if (students.length === 0) {
            console.log('No students found in database.');
            process.exit(0);
        }

        console.log(`Found ${students.length} students. Checking classrooms...`);

        // Ensure Faculty Exists
        let faculty = await models.User.findOne({ where: { role: 'faculty' } });
        if (!faculty) {
            console.log('No faculty found. Creating default faculty...');
            // Need unique email
            const uniqueEmail = `faculty_${Date.now()}@fix.com`;
            faculty = await models.User.create({
                name: 'Dr. Default Faculty',
                email: uniqueEmail,
                password: 'password123',
                role: 'faculty',
                department: 'CSE',
                semester: 0
            });
        }

        for (const student of students) {
            console.log(`Checking for Student: ${student.name} (${student.department} / Sem ${student.semester})`);

            // 1. Ensure Classroom
            const dept = student.department || 'CSE';
            const sem = student.semester || 1;

            // Try to find ANY classroom for this dept/sem
            let classroom = await models.Classroom.findOne({
                where: { department: dept, semester: sem }
            });

            if (!classroom) {
                console.log(`   Classroom missing. Attempting create for ${dept}-${sem}...`);
                const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

                for (const sec of sections) {
                    try {
                        classroom = await models.Classroom.create({
                            department: dept,
                            semester: sem,
                            section: sec,
                            classTeacherId: faculty.id
                        });
                        console.log(`   ✅ Created Classroom: ${dept}-${sem} (Sec ${sec})`);
                        break;
                    } catch (err) {
                        if (err.name === 'SequelizeUniqueConstraintError') {
                            console.log(`   ⚠️ Section ${sec} conflict (likely global unique constraint). Trying next...`);
                        } else {
                            console.error('   ❌ Create failed:', err.message);
                            throw err;
                        }
                    }
                }
            } else {
                console.log(`   Classroom exists: ID ${classroom.id} (${classroom.department}-${classroom.semester}-${classroom.section})`);
            }

            if (!classroom) {
                console.error('   FAILED to find or create classroom. Skipping student.');
                continue;
            }

            // 2. Ensure Subject
            let subject = await models.Subject.findOne({
                where: { department: dept, semester: sem }
            });
            if (!subject) {
                console.log(`   Subject missing. Creating default subject...`);
                subject = await models.Subject.create({
                    name: 'General Engineering',
                    code: `GEN${sem}01`, // unique code to avoid constraint
                    department: dept,
                    semester: sem,
                    facultyId: faculty.id
                });
            }

            // 3. Ensure Timetable
            const timetableCount = await models.Timetable.count({
                where: { classroomId: classroom.id }
            });

            if (timetableCount === 0) {
                console.log(`   Timetable empty for classroom. Creating slots...`);
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const slots = [];
                for (const day of days) {
                    slots.push({
                        day: day,
                        startTime: '09:00',
                        endTime: '10:00',
                        type: 'LECTURE',
                        room: 'Room 101',
                        subjectId: subject.id,
                        facultyId: faculty.id,
                        classroomId: classroom.id
                    });
                    slots.push({
                        day: day,
                        startTime: '10:00',
                        endTime: '11:00',
                        type: 'LAB',
                        room: 'Lab 1',
                        subjectId: subject.id,
                        facultyId: faculty.id,
                        classroomId: classroom.id
                    });
                }
                await models.Timetable.bulkCreate(slots);
                console.log(`   Created ${slots.length} slots.`);
            } else {
                console.log(`   Timetable exists (${timetableCount} slots).`);
            }
        }

        console.log('✅ FIX COMPLETE: All students have valid classrooms and timetables.');

    } catch (error) {
        console.error('Error fixing data:', error);
    } finally {
        await sequelize.close();
    }
};

fixData();
