const FirestoreModel = require('./FirestoreModel');

class Journal extends FirestoreModel {
    static get collectionName() {
        return 'journals';
    }
}

Journal.associate = (models) => { };

module.exports = Journal;
