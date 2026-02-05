const FirestoreModel = require('./FirestoreModel');

class Assignment extends FirestoreModel {
    static get collectionName() {
        return 'assignments';
    }
}

Assignment.associate = (models) => { };

module.exports = Assignment;
