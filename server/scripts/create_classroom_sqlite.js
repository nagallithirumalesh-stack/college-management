const models = require('../models');
const sequelize = require('../config/database');

const dept = process.argv[2] || 'CSE';
const sem = parseInt(process.argv[3], 10) || 6;
const section = process.argv[4] || 'A';

const run = async () => {
    try {
        await sequelize.sync();

        const existing = await models.Classroom.findOne({ where: { department: dept, semester: sem, section } });
        if (existing) {
            console.log('Classroom already exists:', existing.toJSON());
            process.exit(0);
        }

        const cls = await models.Classroom.create({ department: dept, semester: sem, section });
        console.log('Created classroom:', cls.toJSON());
        process.exit(0);
    } catch (err) {
        console.error('Failed to create classroom:', err);
        process.exit(1);
    }
};

run();
