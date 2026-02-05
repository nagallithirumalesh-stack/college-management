const sequelize = require('./config/database');
const Subject = require('./models/Subject');
const ODRequest = require('./models/ODRequest');

const syncModels = async () => {
    try {
        console.log("Syncing Subject & OD Models (Constraint Safety Mode)...");

        await sequelize.query("PRAGMA foreign_keys = OFF");

        await Subject.sync({ alter: true });
        await ODRequest.sync({ alter: true });

        await sequelize.query("PRAGMA foreign_keys = ON");

        console.log("Success.");
    } catch (error) {
        console.error("Sync Error:", error);
    } finally {
        await sequelize.close();
    }
};

syncModels();
