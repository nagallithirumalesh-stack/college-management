const sequelize = require('../config/database');
const models = require('../models');

const emailArg = process.argv[2];

const run = async () => {
    try {
        await sequelize.sync();

        if (emailArg) {
            const user = await models.User.findOne({ where: { email: emailArg }, raw: true });
            console.log('User:', JSON.stringify(user, null, 2));
        } else {
            const users = await models.User.findAll({ raw: true });
            const classrooms = await models.Classroom.findAll({ raw: true });
            console.log('Users:', JSON.stringify(users, null, 2));
            console.log('Classrooms:', JSON.stringify(classrooms, null, 2));
        }
        process.exit(0);
    } catch (err) {
        console.error('list_db failed:', err);
        process.exit(1);
    }
};

run();
