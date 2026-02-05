const sequelize = require('./config/database');
const User = require('./models/User');

const seedUsers = async () => {
    try {
        await sequelize.sync({ force: false });

        const users = [
            {
                name: 'Test Student',
                email: 'student@test.com',
                password: 'password123',
                role: 'student',
                department: 'CSE',
                semester: 6,
                username: 'student1'
            },
            {
                name: 'Test Faculty',
                email: 'faculty@test.com',
                password: 'password123',
                role: 'faculty',
                department: 'CSE',
                username: 'faculty1'
            },
            {
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin',
                username: 'admin1'
            }
        ];

        for (const user of users) {
            const exists = await User.findOne({ where: { email: user.email } });
            if (!exists) {
                await User.create(user);
                console.log(`Created user: ${user.email}`);
            } else {
                console.log(`User already exists: ${user.email}`);
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedUsers();
