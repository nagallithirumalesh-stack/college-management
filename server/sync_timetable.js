const sequelize = require('./config/database');
const models = require('./models');

const sync = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');
        await sequelize.sync({ alter: true });
        console.log('Database synced (alter: true).');
    } catch (error) {
        console.error('Sync error:', error);
    } finally {
        process.exit();
    }
};

sync();
