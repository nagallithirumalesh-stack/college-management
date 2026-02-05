const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    grade: {
        type: DataTypes.INTEGER,
    },
    feedback: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM('Submitted', 'Graded', 'Late'),
        defaultValue: 'Submitted',
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true
});

Submission.associate = (models) => {
    Submission.belongsTo(models.Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
    Submission.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });
};

module.exports = Submission;
