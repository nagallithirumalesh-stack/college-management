const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetAudience: { type: String, enum: ['all', 'faculty', 'student', 'department'], default: 'all' },
    department: { type: String }, // Optional, if target is department
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);
