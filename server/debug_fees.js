const { sequelize } = require('./config/database');
const { FeeTransaction, StudentFee, FeeStructure, User } = require('./models');

(async () => {
    try {
        console.log('Testing Fees Association Query...');
        const transactions = await FeeTransaction.findAll({
            include: [
                { model: User, as: 'student', attributes: ['name', 'rollNo', 'department', 'semester'] },
                {
                    model: StudentFee,
                    as: 'studentFee',
                    include: [{ model: FeeStructure, as: 'structure', attributes: ['name'] }]
                }
            ],
            limit: 5
        });
        console.log('Transactions found:', transactions.length);
        console.log(JSON.stringify(transactions, null, 2));
    } catch (error) {
        console.error('Query Failed:', error);
    } finally {
        // await sequelize.close(); // Keep open if needed or close
    }
})();
