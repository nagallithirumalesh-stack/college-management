const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Classroom = sequelize.define('Classroom', {
    department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    section: {
        type: DataTypes.STRING,
        defaultValue: 'A',
    },
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['department', 'semester', 'section']
        }
    ]
});

Classroom.associate = (models) => {
    Classroom.belongsTo(models.User, { foreignKey: 'classTeacherId', as: 'classTeacher' });
};

module.exports = Classroom;
