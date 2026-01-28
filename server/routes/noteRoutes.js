const express = require('express');
const multer = require('multer');
const { uploadNote, getNotesBySubject, getLatestNotes } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.route('/')
    .post(protect, upload.single('file'), uploadNote);

router.route('/latest')
    .get(protect, getLatestNotes);

router.route('/subject/:subjectId')
    .get(protect, getNotesBySubject);

module.exports = router;
