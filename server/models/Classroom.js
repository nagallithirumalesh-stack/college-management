const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String, default: 'A' },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The faculty in charge
}, { timestamps: true });

// Ensure one teacher per class (dept/sem/section tuple)
ClassroomSchema.index({ department: 1, semester: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Classroom', ClassroomSchema);
