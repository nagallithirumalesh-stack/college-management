const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    rollNo: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'faculty', 'student'),
        defaultValue: 'student',
    },
    department: {
        type: DataTypes.STRING,
    },
    semester: {
        type: DataTypes.INTEGER,
    },
    section: {
        type: DataTypes.STRING,
        defaultValue: 'A'
    },
    // Gamification fields
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    band: {
        type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Platinum'),
        defaultValue: 'Bronze',
    },
    badges: {
        type: DataTypes.JSON, // Storing array as JSON
        defaultValue: [],
    },

    profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

// Instance method to match password
User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
