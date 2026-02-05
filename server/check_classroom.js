
const { Classroom, User } = require('./models');
const sequelize = require('./config/database');

async function checkClassroom() {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB.");

        const teacherId = 19; // Shaheen

        // Check if teacher exists
        const teacher = await User.findByPk(teacherId);
        if (teacher) {
            console.log(`Teacher found: ${teacher.name} (${teacher.email})`);
        } else {
            console.log(`Teacher with ID ${teacherId} NOT FOUND.`);
        }

        // Check if assigned to any class
        const classroom = await Classroom.findOne({
            where: { classTeacherId: teacherId }
        });

        if (classroom) {
            console.log(`Assigned Class: ${classroom.department} - Sem ${classroom.semester} (${classroom.section})`);
        } else {
            console.log("No class assigned to this teacher.");
        }

        // List all classrooms
        console.log("--- All Classrooms ---");
        const classrooms = await Classroom.findAll();
        classrooms.forEach(c => {
            console.log(`ID: ${c.id} | ${c.department} Sem ${c.semester} | Teacher ID: ${c.classTeacherId}`);
        });

    } catch (err) {
        console.error("Error:", err);
    }
}

checkClassroom();
