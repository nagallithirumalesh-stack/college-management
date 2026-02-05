const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PerformanceMetric = sequelize.define('PerformanceMetric', {
    cpa: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    attendancePercentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    creditsEarned: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true
});

PerformanceMetric.associate = (models) => {
    PerformanceMetric.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });
};

module.exports = PerformanceMetric;
