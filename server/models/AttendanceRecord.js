const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AttendanceRecord = sequelize.define('AttendanceRecord', {
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late'),
        defaultValue: 'present',
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deviceInfo: {
        type: DataTypes.JSON, // { deviceId, ip, etc }
    },
    verificationMethod: {
        type: DataTypes.ENUM('qr', 'manual', 'face'),
        defaultValue: 'qr',
    },
    distanceMetadata: {
        type: DataTypes.JSON, // { distance, allowedRadius, units }
    },
}, {
    timestamps: true
});

AttendanceRecord.associate = (models) => {
    AttendanceRecord.belongsTo(models.AttendanceSession, { foreignKey: 'sessionId', as: 'session' });
    AttendanceRecord.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });
};

module.exports = AttendanceRecord;
