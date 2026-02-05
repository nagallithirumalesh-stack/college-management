const express = require('express');
const { chatResponse } = require('../controllers/chatController');
const multer = require('multer');

const router = express.Router();

// Configure Multer for memory storage (easiest for parsing buffers directly)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

router.post('/', upload.single('file'), chatResponse);

module.exports = router;
