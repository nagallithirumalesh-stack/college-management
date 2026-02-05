
const { Classroom, User } = require('./models');
const sequelize = require('./config/database');

async function assignTeacher() {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB.");

        const teacherId = 19; // Shaheen
        const department = 'CSE';
        const semester = 3;
        const section = 'A';

        // 1. Find or Create Classroom
        const [classroom, created] = await Classroom.findOrCreate({
            where: { department, semester, section },
            defaults: {
                classTeacherId: teacherId
            }
        });

        if (created) {
            console.log("Created new classroom and assigned teacher.");
        } else {
            console.log(`Found existing classroom [${classroom.id}]. Updating teacher...`);
            classroom.classTeacherId = teacherId;
            await classroom.save();
            console.log("Updated class teacher.");
        }

        console.log(`Assigned Teacher [${teacherId}] to Class [${department} - ${semester} - ${section}]`);

    } catch (err) {
        console.error("Error:", err);
    }
}

assignTeacher();
