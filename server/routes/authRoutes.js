const express = require('express');
const { registerUser, loginUser, getMe, getUsers, deleteUser, updateProfilePhoto } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const start = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && start) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/profile/photo', protect, upload.single('photo'), updateProfilePhoto);

router.get('/users', protect, restrictTo('admin'), getUsers);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);

module.exports = router;
