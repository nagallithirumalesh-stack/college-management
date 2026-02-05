const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// 1. Fee Head (e.g., Tuition, Transport, Lab)
const FeeHead = sequelize.define('FeeHead', {
    uniqueId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // Tuition Fee, Transport Fee
    type: { type: DataTypes.ENUM('ACADEMIC', 'NON_ACADEMIC'), defaultValue: 'ACADEMIC' },
    description: { type: DataTypes.STRING },
});

// 2. Fee Structure (Templates)
// Defines that "CSE Sem 1 2024" has a total tuition fee of 50,000
const FeeStructure = sequelize.define('FeeStructure', {
    uniqueId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // "B.Tech CSE - 2024-28 Batch - Year 1"
    department: { type: DataTypes.STRING }, // CSE
    semester: { type: DataTypes.INTEGER }, // 1
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    academicYear: { type: DataTypes.STRING }, // 2024-2025
    breakdown: { type: DataTypes.JSON }, // Store JSON array of heads: [{headId, amount}, ...]
});

// 3. Student Fee Ledger
// Links a student to a fee structure and tracks their payment status
const StudentFee = sequelize.define('StudentFee', {
    uniqueId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paidAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    pendingAmount: { type: DataTypes.DECIMAL(10, 2) }, // Virtual/Calculated usually, but storing for quick query
    status: { type: DataTypes.ENUM('PAID', 'PARTIAL', 'PENDING', 'OVERDUE'), defaultValue: 'PENDING' },
    dueDate: { type: DataTypes.DATEONLY },
    // Explicit Foreign Keys
    studentId: { type: DataTypes.STRING, allowNull: false }, // Firestore User ID
    structureId: { type: DataTypes.UUID, allowNull: false } // FeeStructure ID
});

// 4. Fee Transaction
// Each payment made by a student
const FeeTransaction = sequelize.define('FeeTransaction', {
    uniqueId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paymentMode: { type: DataTypes.ENUM('ONLINE', 'CASH', 'UPI', 'DD'), defaultValue: 'ONLINE' },
    transactionId: { type: DataTypes.STRING }, // Bank Ref ID
    paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('SUCCESS', 'FAILED', 'PENDING'), defaultValue: 'SUCCESS' },
    receiptNo: { type: DataTypes.STRING }, // Auto-generated
    // Explicit Foreign Keys
    studentFeeId: { type: DataTypes.UUID, allowNull: false },
    studentId: { type: DataTypes.STRING, allowNull: false } // Firestore User ID
});

// Associations
const setupAssociations = (models) => {
    // Fee Structure Associations
    // (Optional: Link to FeeHeads...)

    // StudentFee Associations
    // StudentFee.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' }); // REMOVED: User is in Firestore
    StudentFee.belongsTo(FeeStructure, { as: 'structure', foreignKey: 'structureId' });

    // FeeTransaction Associations
    FeeTransaction.belongsTo(StudentFee, { as: 'studentFee', foreignKey: 'studentFeeId' });
    // FeeTransaction.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' }); // REMOVED: User is in Firestore
};

// Export all models
module.exports = {
    FeeHead,
    FeeStructure,
    StudentFee,
    FeeTransaction,
    setupAssociations // Export function to init associations
};
