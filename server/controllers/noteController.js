const Note = require('../models/Note');
const Subject = require('../models/Subject');
const User = require('../models/User');

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
            fileType = 'other'; // Default
            const mime = req.file.mimetype;
            if (mime === 'application/pdf') fileType = 'pdf';
            if (mime.startsWith('image')) fileType = 'image';
            if (mime.includes('powerpoint') || mime.includes('presentation')) fileType = 'ppt';
        }

        const note = await Note.create({
            title,
            description,
            fileUrl,
            fileType,
            subjectId,
            unit,
            uploadedById: req.user.id,
            isPublic: isPublic === 'true' || isPublic === true,
            isAnonymous: isAnonymous === 'true' || isAnonymous === true,
            tags: tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : []
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
        const notes = await Note.findAll({
            where: { subjectId: req.params.subjectId },
            include: [{ model: User, as: 'uploadedBy', attributes: ['name', 'role'] }],
            order: [['createdAt', 'DESC']]
        });
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
        // Fetch public notes
        const notes = await Note.findAll({
            where: { isPublic: true },
            include: [
                { model: User, as: 'uploadedBy', attributes: ['name'] },
                { model: Subject, as: 'subject', attributes: ['name', 'department'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: 10
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
