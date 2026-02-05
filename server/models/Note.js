const FirestoreModel = require('./FirestoreModel');

class Note extends FirestoreModel {
    static get collectionName() {
        return 'notes';
    }
}

Note.associate = (models) => { };

module.exports = Note;
