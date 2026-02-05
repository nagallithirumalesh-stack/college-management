const FirestoreModel = require('./FirestoreModel');

class Year extends FirestoreModel {
    static get collectionName() {
        return 'years';
    }
}

Year.associate = (models) => { };

module.exports = Year;
