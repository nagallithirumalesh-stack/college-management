require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@smartcampus.edu' });
        if (existingAdmin) {
            console.log('⚠️ Admin already exists');
            process.exit(0);
        }

        const admin = await User.create({
            name: 'System Administrator',
            email: 'admin@smartcampus.edu',
            password: 'admin123', // Will be hashed by pre-save hook
            role: 'admin',
            department: 'Administration',
            semester: 0
        });

        console.log('🎉 Admin User Created Successfully');
        console.log('-----------------------------------');
        console.log(`Email:    ${admin.email}`);
        console.log(`Password: admin123`);
        console.log('-----------------------------------');

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
