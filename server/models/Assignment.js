const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    dueDate: {
        type: DataTypes.DATE,
    },
    maxMarks: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
    },
    fileUrl: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true
});

Assignment.associate = (models) => {
    Assignment.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Assignment.belongsTo(models.User, { foreignKey: 'facultyId', as: 'faculty' });
};

module.exports = Assignment;
