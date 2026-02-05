const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AttendanceSession = sequelize.define('AttendanceSession', {
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    type: {
        type: DataTypes.ENUM('QR', 'MANUAL'),
        defaultValue: 'QR',
    },
    startTime: {
        type: DataTypes.DATE,
    },
    endTime: {
        type: DataTypes.DATE,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    location: {
        type: DataTypes.JSON, // { lat, long, radius }
    },
    qrCode: {
        type: DataTypes.TEXT, // Encrypted string or URL
    },
}, {
    timestamps: true
});

AttendanceSession.associate = (models) => {
    AttendanceSession.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    AttendanceSession.belongsTo(models.User, { foreignKey: 'facultyId', as: 'faculty' });
    AttendanceSession.hasMany(models.AttendanceRecord, { foreignKey: 'sessionId', as: 'records' });
};

module.exports = AttendanceSession;
