require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Note = require('./models/Note');

const verify = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully');

        const userCount = await User.countDocuments();
        const subjectCount = await Subject.countDocuments();
        const noteCount = await Note.countDocuments();

        console.log('\n--- Database Stats ---');
        console.log(`👤 Users:    ${userCount}`);
        console.log(`📚 Subjects: ${subjectCount}`);
        console.log(`📝 Notes:    ${noteCount}`);
        console.log('----------------------\n');

        // Optional: List Users
        if (userCount > 0) {
            console.log('Sample Users:');
            const users = await User.find({}, 'name email role').limit(3);
            users.forEach(u => console.log(` - [${u.role}] ${u.name} (${u.email})`));
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        process.exit(1);
    }
};

verify();
