const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    resource: {
        type: String,
        enum: ['Main Auditorium', 'Seminar Hall A', 'Seminar Hall B', 'Conference Room'],
        required: true
    },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Approved' // Auto-approve for admins for now
    },
    createdAt: { type: Date, default: Date.now }
});

// Simple conflict validation
eventSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('start') || this.isModified('end') || this.isModified('resource')) {
        const potentialConflict = await mongoose.models.Event.findOne({
            resource: this.resource,
            status: 'Approved',
            _id: { $ne: this._id }, // Exclude self
            $or: [
                { start: { $lt: this.end, $gte: this.start } },
                { end: { $gt: this.start, $lte: this.end } },
                { start: { $lte: this.start }, end: { $gte: this.end } } // Envelops
            ]
        });

        if (potentialConflict) {
            const err = new Error('Conflict: This resource is already booked for the selected time.');
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);
