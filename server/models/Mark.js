const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mark = sequelize.define('Mark', {
    examType: {
        type: DataTypes.STRING, // Midsem 1, Final, etc.
        allowNull: false,
    },
    marksObtained: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxMarks: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
    },
}, {
    timestamps: true
});

Mark.associate = (models) => {
    Mark.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });
    Mark.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
};

module.exports = Mark;
