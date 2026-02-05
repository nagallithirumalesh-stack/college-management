const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Timetable = sequelize.define('Timetable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    day: {
        type: DataTypes.STRING, // 'Monday', 'Tuesday', etc.
        allowNull: false
    },
    startTime: {
        type: DataTypes.STRING, // '09:00'
        allowNull: false
    },
    endTime: {
        type: DataTypes.STRING, // '09:50'
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('LECTURE', 'LAB', 'BREAK'),
        defaultValue: 'LECTURE'
    },
    room: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // FKs will be added via associations: subjectId, facultyId, classroomId
}, {
    tableName: 'timetables',
    timestamps: true
});

const setupAssociations = (models) => {
    Timetable.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Timetable.belongsTo(models.User, { foreignKey: 'facultyId', as: 'faculty' });
    Timetable.belongsTo(models.Classroom, { foreignKey: 'classroomId', as: 'classroom' });
};

module.exports = { Timetable, setupAssociations };
