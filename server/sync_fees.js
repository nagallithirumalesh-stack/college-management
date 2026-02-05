const sequelize = require('./config/database');
const feeModels = require('./modules/fees/models');

const syncSpecificModels = async () => {
    try {
        console.log("Syncing Fee Models to SQLite (Constraint Safety Mode)...");

        // Disable FK checks to allow table reconstruction without constraint errors
        await sequelize.query("PRAGMA foreign_keys = OFF");

        await feeModels.FeeHead.sync({ alter: true });
        await feeModels.FeeStructure.sync({ alter: true });

        // These are the critical ones that had FKs to User
        await feeModels.StudentFee.sync({ alter: true });
        await feeModels.FeeTransaction.sync({ alter: true });

        // Re-enable FK checks (Optional, but good for future sanity)
        await sequelize.query("PRAGMA foreign_keys = ON");

        console.log("Fees Synced Successfully.");
    } catch (error) {
        console.error("Sync Error:", error);
    } finally {
        await sequelize.close();
    }
};

syncSpecificModels();
