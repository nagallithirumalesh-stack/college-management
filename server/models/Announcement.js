const FirestoreModel = require('./FirestoreModel');

class Announcement extends FirestoreModel {
    static get collectionName() {
        return 'announcements';
    }
}

Announcement.associate = (models) => { };

module.exports = Announcement;
