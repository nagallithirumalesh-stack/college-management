const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Subject = require('./models/Subject');
const Assignment = require('./models/Assignment');

mongoose.connect(process.env.MONGO_URI, {
    // Deprecated options removed
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

async function seedAssignments() {
    try {
        console.log('Seeding Assignments...');

        // Find Faculty
        const faculty = await User.findOne({ role: 'faculty' });
        if (!faculty) {
            console.error('No faculty found. Run seed_dashboard.js first.');
            process.exit(1);
        }

        // Find Subject
        const subject = await Subject.findOne({ code: 'CS301' }); // Data Structures
        if (!subject) {
            console.error('Subject CS301 not found.');
            process.exit(1);
        }

        // Create Assignment
        const assignments = [
            {
                title: 'Implement AVL Tree',
                description: 'Write a program to implement AVL tree insertions and deletions. Submit your code as a text file.',
                subject: subject._id,
                createdBy: faculty._id,
                dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                totalMarks: 20
            },
            {
                title: 'Graph Traversal Algorithms',
                description: 'Explain BFS and DFS with examples.',
                subject: subject._id,
                createdBy: faculty._id,
                dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                totalMarks: 15
            }
        ];

        for (const a of assignments) {
            // Check if exists
            const exists = await Assignment.findOne({ title: a.title });
            if (!exists) {
                await Assignment.create(a);
                console.log(`Created Assignment: ${a.title}`);
            } else {
                console.log(`Assignment already exists: ${a.title}`);
            }
        }

        console.log('Assignment Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding assignments:', error);
        process.exit(1);
    }
}

seedAssignments();
