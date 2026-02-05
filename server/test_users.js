const sequelize = require('./config/database');
const User = require('./models/User');

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Try to sync to ensure table exists
        await sequelize.sync();

        console.log('Fetching users...');
        const users = await User.findAll();
        console.log(`Found ${users.length} users.`);
        console.log(JSON.stringify(users, null, 2));

    } catch (error) {
        console.error('Unable to connect to the database or fetch users:');
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

test();
