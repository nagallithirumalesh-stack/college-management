const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Subject = require('./models/Subject');
const AttendanceSession = require('./models/AttendanceSession');
const AttendanceRecord = require('./models/AttendanceRecord');
const Mark = require('./models/Mark');
const Note = require('./models/Note');
const Todo = require('./models/Todo');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        console.log('Seeding data...');

        // 1. Get or Create Users
        const student = await User.findOne({ role: 'student' });
        const faculty = await User.findOne({ role: 'faculty' });

        if (!student || !faculty) {
            console.log('Please ensure at least one student and one faculty exist.');
            process.exit(1);
        }

        console.log(`Using Student: ${student.name} (${student._id})`);
        console.log(`Using Faculty: ${faculty.name} (${faculty._id})`);

        // 2. Clear existing sample data (optional, but good for idempotency if needed, maybe just add more instead)
        // For now, let's just ADD new data to be safe.

        // 3. Ensure Subjects
        let subjects = await Subject.find({});
        if (subjects.length === 0) {
            subjects = await Subject.create([
                { name: 'Data Structures', code: 'CS201', department: 'CSE', semester: 3, faculty: faculty._id },
                { name: 'Web Development', code: 'CS202', department: 'CSE', semester: 3, faculty: faculty._id },
                { name: 'Database Systems', code: 'CS203', department: 'CSE', semester: 3, faculty: faculty._id }
            ]);
            console.log('Created Subjects');
        }

        // 4. Create Attendance Data
        console.log('Creating Attendance Records...');
        for (const sub of subjects) {
            // Create 10 sessions per subject
            for (let i = 0; i < 10; i++) {
                const session = await AttendanceSession.create({
                    subject: sub._id,
                    faculty: faculty._id,
                    qrCode: `MOCK_QR_${sub.code}_${i}`,
                    active: false, // Past session
                    geofence: { latitude: 12.97, longitude: 77.59, radius: 200 },
                    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // i days ago
                    expiresAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000) + 60 * 60 * 1000) // 1 hour after creation
                });

                // Mark student present for 80% of them
                if (Math.random() > 0.2) {
                    await AttendanceRecord.create({
                        session: session._id,
                        student: student._id,
                        status: 'present',
                        locationVerified: true,
                        locationData: { latitude: 12.97, longitude: 77.59, distance: 10 }
                    });
                }
            }
        }

        // 5. Create Marks
        console.log('Creating Marks...');
        await Mark.create([
            { student: student._id, subject: subjects[0]._id, assessmentType: 'Mid-Term', score: 42, maxScore: 50 },
            { student: student._id, subject: subjects[1]._id, assessmentType: 'Quiz 1', score: 18, maxScore: 20 },
            { student: student._id, subject: subjects[2]._id, assessmentType: 'Assignment', score: 9, maxScore: 10 }
        ]);

        // 6. Create Notes
        console.log('Creating Notes...');
        await Note.create([
            { title: 'Lecture 1: Introduction', content: 'Intro to BST', subject: subjects[0]._id, faculty: faculty._id, uploadedBy: faculty._id, fileType: 'pdf', fileUrl: 'http://example.com/lec1.pdf' },
            { title: 'React Hooks Guide', content: 'useEffect and useState', subject: subjects[1]._id, faculty: faculty._id, uploadedBy: faculty._id, fileType: 'link', fileUrl: 'http://reactjs.org' }
        ]);

        // 7. Create Todos
        console.log('Creating Todos...');
        await Todo.create([
            { user: student._id, text: 'Submit Lab Report', completed: false },
            { user: student._id, text: 'Prepare for Quiz', completed: true }
        ]);

        console.log('Sample Data Generated Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', JSON.stringify(error, null, 2));
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation Error for ${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seedData();
