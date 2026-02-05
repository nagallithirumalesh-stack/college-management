const FirestoreModel = require('./FirestoreModel');

class Submission extends FirestoreModel {
    static get collectionName() {
        return 'submissions';
    }
}

Submission.associate = (models) => { };

module.exports = Submission;
