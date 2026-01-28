const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    mood: { type: String, enum: ['Happy', 'Neutral', 'Stressed', 'Excited', 'Tired'], default: 'Neutral' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Journal', JournalSchema);
