const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    resource: {
        type: DataTypes.STRING, // Room, or Link
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
    },
}, {
    timestamps: true
});

Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: 'organizerId', as: 'organizer' });
};

module.exports = Event;
