const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true }, // Store URL/Path
    fileType: { type: String, enum: ['pdf', 'image', 'ppt', 'link'], required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    unit: { type: Number }, // Unit 1, Unit 2, etc.
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: true }, // Private vs Public to class
    tags: [{ type: String }],
    isAnonymous: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
