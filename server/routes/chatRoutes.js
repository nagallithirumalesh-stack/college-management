const express = require('express');
const { chatResponse } = require('../controllers/chatController');
const router = express.Router();

router.post('/', chatResponse);

module.exports = router;
