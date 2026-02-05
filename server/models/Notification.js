const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING, // info, warning, success
        defaultValue: 'info',
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true
});

Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Notification;
