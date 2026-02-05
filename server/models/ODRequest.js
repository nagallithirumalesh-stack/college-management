const FirestoreModel = require('./FirestoreModel');

class ODRequest extends FirestoreModel {
    static get collectionName() {
        return 'od_requests';
    }
}

ODRequest.associate = (models) => { };

module.exports = ODRequest;
