
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

        // Check if Classroom model exists and is valid
        if (!Classroom) {
            throw new Error("Classroom model not loaded");
        }

        // Try simple create if findOrCreate fails
        let classroom = await Classroom.findOne({
            where: { department, semester, section }
        });

        if (!classroom) {
            console.log("Classroom not found. Creating...");
            classroom = await Classroom.create({
                department,
                semester,
                section,
                classTeacherId: teacherId
            });
            console.log("Created successfully.");
        } else {
            console.log(`Classroom found [${classroom.id}]. Updating...`);
            classroom.classTeacherId = teacherId;
            await classroom.save();
            console.log("Updated successfully.");
        }

    } catch (err) {
        console.error("FULL ERROR:", err);
    }
}

assignTeacher();
