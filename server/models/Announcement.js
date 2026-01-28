const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: ['Circular', 'Event', 'News', 'Alert'],
        default: 'Circular'
    },
    targetAudience: {
        type: String,
        enum: ['All', 'Student', 'Faculty'],
        default: 'All'
    },
    department: { type: String }, // Optional: If specific to a dept
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
