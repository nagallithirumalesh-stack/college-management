const FirestoreModel = require('./FirestoreModel');

class Period extends FirestoreModel {
    static get collectionName() {
        return 'periods';
    }
}

Period.associate = (models) => { };

module.exports = Period;
