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
    // Faculty mapping: Simplified to a string or FK?
    // Mongoose had `faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }`
    // We will assume association will be set up.
}, {
    timestamps: true
});

Subject.associate = (models) => {
    Subject.belongsTo(models.User, { as: 'faculty', foreignKey: 'facultyId' });
};

module.exports = Subject;
