const sequelize = require('./config/database');
const ODRequest = require('./models/ODRequest');

const sync = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync with force to reset table and fix schema
        // Load all models to trigger associations (Foreign Keys like subjectId)
        const models = require('./models');
        const { AttendanceSession, AttendanceRecord } = models;

        // Use force to reset tables and fix schema (FK issues with sqlite alter)
        // Sync Child (Record) first to drop it, then Parent (Session)
        await AttendanceRecord.sync({ force: true });
        await AttendanceSession.sync({ force: true });

        // ODRequest was forced earlier, now we can alter.
        // await ODRequest.sync({ alter: true }); 

        console.log('Attendance Tables synced (altered).');

    } catch (error) {
        console.error('Sync error:', error);
    } finally {
        await sequelize.close();
    }
};

sync();
