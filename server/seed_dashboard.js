const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Models
const User = require('./models/User');
const Subject = require('./models/Subject');
const Note = require('./models/Note');

// Connection
mongoose.connect(process.env.MONGO_URI, {
    // Deprecated options removed
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

async function seedDashboard() {
    try {
        console.log('Cleaning up old data...');
        // Optional: Clear existing if you want a fresh start, but maybe keep users?
        // await Subject.deleteMany({});
        // await Note.deleteMany({});

        // 1. Find or Create Faculty
        let faculty = await User.findOne({ email: 'faculty@example.com' });
        if (!faculty) {
            faculty = await User.create({
                name: 'Dr. Alan Turing',
                email: 'faculty@example.com',
                password: 'password123',
                role: 'faculty',
                department: 'CSE'
            });
            console.log('Created Faculty');
        }

        // 2. Find or Create Student (The one we login as)
        let student = await User.findOne({ email: 'student@example.com' });
        if (!student) {
            student = await User.create({
                name: 'John Student',
                email: 'student@example.com',
                password: 'password123',
                role: 'student',
                department: 'CSE',
                semester: 3,
                points: 1250, // Silver
                band: 'Silver'
            });
            console.log('Created Student');
        } else {
            // Update points for demo
            student.points = 1250;
            student.band = 'Silver';
            await student.save();
            console.log('Updated Student points');
        }

        // 3. Create Subjects
        const subjectsData = [
            { name: 'Data Structures', code: 'CS301', department: 'CSE', semester: 3, faculty: faculty._id },
            { name: 'Database Management', code: 'CS302', department: 'CSE', semester: 3, faculty: faculty._id },
            { name: 'Operating Systems', code: 'CS303', department: 'CSE', semester: 3, faculty: faculty._id }
        ];

        let createdSubjects = [];
        for (const sub of subjectsData) {
            let s = await Subject.findOne({ code: sub.code });
            if (!s) {
                s = await Subject.create(sub);
                console.log(`Created Subject: ${sub.name}`);
            }
            createdSubjects.push(s);
        }

        // 4. Enroll Student in Subjects using the new User.enrollment field? 
        // Wait, current Subject model has 'students' array? Or User has 'subjects'?
        // Checking Subject.js from previous memory... standard was Subject refers to Faculty, but enrollment usually happens via junction or array.
        // Let's assume for now we don't have explicit enrollment enforcement in GET /subjects logic (it usually returns all for department or specific). 
        // Let's check subjectController later. For now, just having subjects exists.

        // 5. Create Notes (Latest Updates)
        const notesData = [
            {
                title: 'Binary Trees Lecture Slides',
                description: 'Slides from today\'s class',
                fileUrl: 'uploads/demo.pdf', // Mock path
                fileType: 'pdf',
                subject: createdSubjects[0]._id,
                uploadedBy: faculty._id,
                unit: 2
            },
            {
                title: 'SQL Join Types Diagram',
                description: 'Ref sheet for joins',
                fileUrl: 'uploads/demo.png', // Mock path
                fileType: 'image',
                subject: createdSubjects[1]._id,
                uploadedBy: faculty._id,
                unit: 3
            },
            {
                title: 'Previous Year OS Questions',
                description: 'Solved paper 2024',
                fileUrl: 'uploads/demo2.pdf',
                fileType: 'pdf',
                subject: createdSubjects[2]._id,
                uploadedBy: student._id, // Uploaded by student (Anonymous mock?)
                isAnonymous: true,
                unit: 1
            }
        ];

        for (const note of notesData) {
            // Avoid dupes validation optional, just create for feed
            await Note.create(note);
            console.log(`Created Note: ${note.title}`);
        }

        console.log('Dashboard Seed Completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding dashboard:', error);
        process.exit(1);
    }
}

seedDashboard();
