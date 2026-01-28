require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const users = [
            {
                name: 'Dr. Sarah Wilson',
                email: 'faculty@smartcampus.edu',
                password: 'password123',
                role: 'faculty',
                department: 'Computer Science'
            },
            {
                name: 'John Doe',
                email: 'student@smartcampus.edu',
                password: 'password123',
                role: 'student',
                department: 'Computer Science',
                semester: 3,
                points: 120,
                band: 'Silver'
            }
        ];

        for (const u of users) {
            const exists = await User.findOne({ email: u.email });
            if (exists) {
                console.log(`⚠️ User ${u.email} already exists`);
            } else {
                await User.create(u);
                console.log(`🎉 Created ${u.role}: ${u.email}`);
            }
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
