const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ODRequest = sequelize.define('ODRequest', {
    type: {
        type: DataTypes.ENUM('Leave', 'OD', 'Permission'),
        defaultValue: 'Leave',
    },
    studentId: {
        type: DataTypes.STRING, // Changed to STRING for Firestore ID
        allowNull: false,
    },
    purpose: {
        type: DataTypes.STRING,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fromDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    toDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
    },
    proofUrl: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true
});

ODRequest.associate = (models) => {
    // ODRequest.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' }); // Decoupled
};

module.exports = ODRequest;
