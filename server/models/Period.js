const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Period = sequelize.define('Period', {
    periodNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    dayOfWeek: {
        type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Period;
