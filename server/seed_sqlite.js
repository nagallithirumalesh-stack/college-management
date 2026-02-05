const sequelize = require('./config/database');
const models = require('./models'); // Initializes models
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Don't wipe if not needed, but here we just want to ensure tables exist

        // Check if users exist
        const adminCount = await models.User.count({ where: { role: 'admin' } });

        if (adminCount === 0) {
            console.log('Seeding Default Users...');

            // Create Admin
            // Password hashing is handled by the model hooks
            await models.User.create({
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                department: 'Administration',
                semester: 0,
                rollNo: 'ADMIN001'
            });
            console.log('Admin created: admin@example.com / password123');
        } else {
            console.log('Admin already exists.');
        }

        const studentCount = await models.User.count({ where: { role: 'student', email: 'student@example.com' } });
        if (studentCount === 0) {
            const student = await models.User.create({
                name: 'John Doe',
                email: 'student@example.com',
                password: 'password123',
                role: 'student',
                department: 'CSE',
                semester: 6,
                points: 100,
                band: 'Silver',
                rollNo: 'CSE24001'
            });
            console.log('Student created: student@example.com / password123');

            // Ensure a Classroom exists for this student's department/semester
            const [cls, created] = await models.Classroom.findOrCreate({
                where: { department: student.department, semester: student.semester, section: 'A' },
                defaults: { department: student.department, semester: student.semester, section: 'A' }
            });

            if (created) {
                console.log('Auto-created classroom for student:', cls.toJSON());
            } else {
                console.log('Classroom already exists for student:', cls.toJSON());
            }
        } else {
            console.log('Student John Doe already exists.');
        }

        const facultyCount = await models.User.count({ where: { role: 'faculty' } });
        if (facultyCount === 0) {
            await models.User.create({
                name: 'Dr. Smith',
                email: 'faculty@example.com',
                password: 'password123',
                role: 'faculty',
                department: 'CSE',
                semester: 0,
                rollNo: 'FAC001'
            });
            console.log('Faculty created: faculty@example.com / password123');

            // Create Subjects for the Faculty
            const subjects = [
                { name: 'Data Structures', code: 'CS201', department: 'CSE', semester: 3, facultyId: 1 },
                { name: 'Database Management', code: 'CS202', department: 'CSE', semester: 3, facultyId: 1 },
                { name: 'Operating Systems', code: 'CS301', department: 'CSE', semester: 5, facultyId: 1 }
            ];

            for (const sub of subjects) {
                const exists = await models.Subject.findOne({ where: { code: sub.code } });
                if (!exists) {
                    await models.Subject.create(sub);
                    console.log(`Subject created: ${sub.name} (${sub.code})`);
                }
            }
        }

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
};

seedDatabase();
