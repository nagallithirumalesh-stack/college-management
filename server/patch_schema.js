const sequelize = require('./config/database');

async function patch() {
    try {
        await sequelize.authenticate();
        console.log("DB Connected. Checking Schema...");

        const queryInterface = sequelize.getQueryInterface();

        // 1. Check & Patch Users Table
        const userTable = await queryInterface.describeTable('Users');

        if (!userTable.department) {
            console.log("Adding department to Users...");
            await sequelize.query("ALTER TABLE Users ADD COLUMN department TEXT;");
        }
        if (!userTable.semester) {
            console.log("Adding semester to Users...");
            await sequelize.query("ALTER TABLE Users ADD COLUMN semester INTEGER;");
        }
        if (!userTable.points) {
            console.log("Adding points to Users...");
            await sequelize.query("ALTER TABLE Users ADD COLUMN points INTEGER DEFAULT 0;");
        }
        if (!userTable.band) {
            console.log("Adding band to Users...");
            await sequelize.query("ALTER TABLE Users ADD COLUMN band TEXT DEFAULT 'Bronze';");
        }
        if (!userTable.badges) {
            console.log("Adding badges to Users...");
            await sequelize.query("ALTER TABLE Users ADD COLUMN badges TEXT DEFAULT '[]';");
        }

        // 2. Check & Patch Classrooms Table
        const classTable = await queryInterface.describeTable('Classrooms');
        if (!classTable.section) {
            console.log("Adding section to Classrooms...");
            await sequelize.query("ALTER TABLE Classrooms ADD COLUMN section TEXT DEFAULT 'A';");
        }

        console.log("Schema Patch Complete!");

    } catch (e) {
        console.error("Patch Error:", e);
    } finally {
        process.exit();
    }
}

patch();
