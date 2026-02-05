const FirestoreModel = require('./FirestoreModel');

class Notice extends FirestoreModel {
    static get collectionName() {
        return 'notices';
    }
}

Notice.associate = (models) => { };

module.exports = Notice;
