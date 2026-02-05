const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    unit: {
        type: DataTypes.INTEGER,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    tags: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: [],
    },
    isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    likes: {
        type: DataTypes.JSON, // Array of User IDs
        defaultValue: [],
    },
}, {
    timestamps: true
});

Note.associate = (models) => {
    Note.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Note.belongsTo(models.User, { foreignKey: 'uploadedById', as: 'uploadedBy' });
};

module.exports = Note;
