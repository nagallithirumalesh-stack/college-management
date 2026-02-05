const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Journal = sequelize.define('Journal', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
    },
    mood: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true
});

Journal.associate = (models) => {
    Journal.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Journal;
