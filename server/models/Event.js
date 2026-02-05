const FirestoreModel = require('./FirestoreModel');

class Event extends FirestoreModel {
    static get collectionName() {
        return 'events';
    }
}

Event.associate = (models) => { };

module.exports = Event;
