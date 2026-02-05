const sequelize = require('./config/database');
const { StudentFee, FeeStructure, User } = require('./models');

async function testQuery() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Ensure models are synced (this might fix it if it was a sync issue)
        // await sequelize.sync(); 

        // Simulate the query in controller.js
        // We need a student ID. Let's find one first.
        const user = await User.findOne({ where: { role: 'student' } });
        if (!user) {
            console.log("No student found to test with.");
            return;
        }
        console.log(`Testing with student: ${user.name} (${user.id})`);

        const feeRecord = await StudentFee.findOne({
            where: { studentId: user.id },
            include: [{ model: FeeStructure, as: 'structure' }]
        });

        console.log("Query success!");
        console.log("Record:", feeRecord ? feeRecord.toJSON() : "null");

    } catch (error) {
        console.error("Query Failed:", error);
    } finally {
        await sequelize.close();
    }
}

testQuery();
