const mongoose = require('mongoose');

const odRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        // Optional: null means it applies to all subjects (e.g., Medical Leave for whole day)
    },
    type: {
        type: String,
        enum: ['OD', 'Leave'],
        default: 'OD'
    },
    dates: [{
        type: Date,
        required: true
    }],
    reason: {
        type: String,
        required: true
    },
    documents: [{
        type: String // URL to uploaded proof
    }],
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalRemarks: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ODRequest', odRequestSchema);
