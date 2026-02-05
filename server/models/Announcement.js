const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT, // Using TEXT for longer content
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('Circular', 'Event', 'News', 'Alert'),
        defaultValue: 'Circular',
    },
    targetAudience: {
        type: DataTypes.ENUM('All', 'Student', 'Faculty'),
        defaultValue: 'All',
    },
    department: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true
});

Announcement.associate = (models) => {
    Announcement.belongsTo(models.User, { as: 'createdBy', foreignKey: 'createdById' });
};

module.exports = Announcement;
