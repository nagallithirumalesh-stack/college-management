const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    assessmentType: { type: String, required: true }, // Mid-1, Assignment-1, Lab, etc.
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Mark', MarkSchema);
