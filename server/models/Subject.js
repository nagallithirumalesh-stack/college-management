const FirestoreModel = require('./FirestoreModel');

class Subject extends FirestoreModel {
    static get collectionName() {
        return 'subjects';
    }
}

// Dummy associate mostly
Subject.associate = (models) => {
    // Relationships handled via ID
};

module.exports = Subject;
