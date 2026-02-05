const FirestoreModel = require('./FirestoreModel');

class AttendanceSession extends FirestoreModel {
    static get collectionName() {
        return 'attendance_sessions';
    }
}

AttendanceSession.associate = (models) => { };

module.exports = AttendanceSession;
