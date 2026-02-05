const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Year = sequelize.define('Year', {
    year: {
        type: DataTypes.ENUM('1st Year', '2nd Year', '3rd Year', '4th Year'),
        allowNull: false,
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Departments',
            key: 'id'
        }
    },
}, {
    timestamps: true,
});

module.exports = Year;
