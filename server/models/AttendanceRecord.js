const FirestoreModel = require('./FirestoreModel');

class AttendanceRecord extends FirestoreModel {
    static get collectionName() {
        return 'attendance_records';
    }
}

AttendanceRecord.associate = (models) => { };

module.exports = AttendanceRecord;
