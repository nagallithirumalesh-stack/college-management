const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subject = sequelize.define('Subject', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    credits: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
    },
    // Faculty mapping: Firestore User ID
    facultyId: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

Subject.associate = (models) => {
    // Subject.belongsTo(models.User, { as: 'faculty', foreignKey: 'facultyId' }); // Decoupled
};

module.exports = Subject;
