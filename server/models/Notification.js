const FirestoreModel = require('./FirestoreModel');

class Notification extends FirestoreModel {
    static get collectionName() {
        return 'notifications';
    }
}

Notification.associate = (models) => { };

module.exports = Notification;
