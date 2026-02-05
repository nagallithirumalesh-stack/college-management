const FirestoreModel = require('./FirestoreModel');

class Classroom extends FirestoreModel {
    static get collectionName() {
        return 'classrooms';
    }
}

Classroom.associate = (models) => {
    // Relationships handled via ID
};

module.exports = Classroom;
