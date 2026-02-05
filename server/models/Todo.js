const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Todo = sequelize.define('Todo', {
    task: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true
});

Todo.associate = (models) => {
    Todo.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Todo;
