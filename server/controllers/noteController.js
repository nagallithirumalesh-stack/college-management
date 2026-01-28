const Note = require('../models/Note');
const Subject = require('../models/Subject');

// @desc    Upload a new note
// @route   POST /api/notes
// @access  Private
exports.uploadNote = async (req, res) => {
    try {
        const { title, description, subjectId, unit, tags, isPublic, linkUrl, isAnonymous } = req.body;
        let fileUrl = linkUrl;
        let fileType = 'link';

        if (req.file) {
            fileUrl = req.file.path;
            fileType = req.file.mimetype.split('/')[1] || 'unknown'; // Simple mimetype check
            if (req.file.mimetype === 'application/pdf') fileType = 'pdf';
            if (req.file.mimetype.startsWith('image')) fileType = 'image';
            if (req.file.mimetype.includes('powerpoint') || req.file.mimetype.includes('presentation')) fileType = 'ppt';
        }

        const note = await Note.create({
            title,
            description,
            fileUrl,
            fileType,
            subject: subjectId,
            unit,
            uploadedBy: req.user._id,
            isPublic: isPublic === 'true' || isPublic === true,
            isAnonymous: isAnonymous === 'true' || isAnonymous === true,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get notes for a subject
// @route   GET /api/notes/subject/:subjectId
// @access  Private
exports.getNotesBySubject = async (req, res) => {
    try {
        const notes = await Note.find({ subject: req.params.subjectId })
            .populate('uploadedBy', 'name role')
            .sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get latest notes (for dashboard)
// @route   GET /api/notes/latest
// @access  Private
exports.getLatestNotes = async (req, res) => {
    try {
        // Fetch subjects the user is enrolled in (for students) or teaching (for faculty)
        // For MVP, just return latest public notes
        const notes = await Note.find({ isPublic: true })
            .populate('uploadedBy', 'name')
            .populate('subject', 'name department')
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
