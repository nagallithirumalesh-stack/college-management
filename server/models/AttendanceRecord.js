const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['present', 'absent'], default: 'present' },
    locationVerified: { type: Boolean, default: false },
    locationData: { // Snapshot of where they were
        latitude: Number,
        longitude: Number,
        distance: Number
    },
    deviceInfo: { type: String }
}, { timestamps: true });

// Prevent duplicate attendance for same session
AttendanceRecordSchema.index({ session: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceRecord', AttendanceRecordSchema);
