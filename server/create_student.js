
const { User } = require('./models');
const sequelize = require('./config/database');

async function createStudent() {
    try {
        await sequelize.authenticate();

        const newStudent = await User.create({
            name: "Demo Student",
            email: "demo_student@example.com",
            password: "password123", // Encryption handled by hooks
            role: "student",
            department: "CSE",
            semester: 3,
            section: "A",
            username: "demostudent"
        });

        console.log("Created Student:");
        console.log(`Email: ${newStudent.email}`);
        console.log(`Password: password123`);
        console.log(`Class: ${newStudent.department} - Sem ${newStudent.semester}`);

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            console.log("User 'demo_student@example.com' already exists.");
        } else {
            console.error("Error creating student:", err);
        }
    }
}

createStudent();
