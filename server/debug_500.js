const sequelize = require('./config/database');
const { User, Classroom, Timetable, Subject, StudentFee } = require('./models');
const timetableController = require('./modules/timetable/controller');
const classroomController = require('./controllers/classroomController');

async function test() {
    try {
        await sequelize.authenticate();
        console.log("DB Connected.");

        // 1. Setup Test Data
        console.log("Setting up Test Data...");

        // Faculty
        let faculty = await User.findOne({ where: { email: 'debug_faculty@test.com' } });
        if (!faculty) {
            faculty = await User.create({
                name: 'Debug Faculty',
                email: 'debug_faculty@test.com',
                password: 'password123',
                role: 'faculty',
                department: 'DebugDept'
            });
        }

        // Classroom
        let classroom = await Classroom.findOne({ where: { department: 'DebugDept', semester: 1 } });
        if (!classroom) {
            classroom = await Classroom.create({
                department: 'DebugDept',
                semester: 1,
                section: 'A',
                classTeacherId: faculty.id
            });
        }

        // Student
        let student = await User.findOne({ where: { email: 'debug_student@test.com' } });
        if (!student) {
            student = await User.create({
                name: 'Debug Student',
                email: 'debug_student@test.com',
                password: 'password123',
                role: 'student',
                department: 'DebugDept',
                semester: 1
            });
        }

        console.log("Test Data Ready.");

        // 2. Mock Req/Res
        const req = { user: { id: student.id }, query: {} };
        const res = {
            json: (d) => console.log("JSON:", JSON.stringify(d).slice(0, 100) + "..."),
            status: (c) => {
                console.log("Status:", c);
                return { json: (d) => console.log("Error JSON:", d) };
            }
        };

        // --- INJECT CORRUPTED DATA ---
        console.log("Injecting Corrupted Slot...");
        try {
            // Setup Associations first if not done? 
            // We need to bypass Sequelize constraints or just use raw ID?
            // Sequelize might block create if FK checks are on.
            // Using raw query to simulate DB corruption
            await sequelize.query(`
                INSERT INTO Timetables (day, startTime, endTime, type, room, facultyId, subjectId, classroomId, createdAt, updatedAt)
                VALUES ('Monday', '10:00', '11:00', 'LECTURE', 'BadRoom', ${faculty.id}, 99999, 99999, DATETIME('now'), DATETIME('now'))
            `);
        } catch (e) {
            console.log("Could not inject corruption (FK constraint active):", e.message);
        }

        // 3. Test Student Timetable
        console.log("\n--- Testing Student Timetable (getMySchedule) ---");
        req.user.id = student.id;
        try {
            await timetableController.getMySchedule(req, res);
        } catch (e) {
            console.error("Student Timetable CRASH:", e);
        }

        // 4. Test Faculty Timetable
        console.log("\n--- Testing Faculty Timetable (getTeachingSchedule) ---");
        req.user.id = faculty.id;
        try {
            await timetableController.getTeachingSchedule(req, res);
        } catch (e) {
            console.error("Faculty Timetable CRASH:", e);
        }

        // 5. Test Classroom Students
        console.log("\n--- Testing Classroom Students (getClassStudents) ---");
        req.user.id = faculty.id;
        try {
            await classroomController.getClassStudents(req, res);
        } catch (e) {
            console.error("Classroom Students CRASH:", e);
        }


    } catch (e) {
        console.error("SETUP CRASH:", e);
    } finally {
        process.exit();
    }
}

test();
