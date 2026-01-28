const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Classroom = require('./models/Classroom');

dotenv.config();

const seedClassroom = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find the faculty "Dr. Sarah Wilson"
        const faculty = await User.findOne({ email: 'sarah@college.edu' }); // Assuming email from seed_admin or similar
        // If not found by email, try name or fallback
        const sarah = faculty || await User.findOne({ name: 'Dr. Sarah Wilson' });

        if (!sarah) {
            console.error('Faculty Dr. Sarah Wilson not found. Run seed_admin.js first.');
            process.exit(1);
        }

        // Clear existing classrooms
        await Classroom.deleteMany({});

        // Create Classroom
        const cls = await Classroom.create({
            department: 'CSE',
            semester: 3,
            section: 'A',
            classTeacher: sarah._id
        });

        console.log(`Assigned ${sarah.name} as Class Teacher for ${cls.department} Sem ${cls.semester} (Sec ${cls.section})`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedClassroom();
