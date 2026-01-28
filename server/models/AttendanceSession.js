const mongoose = require('mongoose');

const AttendanceSessionSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    qrCode: { type: String, required: true }, // Unique session token
    active: { type: Boolean, default: true },
    geofence: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        radius: { type: Number, default: 200 } // Meters
    },
    expiresAt: { type: Date, required: true, index: { expires: '1d' } } // Auto-delete after 1 day cleanup
}, { timestamps: true });

module.exports = mongoose.model('AttendanceSession', AttendanceSessionSchema);
