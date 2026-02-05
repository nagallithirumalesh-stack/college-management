const FirestoreModel = require('./FirestoreModel');

class Mark extends FirestoreModel {
    static get collectionName() {
        return 'marks';
    }
}

Mark.associate = (models) => { };

module.exports = Mark;
